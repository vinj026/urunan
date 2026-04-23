<script setup>
import { formatRupiah, getInisial } from '~/utils/calculate'

const props = defineProps({
  item: Object,
  sessionPeserta: Array
})

defineEmits(['delete', 'toggle-peserta'])

function isSelected(p) {
  return props.item.peserta.includes(p)
}
</script>

<template>
  <div class="bg-bg-secondary border border-[#1a1a1a] rounded-[8px] p-[16px_18px] space-y-2 transition-all">
    <!-- Header -->
    <div class="flex justify-between items-start mb-1">
      <div class="space-y-0.5 max-w-[80%]">
        <h3 class="text-[15px] font-medium text-white truncate">{{ item.nama }}</h3>
        <p class="font-mono text-[14px] text-[#888]">{{ formatRupiah(item.harga) }}</p>
      </div>
      <button @click="$emit('delete', item.id)"
        class="text-[#444] hover:text-[#ff4444] transition-colors p-1.5 -mr-1.5 flex items-center justify-center">
        <span class="material-symbols-outlined text-[18px]">delete</span>
      </button>
    </div>

    <!-- Participants Selection -->
    <div class="space-y-1.5">
      <div class="flex justify-between items-center mr-0.5 mb-1.5">
        <label class="text-[12px] font-bold uppercase tracking-widest text-[#555]">Siapa yang ikut?</label>
        <span v-if="item.peserta.length > 0 && item.peserta.length < sessionPeserta.length"
          class="text-[12px] font-mono text-[#555] uppercase tracking-widest">{{ item.peserta.length }} orang</span>
      </div>

      <div class="flex flex-wrap gap-[5px]">
        <button v-for="p in sessionPeserta" :key="p" @click="$emit('toggle-peserta', p, sessionPeserta)" :class="[
          'w-[28px] h-[28px] rounded-full flex items-center justify-center font-avatar text-[11px] font-semibold transition-all active:scale-90',
          isSelected(p) ? 'bg-white text-black border-none' : 'bg-[#1a1a1a] border border-[#333] text-[#555]'
        ]">
          {{ getInisial(p, sessionPeserta) }}
        </button>
      </div>

    </div>
  </div>



</template>
