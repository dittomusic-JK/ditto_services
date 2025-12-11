<template>
  <span
    class="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-semibold font-satoshi uppercase tracking-wide"
    :class="variant === 'green' ? 'bg-ditto-pro text-ditto-blue' : 'bg-faded-grey text-ditto-grey'"
  >
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
