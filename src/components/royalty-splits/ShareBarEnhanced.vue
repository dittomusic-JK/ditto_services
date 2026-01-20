<template>
  <div class="flex items-center gap-2">
    <!-- Single bar showing ACTUAL current distribution -->
    <div class="relative group flex h-2 w-24 rounded-full overflow-hidden bg-light-grey cursor-help">
      <!-- Your share (actual - what you're receiving now) - using brand blue for visibility -->
      <div
        class="h-full bg-brand-secondary transition-all"
        :style="{ width: `${actualUserShare}%` }"
      />
      <!-- Confirmed collaborator share -->
      <div
        v-if="confirmedShare > 0"
        class="h-full bg-success transition-all"
        :style="{ width: `${confirmedShare}%` }"
      />
      
      <!-- Tooltip on hover -->
      <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-ditto-blue text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 shadow-lg">
        <p class="text-[10px] text-white/70 mb-1.5">Current active split</p>
        <div class="flex flex-col gap-1">
          <div class="flex items-center gap-2">
            <div class="w-2 h-2 rounded-full bg-brand-secondary" />
            <span>You: {{ actualUserShare }}%</span>
          </div>
          <div v-if="confirmedShare > 0" class="flex items-center gap-2">
            <div class="w-2 h-2 rounded-full bg-success" />
            <span>Collaborators: {{ confirmedShare }}%</span>
          </div>
        </div>
        <div class="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-ditto-blue" />
      </div>
    </div>
    
    <!-- Your actual percentage -->
    <span class="text-xs font-semibold text-brand-secondary font-satoshi whitespace-nowrap">
      {{ actualUserShare }}%
    </span>
    
    <!-- Pending invites badge (separate from distribution) -->
    <div 
      v-if="pendingCount > 0" 
      class="relative group"
    >
      <span class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700 text-[10px] font-medium font-satoshi cursor-help">
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          <circle cx="5" cy="5" r="4" stroke="currentColor" stroke-width="1.5"/>
          <path d="M5 3V5.5L6.5 6.5" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        {{ pendingCount }}
      </span>
      
      <!-- Tooltip -->
      <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-ditto-blue text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 shadow-lg">
        {{ pendingCount }} pending invite{{ pendingCount > 1 ? 's' : '' }} awaiting confirmation
        <div class="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-ditto-blue" />
      </div>
    </div>
    
    <!-- Unclaimed badge (needs to create DTO account) -->
    <div 
      v-if="unclaimedCount && unclaimedCount > 0" 
      class="relative group"
    >
      <span class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-orange-100 text-orange-600 text-[10px] font-medium font-satoshi cursor-help">
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          <circle cx="5" cy="5" r="4" stroke="currentColor" stroke-width="1.5"/>
          <path d="M5 3V5.5M5 7V7.01" stroke="currentColor" stroke-width="1.25" stroke-linecap="round"/>
        </svg>
        {{ unclaimedCount }}
      </span>
      
      <!-- Tooltip -->
      <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-ditto-blue text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 shadow-lg">
        {{ unclaimedCount }} collaborator{{ unclaimedCount > 1 ? 's need' : ' needs' }} to create a Ditto account
        <div class="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-ditto-blue" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  confirmedShare: number
  pendingCount: number
  unclaimedCount?: number
}>()

// Actual user share = what's left after confirmed splits
// Pending doesn't affect this - it's just proposed
const actualUserShare = computed(() => 100 - props.confirmedShare)
</script>
