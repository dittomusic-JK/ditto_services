<template>
  <span class="plan-badge" :class="`plan-badge--${variant}`">
    {{ text }}
  </span>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  text: string
  variant?: 'green' | 'grey'
}>(), {
  variant: 'green'
})
</script>

<style lang="scss" scoped>
.plan-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  border-radius: $radius-button;
  font-size: 11px;
  font-weight: 600;
  font-family: $font-satoshi;
  text-transform: uppercase;
  letter-spacing: 0.05em;

  &--green {
    background: var(--ditto-pro);
    color: var(--blue);
  }

  &--grey {
    background: var(--faded-grey);
    color: var(--ditto-grey);
  }
}
</style>
