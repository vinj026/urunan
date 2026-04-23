<script setup>
import { useSession } from '~/composables/useSession'
const { loadFromLocal } = useSession()

onMounted(() => {
  loadFromLocal()
})
</script>

<template>
  <div class="min-h-screen bg-[#060606] text-white selection:bg-white/10 selection:text-white flex justify-center">
    <div
      class="w-full max-w-[480px] bg-black min-h-screen relative shadow-[0_0_100px_rgba(0,0,0,0.5)] flex flex-col border-x border-white/5">
      <NuxtPage />
    </div>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Space+Grotesk:wght@400;500&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');

body {
  margin: 0;
  padding: 0;
  background-color: #000000;
  font-family: 'Inter', sans-serif;
  -webkit-font-smoothing: antialiased;
  overflow-x: hidden;
  color: #FFFFFF;
}

.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24;
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}


::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: #1a1a1a;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: #2a2a2a;
}
</style>
