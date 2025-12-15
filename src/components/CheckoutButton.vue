<template>
  <button
    @click="$emit('click')"
    :disabled="itemCount === 0"
    class="w-full py-4 rounded-button text-white font-semibold text-base font-satoshi transition-all flex items-center justify-center gap-2"
    :class="itemCount > 0 ? 'bg-ditto-purple hover:opacity-90 cursor-pointer' : 'bg-faded-grey cursor-not-allowed'"
  >
    <CartIcon v-if="!isFreeOnly" />
    <svg v-else width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M16.667 5L7.5 14.167 3.333 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    <span v-if="itemCount > 0">
      {{ isFreeOnly ? 'Confirm' : 'Checkout' }} ({{ itemCount }} item{{ itemCount > 1 ? 's' : '' }}){{ !isFreeOnly ? ` • ${total}` : '' }}
    </span>
    <span v-else>Select services to continue</span>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { CartIcon } from './icons'

const props = defineProps<{
  itemCount: number
  total: string
}>()

defineEmits<{
  click: []
}>()

// Check if total is £0 (only free items selected)
const isFreeOnly = computed(() => props.total === '£0')
</script>
