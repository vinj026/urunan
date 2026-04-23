<script setup>
import { hitungTransaksi, formatRupiah, hitungTagihanPerOrang, getInisial } from '~/utils/calculate'

const route = useRoute()
const { decodeFromURL, clearLocal } = useSession()

// State
const sesi = ref(null)
const transaksi = ref([])
const breakdown = ref({})
const errorDecode = ref(false)
const copiedText = ref(false)
const showBreakdown = ref(false)

onMounted(() => {
  try {
    const encoded = route.query.s
    if (!encoded) {
      errorDecode.value = true
      return
    }
    sesi.value = decodeFromURL(encoded)
    transaksi.value = hitungTransaksi(sesi.value)
    breakdown.value = hitungTagihanPerOrang(sesi.value)
  } catch (e) {
    console.error(e)
    errorDecode.value = true
  }
})

async function handleCopyLink() {
  try {
    const shareData = {
      title: `SplitTagih: ${sesi.value.nama}`,
      text: `💰 Detail tagihan "${sesi.value.nama}" sudah siap. Cek di sini:`,
      url: window.location.href
    }
    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      await navigator.share(shareData)
    } else {
      await navigator.clipboard.writeText(window.location.href)
      alert('Link berhasil disalin!')
    }
  } catch (e) {
    console.error(e)
  }
}

async function handleCopyRingkasan() {
  try {
    const lines = [
      `📊 SUMMARY: ${sesi.value.nama}`,
      '---',
      ...transaksi.value.map(t =>
        `${t.dari} bayar Rp ${t.jumlah.toLocaleString('id-ID')} ke ${t.ke}`
      )
    ]
    if (transaksi.value.length === 0) lines.push('Tidak ada yang perlu transfer ✨')

    await navigator.clipboard.writeText(lines.join('\n'))
    copiedText.value = true
    setTimeout(() => copiedText.value = false, 2000)
  } catch (e) {
    console.error(e)
  }
}

function handleSesiBaru() {
  clearLocal()
  navigateTo('/')
}
</script>

