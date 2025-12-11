<template>
  <div class="mb-4">
    <h2 class="text-h4 font-bold text-ditto-blue font-poppins">
      {{ title }}
    </h2>
    <p v-if="description" class="mt-1 text-sm text-ditto-grey font-satoshi leading-relaxed">
      {{ description }}
    </p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  description?: string
}>()
</script>
