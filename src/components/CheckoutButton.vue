<template>
  <button
    @click="$emit('click')"
    :disabled="itemCount === 0"
    class="w-full py-4 rounded-button text-white font-semibold text-base font-satoshi transition-all flex items-center justify-center gap-2"
    :class="itemCount > 0 ? 'bg-ditto-purple hover:opacity-90 cursor-pointer' : 'bg-faded-grey cursor-not-allowed'"
  >
    <CartIcon />
    <span v-if="itemCount > 0">
      Checkout ({{ itemCount }} item{{ itemCount > 1 ? 's' : '' }}) • {{ total }}
    </span>
    <span v-else>Select add-ons to checkout</span>
  </button>
</template>

<script setup lang="ts">
import { CartIcon } from './icons'

defineProps<{
  itemCount: number
  total: string
}>()

defineEmits<{
  click: []
}>()
</script>
