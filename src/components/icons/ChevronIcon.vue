<template>
  <svg
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
    class="chevron-icon"
    :class="{ 'chevron-icon--rotated': rotated }"
  >
    <path d="M3 4.5L6 7.5L9 4.5" stroke="#626984" stroke-width="1.5" />
  </svg>
</template>

<script setup lang="ts">
defineProps<{
  rotated?: boolean
}>()
</script>

<style lang="scss" scoped>
.chevron-icon {
  flex-shrink: 0;
  transition: transform 0.15s ease;

  &--rotated {
    transform: rotate(180deg);
  }
}
</style>
