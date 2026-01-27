<template>
  <div class="rounded-2xl border overflow-hidden" :class="isRLS ? 'bg-rls-card border-rls-border' : 'bg-white border-faded-grey'">
    <!-- Table header (desktop) -->
    <div class="hidden sm:grid grid-cols-[auto_1fr_auto_auto_auto] gap-4 items-center py-3 px-4 border-b" :class="isRLS ? 'bg-rls-bg-elevated border-rls-border' : 'bg-lighter-grey border-faded-grey'">
      <span class="text-xs font-satoshi w-8 text-center" :class="isRLS ? 'text-rls-text-secondary' : 'text-ditto-grey'">#</span>
      <span class="text-xs font-satoshi" :class="isRLS ? 'text-rls-text-secondary' : 'text-ditto-grey'">Track</span>
      <span class="text-xs font-satoshi w-16 text-center" :class="isRLS ? 'text-rls-text-secondary' : 'text-ditto-grey'">Splits</span>
      <span class="text-xs font-satoshi w-40" :class="isRLS ? 'text-rls-text-secondary' : 'text-ditto-grey'">Distribution</span>
      <span class="text-xs font-satoshi w-36 text-right" :class="isRLS ? 'text-rls-text-secondary' : 'text-ditto-grey'">Actions</span>
    </div>

    <!-- Track rows -->
    <div>
      <div
        v-for="track in tracks"
        :key="track.trackId"
        class="border-b last:border-b-0"
        :class="isRLS ? 'border-rls-border' : 'border-faded-grey'"
      >
        <!-- Main row (desktop) -->
        <div 
          class="hidden sm:grid grid-cols-[auto_1fr_auto_auto_auto] gap-4 items-center py-4 px-4 cursor-pointer transition-colors"
          :class="[rowBgClass(track), expandedTrackId === track.trackId ? 'ring-1 ring-brand-secondary/30' : '', rowHoverClass(track)]"
          role="button"
          tabindex="0"
          :aria-expanded="expandedTrackId === track.trackId"
          @click="$emit('toggle', track.trackId)"
          @keydown.enter.prevent="$emit('toggle', track.trackId)"
          @keydown.space.prevent="$emit('toggle', track.trackId)"
        >
          <!-- Track number -->
          <span class="text-base font-semibold font-satoshi w-8 text-center" :class="isRLS ? 'text-rls-text' : 'text-ditto-blue'">
            {{ track.trackNumber }}
          </span>

          <!-- Track name -->
          <span class="text-sm font-medium font-satoshi truncate" :class="isRLS ? 'text-rls-text' : 'text-ditto-blue'">
            {{ track.trackName }}
          </span>

          <!-- Splits count -->
          <div class="w-16 text-center">
            <span
              class="text-sm font-semibold font-satoshi"
              :class="track.splits.length > 0 ? 'text-brand-secondary' : 'text-ditto-grey'"
            >
              {{ track.splits.length }}
            </span>
          </div>

          <!-- Share visualization - always show bar for consistency -->
          <div class="w-40">
            <ShareBarEnhanced
              :confirmed-share="getConfirmedShare(track)"
              :pending-count="isRLS ? 0 : getPendingCount(track)"
              :unclaimed-count="getUnclaimedCount(track)"
              :is-r-l-s="isRLS"
            />
          </div>

          <!-- Action buttons -->
          <div class="w-36 flex justify-end gap-2">
            <!-- Copy to other tracks button (only for tracks with splits) -->
            <button
              v-if="track.splits.length > 0"
              @click.stop="$emit('copy-to', track.trackId)"
              class="p-2 text-ditto-grey hover:text-brand-secondary transition-colors"
              title="Copy splits to other tracks"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M15 6H8.25C7.42 6 6.75 6.67 6.75 7.5V14.25C6.75 15.08 7.42 15.75 8.25 15.75H15C15.83 15.75 16.5 15.08 16.5 14.25V7.5C16.5 6.67 15.83 6 15 6Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M3.75 12H3C2.60218 12 2.22064 11.842 1.93934 11.5607C1.65804 11.2794 1.5 10.8978 1.5 10.5V3C1.5 2.60218 1.65804 2.22064 1.93934 1.93934C2.22064 1.65804 2.60218 1.5 3 1.5H10.5C10.8978 1.5 11.2794 1.65804 11.5607 1.93934C11.842 2.22064 12 2.60218 12 3V3.75" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>

            <!-- Splits/Add button -->
            <button
              @click.stop="$emit('toggle', track.trackId)"
              class="px-3 py-1.5 border rounded-full text-xs font-medium font-satoshi transition-colors"
              :class="expandedTrackId === track.trackId 
                ? isRLS 
                  ? 'border-rls-border text-rls-text-secondary bg-rls-bg-elevated' 
                  : 'border-ditto-grey text-ditto-grey bg-white' 
                : track.splits.length === 0
                  ? 'border-brand-secondary/40 text-brand-secondary hover:border-brand-secondary hover:bg-brand-secondary/5'
                  : isRLS
                    ? 'border-rls-border text-rls-text-secondary hover:border-rls-accent hover:text-rls-accent'
                    : 'border-faded-grey text-ditto-grey hover:border-brand-secondary hover:text-brand-secondary'"
            >
              {{ expandedTrackId === track.trackId ? 'Close' : (track.splits.length === 0 ? 'Add Split' : 'Splits') }}
            </button>
          </div>
        </div>

        <!-- Main row (mobile) -->
        <div 
          class="sm:hidden flex flex-col gap-2 py-3 px-3 cursor-pointer transition-colors"
          :class="[rowBgClass(track), expandedTrackId === track.trackId ? 'ring-1 ring-brand-secondary/30' : '', rowHoverClass(track)]"
          role="button"
          tabindex="0"
          :aria-expanded="expandedTrackId === track.trackId"
          @click="$emit('toggle', track.trackId)"
          @keydown.enter.prevent="$emit('toggle', track.trackId)"
          @keydown.space.prevent="$emit('toggle', track.trackId)"
        >
          <!-- Top row: number, name, splits count -->
          <div class="flex items-center gap-2">
            <span class="text-sm font-semibold text-ditto-blue font-satoshi w-6 text-center shrink-0">
              {{ track.trackNumber }}
            </span>
            <span class="text-sm font-medium text-ditto-blue font-satoshi truncate flex-1">
              {{ track.trackName }}
            </span>
            <span
              class="text-xs font-semibold font-satoshi px-2 py-0.5 rounded-full"
              :class="track.splits.length > 0 ? 'bg-brand-secondary/10 text-brand-secondary' : 'bg-lighter-grey text-ditto-grey'"
            >
              {{ track.splits.length }} split{{ track.splits.length !== 1 ? 's' : '' }}
            </span>
          </div>

          <!-- Bottom row: share bar and action -->
          <div class="flex items-center gap-2 pl-8">
          <div class="flex-1">
              <ShareBarEnhanced
                :confirmed-share="getConfirmedShare(track)"
                :pending-count="isRLS ? 0 : getPendingCount(track)"
                :unclaimed-count="getUnclaimedCount(track)"
                :is-r-l-s="isRLS"
              />
            </div>
            <div class="flex items-center gap-1 shrink-0">
              <button
                v-if="track.splits.length > 0"
                @click.stop="$emit('copy-to', track.trackId)"
                class="p-1.5 text-ditto-grey hover:text-brand-secondary transition-colors"
                title="Copy splits"
              >
                <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
                  <path d="M15 6H8.25C7.42 6 6.75 6.67 6.75 7.5V14.25C6.75 15.08 7.42 15.75 8.25 15.75H15C15.83 15.75 16.5 15.08 16.5 14.25V7.5C16.5 6.67 15.83 6 15 6Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M3.75 12H3C2.60218 12 2.22064 11.842 1.93934 11.5607C1.65804 11.2794 1.5 10.8978 1.5 10.5V3C1.5 2.60218 1.65804 2.22064 1.93934 1.93934C2.22064 1.65804 2.60218 1.5 3 1.5H10.5C10.8978 1.5 11.2794 1.65804 11.5607 1.93934C11.842 2.22064 12 2.60218 12 3V3.75" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
              <button
                @click.stop="$emit('toggle', track.trackId)"
                class="px-2.5 py-1 border rounded-full text-[11px] font-medium font-satoshi"
                :class="expandedTrackId === track.trackId 
                  ? isRLS 
                    ? 'border-rls-border text-rls-text-secondary bg-rls-bg-elevated' 
                    : 'border-ditto-grey text-ditto-grey bg-white' 
                  : track.splits.length === 0
                    ? 'border-brand-secondary/40 text-brand-secondary'
                    : isRLS
                      ? 'border-rls-border text-rls-text-secondary'
                      : 'border-faded-grey text-ditto-grey'"
              >
                {{ expandedTrackId === track.trackId ? 'Close' : (track.splits.length === 0 ? 'Add' : 'View') }}
              </button>
            </div>
          </div>
        </div>

        <!-- Expanded editor panel -->
        <SplitsEditor
          v-if="expandedTrackId === track.trackId"
          :account-holder="release.accountHolder"
          :user-share="track.userShare"
          :existing-splits="track.splits"
          :other-tracks="getOtherTracksWithSplits(track.trackId)"
          :has-changes="hasChangesForTrack(track.trackId)"
          :known-collaborators="knownCollaborators"
          :is-r-l-s="isRLS"
          @close="$emit('toggle', track.trackId)"
          @save="(changes) => $emit('save', track.trackId, changes)"
          @resend-confirmation="(id) => $emit('resend-confirmation', track.trackId, id)"
          @open-copy-modal="$emit('open-copy-modal', track.trackId)"
          @dirty-change="(isDirty) => $emit('dirty-change', track.trackId, isDirty)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TrackSplit, Release } from '../../types'
