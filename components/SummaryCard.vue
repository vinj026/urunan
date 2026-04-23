<script setup>
import { getInisial, formatRupiah } from '~/utils/calculate'

defineProps({
  transaksi: Object,
  peserta: Array
})
</script>

<template>
  <div
    class="bg-bg-secondary border border-[#1a1a1a] rounded-[8px] h-[58px] px-[14px] flex items-center justify-between transition-all group overflow-hidden">
    <div class="flex items-center gap-3 flex-1">
      <!-- connected avatars -->
      <div class="flex items-center gap-1.5 shrink-0">
        <div
          class="w-[36px] h-[36px] rounded-full border border-zinc-800 bg-[#111] flex items-center justify-center font-avatar text-[12px] font-semibold text-text-primary shadow-sm">
          {{ getInisial(transaksi.dari, peserta) }}
        </div>
        <span class="material-symbols-outlined text-[16px] text-[#444] font-bold">east</span>
        <div
          class="w-[36px] h-[36px] rounded-full border border-zinc-800 bg-[#111] flex items-center justify-center font-avatar text-[12px] font-semibold text-text-primary shadow-sm">
          {{ getInisial(transaksi.ke, peserta) }}
        </div>
      </div>


      <div class="flex-1 min-w-0">
        <p class="text-[12px] font-bold uppercase tracking-widest text-[#555] truncate">
          {{ transaksi.dari }} <span class="text-[#333] px-0.5">→</span> {{ transaksi.ke }}
        </p>
      </div>
    </div>

    <!-- Amount Badge -->
    <div
      class="bg-[#111] border border-[#333] rounded-[6px] px-[10px] py-[6px] font-mono text-[14px] text-white font-medium">
      {{ formatRupiah(transaksi.jumlah) }}
    </div>
  </div>



</template>
