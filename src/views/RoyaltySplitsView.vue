<template>
  <div class="bg-white min-h-screen p-4 sm:p-6 md:p-8 flex flex-col items-center">
    <!-- Demo toggle -->
    <div class="mb-4 flex flex-wrap items-center justify-center gap-2 text-sm font-satoshi">
      <span class="text-ditto-grey">Demo:</span>
      <button 
        @click="demo = 'populated'" 
        class="px-3 py-1 rounded-full transition-colors"
        :class="demo === 'populated' ? 'bg-brand-secondary text-white' : 'bg-light-grey text-ditto-grey hover:bg-faded-grey'"
      >
        Populated
      </button>
      <button 
        @click="demo = 'empty'" 
        class="px-3 py-1 rounded-full transition-colors"
        :class="demo === 'empty' ? 'bg-brand-secondary text-white' : 'bg-light-grey text-ditto-grey hover:bg-faded-grey'"
      >
        Empty
      </button>
      <button 
        @click="demo = 'edge-case'" 
        class="px-3 py-1 rounded-full transition-colors"
        :class="demo === 'edge-case' ? 'bg-brand-secondary text-white' : 'bg-light-grey text-ditto-grey hover:bg-faded-grey'"
      >
        Edge Case (50 tracks)
      </button>
    </div>
    
    <RoyaltySplitsPage :key="demo" :user-type="userType" :demo="demo" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { UserType } from '../types'
import { RoyaltySplitsPage } from '../components/royalty-splits'

const userType = ref<UserType>('subscription')
const demo = ref<'populated' | 'empty' | 'edge-case'>('populated')
</script>