import SplitsEditor from './SplitsEditor.vue'
import ShareBarEnhanced from './ShareBarEnhanced.vue'

const props = defineProps<{
  tracks: TrackSplit[]
  expandedTrackId: string | null
  release: Release
  pendingChanges: Record<string, boolean>
  knownCollaborators?: { name: string; email: string }[]
  isRLS?: boolean
}>()

defineEmits<{
  toggle: [trackId: string]
  save: [trackId: string, changes: { added: any[], edited: any[], deleted: string[] }]
  'resend-confirmation': [trackId: string, splitId: string]
  'open-copy-modal': [trackId: string]
  'copy-to': [trackId: string]
  'dirty-change': [trackId: string, isDirty: boolean]
}>()

const getOtherTracksWithSplits = (currentTrackId: string): TrackSplit[] => {
  return props.release.tracks.filter(t => t.trackId !== currentTrackId && t.splits.length > 0)
}

const rowStatus = (track: TrackSplit): 'none' | 'confirmed' | 'pending' | 'rejected' | 'unclaimed' => {
  if (track.splits.length === 0) return 'none'
  const hasActive = track.splits.some(s => s.status === 'active')
  const hasPending = track.splits.some(s => s.status === 'pending')
  const hasRejected = track.splits.some(s => s.status === 'rejected')
  const hasUnclaimed = track.splits.some(s => s.status === 'unclaimed')
  
  if (hasUnclaimed) return 'unclaimed' // Any unclaimed = unclaimed state (needs attention)
  if (hasPending) return 'pending' // Any pending = pending state
  if (hasRejected && !hasActive) return 'rejected' // Only rejected, no active = rejected state
  if (hasActive) return 'confirmed' // All remaining active = confirmed
  return 'none'
}

