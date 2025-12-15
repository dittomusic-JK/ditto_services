<template>
  <div class="bg-white rounded-2xl border border-faded-grey overflow-hidden">
    <!-- Table header (desktop) -->
    <div class="hidden sm:grid grid-cols-[auto_1fr_auto_auto_auto] gap-4 items-center py-3 px-4 bg-lighter-grey border-b border-faded-grey">
      <span class="text-xs text-ditto-grey font-satoshi w-8 text-center">#</span>
      <span class="text-xs text-ditto-grey font-satoshi">Track</span>
      <span class="text-xs text-ditto-grey font-satoshi w-16 text-center">Splits</span>
      <span class="text-xs text-ditto-grey font-satoshi w-40">Distribution</span>
      <span class="text-xs text-ditto-grey font-satoshi w-36 text-right">Actions</span>
    </div>

    <!-- Track rows -->
    <div>
      <div
        v-for="track in tracks"
        :key="track.trackId"
        class="border-b border-faded-grey last:border-b-0"
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
          <span class="text-base font-semibold text-ditto-blue font-satoshi w-8 text-center">
            {{ track.trackNumber }}
          </span>

          <!-- Track name -->
          <span class="text-sm font-medium text-ditto-blue font-satoshi truncate">
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
              :pending-count="getPendingCount(track)"
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
              v-if="track.splits.length === 0"
              @click.stop="$emit('toggle', track.trackId)"
              class="px-3 py-1.5 border border-brand-secondary/40 rounded-full text-xs font-medium text-brand-secondary font-satoshi hover:border-brand-secondary hover:bg-brand-secondary/5 transition-colors"
            >
              Add Split
            </button>
            <button
              v-else
              @click.stop="$emit('toggle', track.trackId)"
              class="px-3 py-1.5 border rounded-full text-xs font-medium font-satoshi transition-colors"
              :class="expandedTrackId === track.trackId 
                ? 'border-ditto-grey text-ditto-grey bg-white' 
                : 'border-faded-grey text-ditto-grey hover:border-brand-secondary hover:text-brand-secondary'"
            >
              {{ expandedTrackId === track.trackId ? 'Close' : 'Splits' }}
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
                :pending-count="getPendingCount(track)"
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
                v-if="track.splits.length === 0"
                @click.stop="$emit('toggle', track.trackId)"
                class="px-2.5 py-1 border border-brand-secondary/40 rounded-full text-[11px] font-medium text-brand-secondary font-satoshi"
              >
                Add
              </button>
              <button
                v-else
                @click.stop="$emit('toggle', track.trackId)"
                class="px-2.5 py-1 border rounded-full text-[11px] font-medium font-satoshi"
                :class="expandedTrackId === track.trackId 
                  ? 'border-ditto-grey text-ditto-grey bg-white' 
                  : 'border-faded-grey text-ditto-grey'"
              >
                {{ expandedTrackId === track.trackId ? 'Close' : 'View' }}
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
          :has-changes="pendingChanges[track.trackId]"
          :known-collaborators="knownCollaborators"
          @close="$emit('toggle', track.trackId)"
          @save="$emit('save', track.trackId)"
          @add-split="(split) => $emit('add-split', track.trackId, split)"
          @remove-split="(id) => $emit('remove-split', track.trackId, id)"
          @edit-split="(id) => $emit('edit-split', track.trackId, id)"
          @resend-confirmation="(id) => $emit('resend-confirmation', track.trackId, id)"
          @copy-from="(sourceId) => $emit('copy-from', track.trackId, sourceId)"
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
}>()

defineEmits<{
  toggle: [trackId: string]
  save: [trackId: string]
  'add-split': [trackId: string, split: { name: string; email: string; share: number }]
  'remove-split': [trackId: string, splitId: string]
  'edit-split': [trackId: string, splitId: string]
  'resend-confirmation': [trackId: string, splitId: string]
  'copy-from': [trackId: string, sourceTrackId: string]
  'copy-to': [trackId: string]
}>()

const getOtherTracksWithSplits = (currentTrackId: string): TrackSplit[] => {
  return props.release.tracks.filter(t => t.trackId !== currentTrackId && t.splits.length > 0)
}

const rowStatus = (track: TrackSplit): 'none' | 'confirmed' | 'pending' => {
  if (track.splits.length === 0) return 'none'
  if (track.splits.every(s => s.status === 'active')) return 'confirmed'
  return 'pending'
}

const rowBgClass = (track: TrackSplit): string => {
  const status = rowStatus(track)
  if (status === 'confirmed') return 'bg-success/5'
  if (status === 'pending') return 'bg-amber-500/5'
  return 'bg-white'
}

const rowHoverClass = (track: TrackSplit): string => {
  const status = rowStatus(track)
  if (status === 'confirmed') return 'hover:bg-success/10'
  if (status === 'pending') return 'hover:bg-amber-500/10'
  return 'hover:bg-lighter-grey'
}

const getConfirmedShare = (track: TrackSplit): number => {
  return track.splits
    .filter(s => s.status === 'active')
    .reduce((sum, s) => sum + s.share, 0)
}

const getPendingCount = (track: TrackSplit): number => {
  return track.splits.filter(s => s.status === 'unconfirmed' || s.status === 'unclaimed').length
}
</script>
