<script setup>
const { sesi, setNama, tambahPeserta, hapusPeserta, saveToLocal, loadFromLocal, clearLocal } = useSession()

const inputNama = ref('')
const adaSesiTersimpan = ref(false)

watch(inputNama, (val) => setNama(val))

function handleTambahPeserta(nama) {
  tambahPeserta(nama)
  saveToLocal()
}

function handleHapusPeserta(nama) {
  hapusPeserta(nama)
  saveToLocal()
}

const bisaLanjut = computed(() =>
  sesi.value.nama.trim() !== '' && sesi.value.peserta.length >= 2
)

function handleLanjut() {
  if (!bisaLanjut.value) return
  saveToLocal()
  navigateTo('/tagihan')
}

function handleLanjutEdit() {
  navigateTo('/tagihan')
}

function handleMulaiBaru() {
  clearLocal()
  inputNama.value = ''
  adaSesiTersimpan.value = false
}

onMounted(() => {
  loadFromLocal()
  if (sesi.value.nama && sesi.value.peserta.length >= 2) {
    adaSesiTersimpan.value = true
    inputNama.value = sesi.value.nama
  }
})
</script>

<template>
  <div class="flex flex-col h-screen overflow-hidden bg-black">
    <!-- Main Content -->
    <main class="flex-1 overflow-y-auto px-5 pt-6 space-y-6 no-scrollbar bg-black">
      <header class="space-y-1">
        <h1 class="text-[22px] font-semibold text-white tracking-tight leading-none">Buat Tagihan</h1>
        <p class="text-[14px] text-text-tertiary mt-2">Tagih tanpa awkward.</p>
      </header>

      <div class="space-y-6">
        <!-- Resume Banner -->
        <div v-if="adaSesiTersimpan"
          class="bg-[#0a0a0a] border border-[#222] rounded-[8px] p-[12px_14px] flex flex-col gap-2">
          <div class="flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[14px] text-[#555]">history</span>
            <span class="text-[11px] uppercase text-[#555] tracking-widest font-bold mt-[1px]">Sesi tersimpan</span>
          </div>
          <div class="space-y-0.5">
            <p class="text-[14px] text-white font-medium">{{ sesi.nama }}</p>
            <p class="text-[12px] text-[#555]">{{ sesi.peserta.length }} peserta &middot; {{ sesi.items.length }} item
            </p>
          </div>
          <div class="flex gap-1.5 mt-1">
            <button @click="handleLanjutEdit"
              class="flex-1 h-[32px] bg-[#1a1a1a] hover:bg-[#222] text-white text-[12px] font-medium rounded-[6px] transition-colors">
              Lanjut Edit
            </button>
            <button @click="handleMulaiBaru"
              class="flex-1 h-[32px] border border-[#333] hover:border-[#444] text-[#888] hover:text-white text-[12px] font-medium rounded-[6px] transition-colors">
              Mulai Baru
            </button>
          </div>
        </div>

        <!-- Nama Acara -->
        <div class="space-y-2">
          <label class="font-bold uppercase tracking-widest text-[12px] text-[#555] ml-0.5 mb-2">Nama acara</label>
          <input v-model="inputNama"
            class="w-full h-[48px] bg-bg-tertiary border border-border-default rounded-[8px] px-[14px] text-[15px] font-medium text-text-primary focus:border-border-active focus:ring-0 placeholder:text-text-tertiary outline-none transition-all"
            placeholder="Nama acara (misal: Makan Malam)" type="text" />
        </div>

        <!-- Peserta -->
        <div class="space-y-2">
          <label class="font-bold uppercase tracking-widest text-[12px] text-[#555] ml-0.5 mb-2">Siapa aja yang
            ikut?</label>
          <PesertaInput :peserta="sesi.peserta" @add="handleTambahPeserta" @remove="handleHapusPeserta" />
        </div>
      </div>
    </main>


    <!-- Footer Action -->
    <footer class="p-5 pb-8 bg-bg-primary border-t border-[#1a1a1a]">
      <button @click="handleLanjut" :disabled="!bisaLanjut"
        class="w-full h-[48px] bg-primary text-black font-semibold uppercase tracking-widest text-[15px] flex items-center justify-center gap-2 active:scale-[0.98] transition-all disabled:opacity-20 rounded-[8px]">

        Lanjut
        <span class="material-symbols-outlined text-[18px]">trending_flat</span>
      </button>
      <p v-if="!bisaLanjut" class="text-center text-[12px] text-[#555] mt-4 uppercase tracking-widest font-medium">
        Minimal 2 peserta & nama acara</p>
    </footer>

  </div>
</template>
