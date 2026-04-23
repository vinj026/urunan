<script setup>
import { formatRupiah, getInisial } from '~/utils/calculate'

const props = defineProps({
  peserta: Array,
  totalSesi: Number
})
const emit = defineEmits(['submit', 'calculate'])

const localItem = ref({
  nama: '',
  harga: '',
  peserta: []
})

function toggleParticipant(p) {
  const idx = localItem.value.peserta.indexOf(p)
  if (idx === -1) localItem.value.peserta.push(p)
  else localItem.value.peserta.splice(idx, 1)
}

function handleAdd() {
  if (!localItem.value.nama.trim() || !localItem.value.harga || localItem.value.peserta.length === 0) return
  emit('submit', {
    nama: localItem.value.nama.trim(),
    harga: Number(localItem.value.harga),
    peserta: [...localItem.value.peserta],
  })
  // Reset
  localItem.value = { nama: '', harga: '', peserta: [] }
}
</script>

<template>
  <div class="fixed bottom-0 w-full max-w-[480px] bg-bg-primary border-t border-[#1a1a1a] z-40 bg-black">
    <!-- Add Form -->
    <div class="px-5 py-4 space-y-2">
      <!-- Input Row -->
      <div class="grid grid-cols-12 gap-2 mb-1">
        <div class="col-span-7">
          <input v-model="localItem.nama"
            class="w-full h-[46px] bg-bg-tertiary border border-border-default rounded-[8px] px-3 text-[15px] text-text-primary focus:border-border-active focus:ring-0 placeholder:text-text-tertiary outline-none transition-colors font-medium"
            placeholder="Nama item..." type="text" />
        </div>
        <div class="col-span-5 relative">
          <span class="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-[12px] text-text-tertiary">Rp</span>
          <input v-model="localItem.harga"
            class="w-full h-[46px] bg-bg-tertiary border border-border-default rounded-[8px] pl-9 pr-3 text-[15px] text-text-primary font-mono focus:border-border-active focus:ring-0 placeholder:text-text-tertiary outline-none transition-colors"
            placeholder="0" type="number" />
        </div>
      </div>

      <!-- Participant Toggle Chips -->
      <div class="flex items-center gap-2 py-1">
        <span class="font-bold text-[#555] uppercase text-[12px] tracking-widest mr-1.5">Assign:</span>
        <div class="flex gap-[5px] flex-wrap">
          <button v-for="p in peserta" :key="p" @click="toggleParticipant(p)" :class="[
            'w-[28px] h-[28px] rounded-full flex items-center justify-center font-avatar text-[11px] font-semibold transition-all active:scale-95',
            localItem.peserta.includes(p) ? 'bg-white text-black border-none' : 'bg-[#1a1a1a] border border-[#333] text-[#555]'
          ]">
            {{ getInisial(p, peserta) }}
          </button>
        </div>
      </div>


      <!-- Add Button -->
      <button @click="handleAdd"
        class="w-full h-[44px] bg-zinc-950 border border-[#1a1a1a] hover:bg-zinc-900 transition-colors flex items-center justify-center gap-2 text-text-primary active:scale-[0.98] duration-100 uppercase tracking-widest text-[12px] font-bold rounded-[8px]">
        <span class="material-symbols-outlined text-[14px]">add_circle</span>
        Tambah item
      </button>
    </div>

    <!-- Footer Actions -->
    <footer class="px-5 pb-8 pt-1 flex flex-col gap-3 bg-black">
      <div class="flex justify-between items-center px-0.5">
        <span class="text-[12px] text-[#555] uppercase tracking-widest font-black">Total Sesi</span>
        <span class="font-mono text-[15px] font-bold text-white">{{ formatRupiah(totalSesi) }}</span>
      </div>
      <button @click="$emit('calculate')"
        class="w-full h-[48px] bg-primary text-black font-bold uppercase tracking-widest text-[13px] flex items-center justify-center gap-1.5 active:scale-[0.98] transition-all disabled:opacity-20 rounded-[8px]">
        Hitung
        <span class="material-symbols-outlined text-[16px]">bolt</span>
      </button>
    </footer>
  </div>



</template>
