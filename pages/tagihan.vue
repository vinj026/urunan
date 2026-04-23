<script setup>
import { formatRupiah } from '~/utils/calculate'

const {
  sesi, tambahItem, hapusItem, totalTagihan, encodeToURL, saveToLocal, loadFromLocal, togglePesertaItem, setPembayar
} = useSession()

onMounted(() => {
  loadFromLocal()
  if (!sesi.value.nama || sesi.value.peserta.length < 2) {
    navigateTo('/')
  }
})

function handleTambahItem(itemData) {
  tambahItem(itemData)
  saveToLocal()
}

function handleHapusItem(id) {
  hapusItem(id)
  saveToLocal()
}

function handleHitung() {
  if (sesi.value.items.length === 0) return
  saveToLocal()
  const encoded = encodeToURL()
  navigateTo(`/ringkasan?s=${encoded}`)
}
</script>

<template>
  <div class="flex flex-col h-screen overflow-hidden bg-black">
    <!-- Main Content -->
    <main class="w-full flex-1 pb-[280px] pt-6 overflow-y-auto no-scrollbar bg-black">
      <!-- Header Section -->
      <header class="px-5 space-y-4 mb-[20px]">
        <button @click="navigateTo('/')"
          class="flex items-center gap-1.5 text-[13px] font-medium text-[#555] hover:text-white transition-colors group mb-3">
          <span class="material-symbols-outlined text-[16px]">arrow_back</span>
          Kembali
        </button>

        <div class="space-y-0.5">
          <h1 class="text-[28px] font-semibold text-white tracking-tight leading-none">Detail Tagihan</h1>
          <p class="text-[16px] text-[#555] font-medium mt-2">{{ sesi.nama }} ({{ sesi.peserta.length }} Orang)</p>
        </div>


        <!-- Global Payer Selection -->
        <div class="pt-2 space-y-2">
          <label class="text-[12px] font-bold uppercase tracking-widest text-[#555] ml-0.5 mb-2">Siapa yang bayar
            duluan?</label>
          <div class="flex gap-1.5 flex-wrap py-1">
            <button v-for="p in sesi.peserta" :key="p" @click="setPembayar(p); saveToLocal();" :class="[
              'h-[34px] px-[12px] rounded-full border text-[13px] font-medium transition-all flex items-center whitespace-nowrap active:scale-95',
              sesi.pembayar === p ? 'bg-white text-black border-white shadow-lg' : 'bg-[#111] border-[#333] text-[#888]'
            ]">
              <span v-if="sesi.pembayar === p"
                class="material-symbols-outlined text-[12px] text-black font-bold mr-1 align-middle">done</span>
              {{ p }}
            </button>
          </div>
        </div>


      </header>



      <!-- Items Section -->
      <section class="flex-1 no-scrollbar pb-10 pt-4 bg-black">
        <div class="px-5 space-y-5">
          <div class="flex justify-between items-center px-0.5">
            <h2 class="tracking-widest uppercase text-[11px] text-[#555] font-bold">Daftar Item</h2>
            <span class="text-[11px] font-mono text-[#555] font-medium">{{ sesi.items.length }} ITEM</span>
          </div>

          <!-- Empty State -->
          <div v-if="sesi.items.length === 0"
            class="py-12 border border-dashed border-[#1a1a1a] rounded-[6px] flex flex-col items-center justify-center text-center space-y-3 opacity-40">
            <span class="material-symbols-outlined text-[32px] text-[#555]">receipt_long</span>
            <div class="space-y-0.5">
              <p class="text-[11px] uppercase tracking-widest font-bold text-text-secondary">Belum ada item</p>
              <p class="text-[10px] text-[#444]">Tambah item di bawah</p>
            </div>
          </div>

          <!-- Item List -->
          <div class="grid gap-[6px]">
            <ItemCard v-for="item in sesi.items" :key="item.id" :item="item" :sessionPeserta="sesi.peserta"
              @delete="handleHapusItem" @toggle-peserta="(p) => { togglePesertaItem(item.id, p); saveToLocal(); }" />
          </div>
        </div>
      </section>

    </main>

    <!-- Sticky Bottom Form Container -->
    <ItemInput :peserta="sesi.peserta" :totalSesi="totalTagihan" @submit="handleTambahItem" @calculate="handleHitung" />
  </div>
</template>
