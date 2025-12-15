<template>
  <div class="flex items-center gap-2">
    <!-- Percentage text on left -->
    <span class="text-sm font-semibold text-ditto-purple font-satoshi whitespace-nowrap">
      {{ userShare }}%
    </span>
    <!-- Bar visualization -->
    <div class="flex h-2 w-20 rounded-full overflow-hidden bg-light-grey">
      <div
        v-for="(segment, index) in segments"
        :key="index"
        class="h-full transition-all"
        :style="{ width: `${segment.percentage}%`, backgroundColor: segment.color }"
      />
    </div>
    <!-- Pending percentage on right if present -->
    <span v-if="pendingShare > 0" class="text-sm font-semibold text-amber-500 font-satoshi whitespace-nowrap">
      {{ pendingShare }}%
    </span>
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
