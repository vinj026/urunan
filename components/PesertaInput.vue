<script setup>
import { getInisial } from '~/utils/calculate'

defineProps({
  peserta: Array
})
const emit = defineEmits(['add', 'remove'])

const inputPeserta = ref('')
const handleAdd = () => {
  if (!inputPeserta.value.trim()) return
  emit('add', inputPeserta.value.trim())
  inputPeserta.value = ''
}
</script>

<template>
  <div class="space-y-4">
    <div class="flex gap-1.5">
      <input v-model="inputPeserta" type="text" placeholder="Nama peserta..." @keyup.enter="handleAdd"
        class="flex-1 h-[48px] bg-bg-tertiary border border-border-default rounded-[8px] px-[14px] text-[15px] font-medium text-text-primary focus:border-border-active focus:ring-0 placeholder:text-text-tertiary outline-none transition-all" />
      <button @click="handleAdd"
        class="w-[48px] h-[48px] bg-primary text-black font-bold rounded-[8px] hover:opacity-90 transition-all active:scale-95 flex items-center justify-center">
        <span class="material-symbols-outlined text-[18px]">add</span>
      </button>
    </div>

    <!-- Participant List -->
    <div class="space-y-[6px] max-h-[350px] overflow-y-auto no-scrollbar pb-4 mt-[10px]">
      <TransitionGroup name="list">
        <div v-for="p in peserta" :key="p"
          class="flex items-center justify-between h-[56px] px-[14px] bg-bg-secondary border border-[#1a1a1a] rounded-[8px] group transition-all">
          <div class="flex items-center gap-3">
            <div
              class="w-[36px] h-[36px] rounded-full bg-[#1a1a1a] border border-[#333] flex items-center justify-center font-avatar text-[12px] font-semibold text-text-primary group-hover:bg-primary group-hover:text-black transition-colors">
              {{ getInisial(p, peserta) }}
            </div>
            <span class="text-[15px] text-white font-normal">{{ p }}</span>
          </div>

          <button @click="$emit('remove', p)"
            class="text-[#444] hover:text-white transition-colors p-1.5 flex items-center justify-center">
            <span class="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>
      </TransitionGroup>
    </div>
  </div>



</template>

<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.list-enter-from {
  opacity: 0;
  transform: translateX(20px) scale(0.95);
}

.list-leave-to {
  opacity: 0;
  transform: translateX(-20px) scale(0.95);
}

.list-move {
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
</style>
