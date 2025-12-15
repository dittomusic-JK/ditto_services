<template>
  <div class="border-b border-faded-grey last:border-b-0">
    <!-- Main row -->
    <div 
      class="grid grid-cols-[auto_1fr_auto_auto_auto] gap-4 items-center py-4 px-2"
      :class="{ 'bg-lighter-grey rounded-t-2xl': isExpanded }"
    >
      <!-- Track number -->
      <span class="text-base font-semibold text-ditto-blue font-satoshi w-8 text-center">
        {{ trackNumber }}
      </span>

      <!-- Track name -->
      <span class="text-sm font-medium text-ditto-blue font-satoshi truncate">
        {{ trackName }}
      </span>

      <!-- Splits count -->
      <div class="w-16 text-center">
        <button
          v-if="splitCount > 0"
          @click="$emit('toggle')"
          class="text-sm font-semibold text-brand-secondary font-satoshi hover:underline"
        >
          {{ splitCount }}
        </button>
      </div>

      <!-- Your Share -->
      <div class="w-32">
        <template v-if="splitCount > 0">
          <div class="flex items-center gap-2">
            <!-- Mini donut icon -->
            <DonutChart
              :segments="shareSegments"
              :user-share="userShare"
              :size="24"
              :stroke-width="4"
              :show-badge="false"
            />
            <span class="text-sm font-semibold text-ditto-blue font-satoshi">
              {{ userShare }}%
            </span>
          </div>
        </template>
      </div>

      <!-- Edit button -->
      <div class="w-28 flex justify-end">
        <button
          v-if="splitCount === 0"
          @click="$emit('toggle')"
          class="flex items-center gap-1.5 px-4 py-2 border border-brand-secondary rounded-full text-sm font-semibold text-brand-secondary font-satoshi hover:bg-brand-secondary/5 transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 3V11M3 7H11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
          Add Split
        </button>
        <button
          v-else
          @click="$emit('toggle')"
          class="flex items-center gap-1.5 px-4 py-2 border rounded-full text-sm font-semibold font-satoshi transition-colors"
          :class="isExpanded 
            ? 'border-ditto-grey text-ditto-grey bg-white' 
            : 'border-brand-secondary text-brand-secondary hover:bg-brand-secondary/5'"
        >
          <EditIcon v-if="!isExpanded" class="w-4 h-4" />
          <svg v-else width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M10.5 3.5L3.5 10.5M3.5 3.5L10.5 10.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
          {{ isExpanded ? 'Close' : 'Splits' }}
        </button>
      </div>
    </div>

    <!-- Expanded editor panel -->
    <SplitsEditor
      v-if="isExpanded"
      :account-holder="accountHolder"
      :user-share="userShare"
      :existing-splits="splits"
      :other-tracks="otherTracks"
      :has-changes="hasChanges"
      @close="$emit('toggle')"
      @save="$emit('save')"
      @add-split="$emit('add-split', $event)"
      @remove-split="$emit('remove-split', $event)"
      @edit-split="$emit('edit-split', $event)"
      @resend-confirmation="$emit('resend-confirmation', $event)"
      @copy-from="$emit('copy-from', $event)"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Collaborator, TrackSplit } from '../../types'
import DonutChart from './DonutChart.vue'
import SplitsEditor from './SplitsEditor.vue'
import { EditIcon } from './icons'

const props = defineProps<{
  trackNumber: number
  trackName: string
  splits: Collaborator[]
  userShare: number
  accountHolder: string
  isExpanded: boolean
  otherTracks: TrackSplit[]
  hasChanges?: boolean
}>()

defineEmits<{
  toggle: []
  save: []
  'add-split': [split: { name: string; email: string; share: number }]
  'remove-split': [id: string]
  'edit-split': [id: string]
  'resend-confirmation': [id: string]
  'copy-from': [trackId: string]
}>()

const splitCount = computed(() => props.splits.length)

// Colors: purple for yours, orange for confirmed, amber for pending, red for rejected
const shareSegments = computed(() => {
  const segments = []
  
  // User's share
  if (props.userShare > 0) {
    segments.push({ percentage: props.userShare, color: '#6C5CE7' })
  }
  
  // Other splits by status
  const activeSplits = props.splits.filter(s => s.status === 'active')
  const confirmedShare = activeSplits.reduce((sum, s) => sum + s.share, 0)
  if (confirmedShare > 0) {
    segments.push({ percentage: confirmedShare, color: '#FFB100' })
  }
  
  const pendingSplits = props.splits.filter(s => s.status === 'pending')
  const pendingShare = pendingSplits.reduce((sum, s) => sum + s.share, 0)
  if (pendingShare > 0) {
    segments.push({ percentage: pendingShare, color: '#F59E0B' }) // amber
  }
  
  const rejectedSplits = props.splits.filter(s => s.status === 'rejected')
  const rejectedShare = rejectedSplits.reduce((sum, s) => sum + s.share, 0)
  if (rejectedShare > 0) {
    segments.push({ percentage: rejectedShare, color: '#EE404C' }) // red
  }
  
  return segments
})
</script>
