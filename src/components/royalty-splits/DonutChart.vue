<template>
  <div class="donut">
    <svg :width="size" :height="size" :viewBox="`0 0 ${size} ${size}`">
      <circle :cx="center" :cy="center" :r="radius" fill="none" stroke="#E5E5F0" :stroke-width="strokeWidth" />
      <circle
        v-for="(segment, index) in computedSegments"
        :key="index"
        :cx="center" :cy="center" :r="radius"
        fill="none"
        :stroke="segment.color"
        :stroke-width="strokeWidth"
        :stroke-dasharray="segment.dashArray"
        :stroke-dashoffset="segment.dashOffset"
        stroke-linecap="round"
        :transform="`rotate(-90 ${center} ${center})`"
      />
    </svg>
    <div class="donut__center" :style="{ width: `${size - strokeWidth * 2 - 8}px`, height: `${size - strokeWidth * 2 - 8}px` }" />
    <div v-if="showBadge" class="donut__badge" :style="{ top: '-4px', right: '-4px' }">
      {{ userShare }}%
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Segment {
  percentage: number
  color: string
}

const props = withDefaults(defineProps<{
  segments: Segment[]
  userShare?: number
  size?: number
  strokeWidth?: number
  showBadge?: boolean
}>(), {
  size: 120,
  strokeWidth: 16,
  showBadge: true,
  userShare: 0
})

const center = computed(() => props.size / 2)
const radius = computed(() => (props.size - props.strokeWidth) / 2)
const circumference = computed(() => 2 * Math.PI * radius.value)

const computedSegments = computed(() => {
  let accumulatedOffset = 0
  return props.segments.map((segment) => {
    const segmentLength = (segment.percentage / 100) * circumference.value
    const gapSize = props.segments.length > 1 ? 4 : 0
    const dashArray = `${segmentLength - gapSize} ${circumference.value - segmentLength + gapSize}`
    const dashOffset = -accumulatedOffset
    accumulatedOffset += segmentLength
    return {
      color: segment.color,
      dashArray,
      dashOffset
    }
  })
})
</script>

<style lang="scss" scoped>
.donut {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  &__center {
    position: absolute;
    background: #fff;
    border-radius: 50%;
  }

  &__badge {
    position: absolute;
    background: var(--blue);
    color: #fff;
    font-size: $text-xs;
    font-weight: 700;
    padding: 0.125rem 0.5rem;
    border-radius: $radius-button;
  }
}
</style>
