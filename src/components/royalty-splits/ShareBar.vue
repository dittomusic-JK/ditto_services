<template>
  <div class="share-bar">
    <span class="share-bar__pct">{{ userShare }}%</span>
    <div class="share-bar__track">
      <div
        v-for="(segment, index) in segments"
        :key="index"
        class="share-bar__segment"
        :style="{ width: `${segment.percentage}%`, backgroundColor: segment.color }"
      />
    </div>
    <span v-if="pendingShare > 0" class="share-bar__pending">{{ pendingShare }}%</span>
  </div>
</template>

<script setup lang="ts">

interface Segment {
  percentage: number
  color: string
}

withDefaults(defineProps<{
  segments: Segment[]
  userShare: number
  pendingShare?: number
}>(), {
  pendingShare: 0
})
</script>

<style lang="scss" scoped>
.share-bar {
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &__pct {
    font-size: $text-sm;
    font-weight: 600;
    color: var(--purple);
    font-family: $font-satoshi;
    white-space: nowrap;
  }

  &__track {
    display: flex;
    height: 0.5rem;
    width: 5rem;
    border-radius: $radius-button;
    overflow: hidden;
    background: var(--light-grey);
  }

  &__segment {
    height: 100%;
    transition: all 0.15s ease;
  }

  &__pending {
    font-size: $text-sm;
    font-weight: 600;
    color: $color-amber-500;
    font-family: $font-satoshi;
    white-space: nowrap;
  }
}
</style>
