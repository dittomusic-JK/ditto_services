<template>
  <div
    @click="isClickable ? $emit('toggle') : undefined"
    class="flex items-center justify-between p-3 sm:p-4 rounded-2xl border transition-all"
    :class="rowClasses"
  >
    <div class="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
      <div class="relative w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center overflow-visible shrink-0">
        <slot name="icon" />
        <div v-if="flagCode" class="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 rounded-full overflow-hidden border-2 border-white shadow-sm">
          <img :src="`https://hatscripts.github.io/circle-flags/flags/${flagCode}.svg`" :alt="flagCode" class="w-full h-full" />
        </div>
      </div>
      <span
        class="text-sm sm:text-base font-semibold font-satoshi truncate"
        :class="isUnavailable ? 'text-dark-grey' : 'text-ditto-blue'"
      >
        {{ title }}
      </span>
    </div>
    <div class="flex items-center gap-2 sm:gap-3 shrink-0">
      <span v-if="isActive" class="text-xs font-semibold text-success bg-ditto-pro/20 px-3 py-1 rounded-full">
        Active
      </span>
      <span
        v-else-if="isUnavailable"
        class="text-xs font-semibold text-ditto-grey bg-faded-grey/50 px-3 py-1 rounded-full relative group cursor-help"
      >
        Unavailable
        <div
          v-if="unavailableTooltip"
          class="absolute bottom-full right-0 mb-2 px-3 py-2 bg-ditto-blue text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10"
        >
          {{ unavailableTooltip }}
          <div class="absolute top-full right-4 border-4 border-transparent border-t-ditto-blue"></div>
        </div>
      </span>
      <span v-else-if="purchased" class="text-xs font-semibold text-success bg-ditto-pro/20 px-3 py-1 rounded-full">
        Active
      </span>
      <template v-else>
        <span class="text-[13px] sm:text-sm font-bold text-ditto-blue font-satoshi">
          {{ price }}
        </span>
        <div
          class="w-8 h-8 sm:w-9 sm:h-9 rounded-full border-[3px] flex items-center justify-center transition-all bg-white"
          :class="selected ? 'border-[#2680EB]' : 'border-[#D2D2E3]'"
        >
          <svg v-if="selected" width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M20 6L9 17L4 12" stroke="#2680EB" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ServiceStatus } from '../types'

const props = defineProps<{
  title: string
  price: string
  selected: boolean
  purchased?: boolean
  flagCode?: string
  status?: ServiceStatus
  unavailableTooltip?: string
}>()

defineEmits<{
  toggle: []
}>()

const isActive = computed(() => props.status === 'active')
const isUnavailable = computed(() => props.status === 'unavailable')
const isClickable = computed(() => !props.purchased && !isActive.value && !isUnavailable.value)

const rowClasses = computed(() => {
  if (isActive.value) return 'bg-ditto-pro/10 border-ditto-pro'
  if (isUnavailable.value) return 'bg-lighter-grey border-faded-grey opacity-60'
  if (props.purchased) return 'bg-ditto-pro/10 border-ditto-pro'
  if (props.selected) return 'bg-lighter-grey border-brand-secondary'
  return 'bg-lighter-grey border-faded-grey hover:border-brand-secondary cursor-pointer'
})
</script>
