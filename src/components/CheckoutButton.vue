<template>
  <button
    @click="$emit('click')"
    :disabled="itemCount === 0"
    class="checkout-btn"
    :class="{ 'checkout-btn--active': itemCount > 0 }"
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

const isFreeOnly = computed(() => props.total === '£0')
</script>

<style lang="scss" scoped>
.checkout-btn {
  width: 100%;
  padding: 1rem 0;
  border-radius: $radius-button;
  color: #fff;
  font-weight: 600;
  font-size: $text-body;
  font-family: $font-satoshi;
  transition: all 0.15s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: var(--faded-grey);
  cursor: not-allowed;

  &--active {
    background: var(--brand-primary);
    cursor: pointer;

    &:hover {
      opacity: 0.9;
    }
  }
}
</style>
