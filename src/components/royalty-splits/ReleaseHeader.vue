<template>
  <div class="bg-lighter-grey rounded-2xl p-3 sm:p-4">
    <div class="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
      <!-- Top row on mobile: artwork + info + progress -->
      <div class="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
        <!-- Album artwork -->
        <img
          :src="artwork"
          :alt="title"
          class="w-12 h-12 sm:w-16 sm:h-16 rounded-lg object-cover shrink-0"
        />

        <!-- Release info -->
        <div class="flex-1 min-w-0">
          <h2 class="text-base sm:text-lg font-bold text-ditto-blue font-poppins truncate">
            {{ title }}
          </h2>
          <p class="text-xs text-ditto-grey font-satoshi truncate">
            {{ accountHolder }}
          </p>
        </div>

        <!-- Progress indicator -->
        <div v-if="totalTracks > 0" class="flex items-center gap-2 sm:gap-3 shrink-0">
          <div class="text-right">
            <p class="text-lg sm:text-2xl font-bold text-ditto-blue font-poppins">
              {{ tracksWithSplits }}<span class="text-ditto-grey font-normal">/{{ totalTracks }}</span>
            </p>
            <p class="text-[10px] sm:text-xs text-ditto-grey font-satoshi">tracks with splits</p>
          </div>
          <!-- Mini progress ring (hidden on mobile) -->
          <svg width="44" height="44" viewBox="0 0 44 44" class="-rotate-90 hidden sm:block">
            <circle
              cx="22" cy="22" r="18"
              fill="none"
              stroke="#EFEFFC"
              stroke-width="4"
            />
            <circle
              cx="22" cy="22" r="18"
              fill="none"
              stroke="#6C5CE7"
              stroke-width="4"
              stroke-linecap="round"
              :stroke-dasharray="circumference"
              :stroke-dashoffset="progressOffset"
              class="transition-all duration-500"
            />
          </svg>
        </div>
      </div>
    </div>

    <!-- Collapsible info message -->
    <div 
      v-if="userType === 'subscription'"
      class="mt-3 flex items-start gap-2 text-xs text-ditto-grey font-satoshi"
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" class="shrink-0 mt-0.5">
        <circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.5"/>
        <path d="M8 7V11M8 5V5.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
      <p class="leading-relaxed">
        <strong class="text-ditto-blue">Splits apply from confirmation date.</strong> Collaborators receive an email to accept. Until confirmed, all royalties remain yours.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { UserType } from '../../types'

const props = defineProps<{
  title: string
  artwork: string
  accountHolder: string
  userType: UserType
  totalTracks: number
  tracksWithSplits: number
}>()

const circumference = 2 * Math.PI * 18 // r=18
const progressOffset = computed(() => {
  const progress = props.totalTracks > 0 ? props.tracksWithSplits / props.totalTracks : 0
  return circumference * (1 - progress)
})
</script>
