<template>
  <div class="tg" :class="{ 'tg--rls': isRLS }">
    <!-- Table header (desktop) -->
    <div class="tg__head" :class="{ 'tg__head--rls': isRLS }">
      <span class="tg__th tg__th--num" :class="{ 'tg__th--rls': isRLS }">#</span>
      <span class="tg__th" :class="{ 'tg__th--rls': isRLS }">Track</span>
      <span class="tg__th tg__th--splits" :class="{ 'tg__th--rls': isRLS }">Splits</span>
      <span class="tg__th tg__th--dist" :class="{ 'tg__th--rls': isRLS }">Distribution</span>
      <span class="tg__th tg__th--act" :class="{ 'tg__th--rls': isRLS }">Actions</span>
    </div>

    <!-- Track rows -->
    <div>
      <div
        v-for="track in tracks"
        :key="track.trackId"
        class="tg__track-wrap" :class="{ 'tg__track-wrap--rls': isRLS }"
      >
        <!-- Desktop row -->
        <div
          class="tg__row"
          :class="[rowStatusClass(track), expandedTrackId === track.trackId ? 'tg__row--ring' : '']" 
          role="button" tabindex="0" :aria-expanded="expandedTrackId === track.trackId"
          @click="$emit('toggle', track.trackId)"
          @keydown.enter.prevent="$emit('toggle', track.trackId)"
          @keydown.space.prevent="$emit('toggle', track.trackId)"
        >
          <span class="tg__num" :class="{ 'tg__num--rls': isRLS }">{{ track.trackNumber }}</span>
          <span class="tg__name" :class="{ 'tg__name--rls': isRLS }">{{ track.trackName }}</span>

          <div class="tg__splits-count">
            <span class="tg__splits-val" :class="track.splits.length > 0 ? 'tg__splits-val--has' : ''">{{ track.splits.length }}</span>
          </div>

          <div class="tg__dist">
            <ShareBarEnhanced
              :confirmed-share="getConfirmedShare(track)"
              :pending-count="isRLS ? 0 : getPendingCount(track)"
              :unclaimed-count="getUnclaimedCount(track)"
              :is-r-l-s="isRLS"
            />
          </div>

          <div class="tg__actions">
            <button
              v-if="track.splits.length > 0"
              @click.stop="$emit('copy-to', track.trackId)"
              class="tg__copy-btn"
              title="Copy splits to other tracks"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M15 6H8.25C7.42 6 6.75 6.67 6.75 7.5V14.25C6.75 15.08 7.42 15.75 8.25 15.75H15C15.83 15.75 16.5 15.08 16.5 14.25V7.5C16.5 6.67 15.83 6 15 6Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M3.75 12H3C2.60218 12 2.22064 11.842 1.93934 11.5607C1.65804 11.2794 1.5 10.8978 1.5 10.5V3C1.5 2.60218 1.65804 2.22064 1.93934 1.93934C2.22064 1.65804 2.60218 1.5 3 1.5H10.5C10.8978 1.5 11.2794 1.65804 11.5607 1.93934C11.842 2.22064 12 2.60218 12 3V3.75" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
            <button
              @click.stop="$emit('toggle', track.trackId)"
              class="tg__pill"
              :class="pillClass(track)"
            >
              {{ expandedTrackId === track.trackId ? 'Close' : (track.splits.length === 0 ? 'Add Split' : 'Splits') }}
            </button>
          </div>
        </div>

        <!-- Mobile row -->
        <div
          class="tg__row-m"
          :class="[rowStatusClass(track), expandedTrackId === track.trackId ? 'tg__row--ring' : '']"
          role="button" tabindex="0" :aria-expanded="expandedTrackId === track.trackId"
          @click="$emit('toggle', track.trackId)"
          @keydown.enter.prevent="$emit('toggle', track.trackId)"
          @keydown.space.prevent="$emit('toggle', track.trackId)"
        >
          <div class="tg__m-top">
            <span class="tg__m-num">{{ track.trackNumber }}</span>
            <span class="tg__m-name">{{ track.trackName }}</span>
            <span class="tg__m-badge" :class="track.splits.length > 0 ? 'tg__m-badge--has' : ''">
              {{ track.splits.length }} split{{ track.splits.length !== 1 ? 's' : '' }}
            </span>
          </div>

          <div class="tg__m-bottom">
            <div class="tg__m-bar">
              <ShareBarEnhanced
                :confirmed-share="getConfirmedShare(track)"
                :pending-count="isRLS ? 0 : getPendingCount(track)"
                :unclaimed-count="getUnclaimedCount(track)"
                :is-r-l-s="isRLS"
              />
            </div>
            <div class="tg__m-btns">
              <button
                v-if="track.splits.length > 0"
                @click.stop="$emit('copy-to', track.trackId)"
                class="tg__m-copy"
                title="Copy splits"
              >
                <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
                  <path d="M15 6H8.25C7.42 6 6.75 6.67 6.75 7.5V14.25C6.75 15.08 7.42 15.75 8.25 15.75H15C15.83 15.75 16.5 15.08 16.5 14.25V7.5C16.5 6.67 15.83 6 15 6Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M3.75 12H3C2.60218 12 2.22064 11.842 1.93934 11.5607C1.65804 11.2794 1.5 10.8978 1.5 10.5V3C1.5 2.60218 1.65804 2.22064 1.93934 1.93934C2.22064 1.65804 2.60218 1.5 3 1.5H10.5C10.8978 1.5 11.2794 1.65804 11.5607 1.93934C11.842 2.22064 12 2.60218 12 3V3.75" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
              <button
                @click.stop="$emit('toggle', track.trackId)"
                class="tg__m-pill"
                :class="mPillClass(track)"
              >
                {{ expandedTrackId === track.trackId ? 'Close' : (track.splits.length === 0 ? 'Add' : 'View') }}
              </button>
            </div>
          </div>
        </div>

        <!-- Expanded editor -->
        <SplitsEditor
          v-if="expandedTrackId === track.trackId"
          :account-holder="release.accountHolder"
          :user-share="track.userShare"
          :existing-splits="track.splits"
          :other-tracks="getOtherTracksWithSplits(track.trackId)"
          :has-changes="hasChangesForTrack(track.trackId)"
          :known-collaborators="knownCollaborators"
          :is-r-l-s="isRLS"
          :save-requested="saveRequested"
          @close="$emit('toggle', track.trackId)"
          @save="(changes) => $emit('save', track.trackId, changes)"
          @resend-confirmation="(id) => $emit('resend-confirmation', track.trackId, id)"
          @open-copy-modal="$emit('open-copy-modal', track.trackId)"
          @dirty-change="(isDirty) => $emit('dirty-change', track.trackId, isDirty)"
          @edit-email="(email) => $emit('edit-email', track.trackId, email)"
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
  saveRequested?: number
}>()

