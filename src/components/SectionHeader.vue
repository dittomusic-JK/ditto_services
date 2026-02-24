<template>
  <div class="section-header">
    <h2 class="section-header__title">{{ title }}</h2>
    <p v-if="description" class="section-header__desc">{{ description }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  description?: string
}>()
</script>

<style lang="scss" scoped>
.section-header {
  margin-bottom: 1rem;

  &__title {
    font-size: $text-h4;
    font-weight: 700;
    color: var(--blue);
    font-family: $font-poppins;
  }

  &__desc {
    margin-top: 0.25rem;
    font-size: $text-sm;
    color: var(--ditto-grey);
    font-family: $font-satoshi;
    line-height: 1.625;
  }
}
</style>