<template>
  <div class="min-h-screen bg-black relative pb-[120px] text-white overflow-y-auto no-scrollbar">

    <!-- Error State -->
    <main v-if="errorDecode" class="flex flex-col items-center justify-center p-6 text-center space-y-6 pt-20">
      <span class="material-symbols-outlined text-[64px] text-destructive opacity-50">link_off</span>
      <h2 class="text-xl font-bold">Link Tidak Valid</h2>
      <button @click="navigateTo('/')"
        class="bg-primary text-black font-bold h-14 px-8 rounded-xl active:scale-95 transition-all">Buat Sesi
        Baru</button>
    </main>

    <!-- Main Content wrapper -->
    <div v-else-if="sesi">
      <!-- KONTEN SCROLL (nama acara, transfer cards, sudah bayar, rincian) -->
      <div class="px-5 pt-6 flex flex-col gap-[20px]">
        <header>
          <h1 class="text-[18px] font-semibold text-white tracking-tight leading-none mb-1">{{ sesi.nama }}</h1>
          <div class="h-[1px] w-6 bg-[#222] mt-[4px]"></div>
        </header>

        <!-- Section 1: Transfer -->
        <section class="space-y-2">
          <label class="text-[11px] font-bold text-[#555] uppercase tracking-widest ml-0.5 mb-2">Transfer yang perlu
            dilakukan</label>

          <div v-if="transaksi.length === 0"
            class="bg-bg-secondary border border-[#1a1a1a] rounded-[6px] py-10 px-5 text-center space-y-3 shadow-xl">
            <div
              class="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center mx-auto text-success border border-success/20">
              <span class="material-symbols-outlined text-[24px]">celebration</span>
            </div>
            <p class="text-white text-[12px] font-bold uppercase tracking-widest italic opacity-70">Gak ada hutang ✨</p>
          </div>

          <div class="grid gap-[5px]">
            <SummaryCard v-for="(t, idx) in transaksi" :key="idx" :transaksi="t" :peserta="sesi.peserta" />
          </div>
        </section>

        <!-- Section 2: Yang sudah bayar duluan -->
        <section class="space-y-2">
          <label class="text-[12px] font-bold text-[#555] uppercase tracking-widest ml-0.5 mb-2">Sudah bayar
            duluan</label>
          <div class="bg-bg-secondary border border-[#1a1a1a] rounded-[8px] p-[14px_16px] shadow-sm">
            <div class="flex items-center gap-3">
              <div
                class="w-[36px] h-[36px] rounded-full bg-primary border border-primary/20 flex items-center justify-center font-avatar text-[12px] font-semibold text-black shadow-sm">
                {{ getInisial(sesi.pembayar, sesi.peserta) }}
              </div>

              <div class="flex-1 min-w-0 flex items-center gap-2">
                <p class="text-[15px] text-white font-medium truncate">{{ sesi.pembayar }}</p>
                <div class="text-[12px] text-[#888] font-medium flex gap-1.5 mt-[2px]">
                  <p>Bayar: <span class="text-white">{{formatRupiah(sesi.items.reduce((a, b) => a + Number(b.harga),
                    0))}}</span></p>
                  <span>·</span>
                  <p>Dapat: <span class="text-primary">{{formatRupiah(transaksi.reduce((a, b) => a + b.jumlah,
                    0))}}</span></p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Breakdown -->
        <section class="pt-2 space-y-2">
          <button @click="showBreakdown = !showBreakdown"
            class="group flex items-center gap-1.5 text-[12px] font-bold text-[#555] uppercase tracking-widest hover:text-white transition-all py-2 w-full">
            <span>Rincian</span>
            <span class="material-symbols-outlined text-[14px] transition-transform duration-300"
              :class="{ 'rotate-180': showBreakdown }">expand_more</span>
          </button>

          <Transition name="expand">
            <div v-if="showBreakdown" class="mt-[8px] space-y-3">
              <div v-for="p in sesi.peserta" :key="p" class="space-y-1">
                <!-- User Header Inline -->
                <div class="flex justify-between items-center mb-1">
                  <h3 class="text-[12px] font-medium uppercase tracking-widest text-[#888]">{{ p }}</h3>
                  <span class="text-[12px] font-mono font-medium text-primary/80">{{ formatRupiah(breakdown[p])
                    }}</span>
                </div>

                <!-- Item List (Ultra-Compact) -->
                <div class="space-y-0.5">
                  <div v-for="item in sesi.items.filter(i => i.peserta.includes(p))" :key="item.id"
                    class="flex justify-between items-baseline py-[2px] text-[13px]">
                    <span class="text-[#888] truncate pr-4">{{ item.nama }}</span>
                    <span class="font-mono text-[#888] shrink-0">{{ formatRupiah(item.harga /
                      item.peserta.length) }}</span>
                  </div>
                </div>

                <!-- Total Row (Minimal Result) -->
                <div v-if="sesi.items.filter(i => i.peserta.includes(p)).length > 1"
                  class="flex justify-between items-center pt-2 border-t border-[#1a1a1a] mt-[6px] mb-[4px]">
                  <div class="flex-1"></div>
                  <span class="text-[13px] font-mono font-bold text-white">{{ formatRupiah(breakdown[p]) }}</span>
                </div>
              </div>
            </div>
          </Transition>
        </section>
      </div>

      <!-- STICKY BOTTOM BAR -->
      <div class="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px]
                  bg-black border-t border-[#1a1a1a] px-5 pt-3 pb-4
                  z-50" style="padding-bottom: calc(1rem + env(safe-area-inset-bottom))">

        <!-- SHARE + COPY side by side -->
        <div class="grid grid-cols-2 gap-2 mb-2">
          <button @click="handleCopyLink"
            class="h-11 rounded-lg border border-[#333] hover:bg-[#111] transition-all text-white
                         text-[12px] uppercase tracking-widest font-bold flex items-center justify-center gap-1.5 active:scale-[0.98]">
            <span class="material-symbols-outlined text-[14px]">share</span>
            Share
          </button>
          <button @click="handleCopyRingkasan" :class="[
            'h-11 rounded-lg text-[12px] uppercase tracking-widest font-bold flex items-center justify-center gap-1.5 transition-all active:scale-[0.98]',
            copiedText ? 'bg-success text-black' : 'bg-white text-black hover:bg-white/90'
          ]">
            <span class="material-symbols-outlined text-[14px]">{{ copiedText ? 'done_all' : 'file_copy' }}</span>
            {{ copiedText ? 'Salin' : 'Copy' }}
          </button>
        </div>

        <!-- EDIT TAGIHAN full width -->
        <button @click="navigateTo('/tagihan')" class="w-full h-9 text-[11px] uppercase tracking-widest
                       text-[#555] flex items-center justify-center gap-1.5
                       hover:text-white transition-colors">
          <span class="material-symbols-outlined text-[16px]">arrow_back</span>
          Edit Tagihan
        </button>

        <!-- BUAT SESI BARU -->
        <button @click="handleSesiBaru" class="w-full h-[36px] text-[11px] uppercase tracking-widest
                       text-[#555] flex items-center justify-center gap-1.5
                       hover:text-white transition-colors mt-1">
          <span class="material-symbols-outlined text-[12px]">add</span>
          Buat Sesi Baru
        </button>

      </div>
    </div>
  </div>
</template>

<style scoped>
.expand-enter-active,
.expand-leave-active {
  transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  transform: translateY(-20px);
  max-height: 0;
}

.expand-enter-to,
.expand-leave-from {
  opacity: 1;
  max-height: 5000px;
}
</style>