const rowBgClass = (track: TrackSplit): string => {
  const status = rowStatus(track)
  if (status === 'confirmed') return 'bg-success/5'
  if (status === 'pending') return 'bg-amber-500/5'
  if (status === 'rejected') return 'bg-error/5'
  if (status === 'unclaimed') return 'bg-orange-500/5'
  // For RLS (dark theme), use transparent instead of white
  return props.isRLS ? 'bg-transparent' : 'bg-white'
}

const rowHoverClass = (track: TrackSplit): string => {
  const status = rowStatus(track)
  if (status === 'confirmed') return 'hover:bg-success/10'
  if (status === 'pending') return 'hover:bg-amber-500/10'
  if (status === 'rejected') return 'hover:bg-error/10'
  if (status === 'unclaimed') return 'hover:bg-orange-500/10'
  // For RLS (dark theme), use a subtle dark hover instead of light grey
  return props.isRLS ? 'hover:bg-white/5' : 'hover:bg-lighter-grey'
}

const getConfirmedShare = (track: TrackSplit): number => {
  return track.splits
    .filter(s => s.status === 'active')
    .reduce((sum, s) => sum + s.share, 0)
}

const getPendingCount = (track: TrackSplit): number => {
  return track.splits.filter(s => s.status === 'pending').length
}

const getUnclaimedCount = (track: TrackSplit): number => {
  return track.splits.filter(s => s.status === 'unclaimed').length
}

const getRejectedCount = (track: TrackSplit): number => {
  return track.splits.filter(s => s.status === 'rejected').length
}

const hasChangesForTrack = (trackId: string): boolean => {
  return props.pendingChanges[trackId] === true
}
</script>