defineEmits<{
  toggle: [trackId: string]
  save: [trackId: string, changes: { added: any[], edited: any[], deleted: string[] }]
  'resend-confirmation': [trackId: string, splitId: string]
  'open-copy-modal': [trackId: string]
  'copy-to': [trackId: string]
  'dirty-change': [trackId: string, isDirty: boolean]
  'edit-email': [trackId: string, email: string]
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

// Returns a BEM modifier class for the row based on track status
const rowStatusClass = (track: TrackSplit): string => {
  const status = rowStatus(track)
  if (status === 'confirmed') return 'tg__row--confirmed'
  if (status === 'pending') return 'tg__row--pending'
  if (status === 'rejected') return 'tg__row--rejected'
  if (status === 'unclaimed') return 'tg__row--unclaimed'
  return props.isRLS ? 'tg__row--rls-none' : 'tg__row--none'
}

// Desktop pill button class
const pillClass = (track: TrackSplit): string => {
  if (props.expandedTrackId === track.trackId) return props.isRLS ? 'tg__pill--close-rls' : 'tg__pill--close'
  if (track.splits.length === 0) return 'tg__pill--add'
  return props.isRLS ? 'tg__pill--rls' : 'tg__pill--default'
}

// Mobile pill button class
const mPillClass = (track: TrackSplit): string => {
  if (props.expandedTrackId === track.trackId) return props.isRLS ? 'tg__m-pill--close-rls' : 'tg__m-pill--close'
  if (track.splits.length === 0) return 'tg__m-pill--add'
  return props.isRLS ? 'tg__m-pill--rls' : 'tg__m-pill--default'
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

<style lang="scss" scoped>
.tg {
  border-radius: $radius-card;
  overflow: hidden;
  background: #fff;

  &--rls {
    background: var(--rls-card);
  }

  /* ---- Table header ---- */
  &__head {
    display: none;

    @include sm {
      display: grid;
      grid-template-columns: auto 1fr auto auto auto;
      gap: 1rem;
      align-items: center;
      padding: 0.75rem 1rem;
      background: var(--lighter-grey);
    }

    &--rls {
      background: var(--rls-bg-elevated);
    }
  }

  &__th {
    font-size: $text-xs;
    font-family: $font-satoshi;
    color: var(--ditto-grey);

    &--rls { color: var(--rls-text-secondary); }
    &--num { width: 2rem; text-align: center; }
    &--splits { width: 4rem; text-align: center; }
    &--dist { width: 10rem; }
    &--act { width: 9rem; text-align: right; }
  }

  /* ---- Track wrapper ---- */
  &__track-wrap {}

  /* ---- Desktop row ---- */
  &__row {
    display: none;
    cursor: pointer;
    transition: background 0.15s;

    @include sm {
      display: grid;
      grid-template-columns: auto 1fr auto auto auto;
      gap: 1rem;
      align-items: center;
      padding: 1rem;
    }

    &--ring { box-shadow: inset 0 0 0 1px rgba($color-brand-secondary, 0.3); }

    &--confirmed {
      background: rgba($color-success, 0.05);
      &:hover { background: rgba($color-success, 0.1); }
    }
    &--pending {
      background: rgba($color-amber-500, 0.05);
      &:hover { background: rgba($color-amber-500, 0.1); }
    }
    &--rejected {
      background: rgba($color-error, 0.05);
      &:hover { background: rgba($color-error, 0.1); }
    }
    &--unclaimed {
      background: rgba($color-orange-500, 0.05);
      &:hover { background: rgba($color-orange-500, 0.1); }
    }
    &--none {
      background: #fff;
      &:hover { background: var(--lighter-grey); }
    }
    &--rls-none {
      background: transparent;
      &:hover { background: rgba(255, 255, 255, 0.05); }
    }
  }

  &__num {
    font-size: $text-body;
    font-weight: 600;
    font-family: $font-satoshi;
    width: 2rem;
    text-align: center;
    color: var(--blue);

    &--rls { color: var(--rls-text); }
  }

  &__name {
    font-size: $text-sm;
    font-weight: 500;
    font-family: $font-satoshi;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: var(--blue);

    &--rls { color: var(--rls-text); }
  }

  &__splits-count { width: 4rem; text-align: center; }

  &__splits-val {
    font-size: $text-sm;
    font-weight: 600;
    font-family: $font-satoshi;
    color: var(--ditto-grey);

    &--has { color: var(--split-yours); }
  }

  &__dist { width: 10rem; }

  &__actions {
    width: 9rem;
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
  }

  &__copy-btn {
    padding: 0.5rem;
    color: var(--ditto-grey);
    transition: color 0.15s;

    &:hover { color: var(--brand-secondary); }
  }

  /* ---- Desktop pill ---- */
  &__pill {
    padding: 0.375rem 0.75rem;
    border: 1px solid;
    border-radius: $radius-button;
    font-size: $text-xs;
    font-weight: 500;
    font-family: $font-satoshi;
    transition: border-color 0.15s, color 0.15s, background 0.15s;

    &--close {
      border-color: var(--ditto-grey);
      color: var(--ditto-grey);
      background: #fff;
    }
    &--close-rls {
      border-color: var(--rls-border);
      color: var(--rls-text-secondary);
      background: var(--rls-bg-elevated);
    }
    &--add {
      border-color: rgba($color-brand-secondary, 0.4);
      color: var(--brand-secondary);

      &:hover {
        border-color: var(--brand-secondary);
        background: rgba($color-brand-secondary, 0.05);
      }
    }
    &--default {
      border-color: var(--faded-grey);
      color: var(--ditto-grey);

      &:hover {
        border-color: var(--brand-secondary);
        color: var(--brand-secondary);
      }
    }
    &--rls {
      border-color: var(--rls-border);
      color: var(--rls-text-secondary);

      &:hover {
        border-color: var(--rls-accent);
        color: var(--rls-accent);
      }
    }
  }

  /* ---- Mobile row ---- */
  &__row-m {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 0.75rem;
    cursor: pointer;
    transition: background 0.15s;

    @include sm { display: none; }

    /* Re-use the same status modifiers */
    &.tg__row--confirmed { background: rgba($color-success, 0.05); }
    &.tg__row--pending { background: rgba($color-amber-500, 0.05); }
    &.tg__row--rejected { background: rgba($color-error, 0.05); }
    &.tg__row--unclaimed { background: rgba($color-orange-500, 0.05); }
    &.tg__row--none { background: #fff; }
    &.tg__row--rls-none { background: transparent; }
    &.tg__row--ring { box-shadow: inset 0 0 0 1px rgba($color-brand-secondary, 0.3); }
  }

  &__m-top {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  &__m-num {
    font-size: $text-sm;
    font-weight: 600;
    color: var(--blue);
    font-family: $font-satoshi;
    width: 1.5rem;
    text-align: center;
    flex-shrink: 0;
  }

  &__m-name {
    font-size: $text-sm;
    font-weight: 500;
    color: var(--blue);
    font-family: $font-satoshi;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    flex: 1;
  }

  &__m-badge {
    font-size: $text-xs;
    font-weight: 600;
    font-family: $font-satoshi;
    padding: 0.125rem 0.5rem;
    border-radius: $radius-button;
    background: var(--lighter-grey);
    color: var(--ditto-grey);

    &--has {
      background: rgba($color-brand-secondary, 0.1);
      color: var(--brand-secondary);
    }
  }

  &__m-bottom {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding-left: 2rem;
  }

  &__m-bar { flex: 1; }

  &__m-btns {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    flex-shrink: 0;
  }

  &__m-copy {
    padding: 0.375rem;
    color: var(--ditto-grey);
    transition: color 0.15s;

    &:hover { color: var(--brand-secondary); }
  }

  &__m-pill {
    padding: 0.25rem 0.625rem;
    border: 1px solid;
    border-radius: $radius-button;
    font-size: 11px;
    font-weight: 500;
    font-family: $font-satoshi;

    &--close {
      border-color: var(--ditto-grey);
      color: var(--ditto-grey);
      background: #fff;
    }
    &--close-rls {
      border-color: var(--rls-border);
      color: var(--rls-text-secondary);
      background: var(--rls-bg-elevated);
    }
    &--add {
      border-color: rgba($color-brand-secondary, 0.4);
      color: var(--brand-secondary);
    }
    &--default {
      border-color: var(--faded-grey);
      color: var(--ditto-grey);
    }
    &--rls {
      border-color: var(--rls-border);
      color: var(--rls-text-secondary);
    }
  }
}
</style>
