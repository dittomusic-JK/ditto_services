<template>
  <div data-ditto-theme="rls" class="bg-rls-bg min-h-screen p-4 sm:p-6 md:p-8 flex flex-col items-center">
    <!-- Demo toggle -->
    <div class="mb-4 flex flex-wrap items-center justify-center gap-2 text-sm font-satoshi">
      <span class="text-rls-text-secondary">Demo:</span>
      <button 
        @click="demo = 'populated'" 
        class="px-3 py-1 rounded-full transition-colors"
        :class="demo === 'populated' ? 'bg-rls-accent text-white' : 'bg-rls-card text-rls-text-secondary hover:bg-rls-border-light'"
      >
        Populated
      </button>
      <button 
        @click="demo = 'empty'" 
        class="px-3 py-1 rounded-full transition-colors"
        :class="demo === 'empty' ? 'bg-rls-accent text-white' : 'bg-rls-card text-rls-text-secondary hover:bg-rls-border-light'"
      >
        Empty
      </button>
      <button 
        @click="demo = 'edge-case'" 
        class="px-3 py-1 rounded-full transition-colors"
        :class="demo === 'edge-case' ? 'bg-rls-accent text-white' : 'bg-rls-card text-rls-text-secondary hover:bg-rls-border-light'"
      >
        Edge Case (50 tracks)
      </button>
    </div>
    
    <RoyaltySplitsPage :key="demo" user-type="rls" :demo="demo" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { RoyaltySplitsPage } from '../components/royalty-splits'

const demo = ref<'populated' | 'empty' | 'edge-case'>('populated')
</script>
