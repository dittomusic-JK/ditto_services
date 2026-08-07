<template>
  <div class="tr">
    <div class="tr__row" :class="{ 'tr__row--expanded': isExpanded }">
      <span class="tr__num">{{ trackNumber }}</span>
      <span class="tr__name">{{ trackName }}</span>

      <div class="tr__count">
        <button v-if="splitCount > 0" @click="$emit('toggle')" class="tr__count-link">{{ splitCount }}</button>
      </div>

      <div class="tr__share">
        <template v-if="splitCount > 0">
          <div class="tr__share-inner">
            <DonutChart :segments="shareSegments" :user-share="userShare" :size="24" :stroke-width="4" :show-badge="false" />
            <span class="tr__share-pct">{{ userShare }}%</span>
          </div>
        </template>
      </div>

      <div class="tr__action">
        <button v-if="splitCount === 0" @click="$emit('toggle')" class="tr__btn tr__btn--add">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 3V11M3 7H11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
          Add Split
        </button>
        <button v-else @click="$emit('toggle')" class="tr__btn" :class="isExpanded ? 'tr__btn--close' : 'tr__btn--edit'">
          <EditIcon v-if="!isExpanded" class="tr__btn-icon" />
          <svg v-else width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M10.5 3.5L3.5 10.5M3.5 3.5L10.5 10.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
          {{ isExpanded ? 'Close' : 'Splits' }}
        </button>
      </div>
    </div>

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
  if (props.userShare > 0) segments.push({ percentage: props.userShare, color: '#6C5CE7' })
  const confirmedShare = props.splits.filter(s => s.status === 'active').reduce((sum, s) => sum + s.share, 0)
  if (confirmedShare > 0) segments.push({ percentage: confirmedShare, color: '#FFB100' })
  const pendingShare = props.splits.filter(s => s.status === 'pending').reduce((sum, s) => sum + s.share, 0)
  if (pendingShare > 0) segments.push({ percentage: pendingShare, color: '#F59E0B' })
  const rejectedShare = props.splits.filter(s => s.status === 'rejected').reduce((sum, s) => sum + s.share, 0)
  if (rejectedShare > 0) segments.push({ percentage: rejectedShare, color: '#EE404C' })
  return segments
})
</script>

<style lang="scss" scoped>
.tr {
  border-bottom: 1px solid var(--faded-grey);

  &:last-child { border-bottom: 0; }

  &__row {
    display: grid;
    grid-template-columns: auto 1fr auto auto auto;
    gap: 1rem;
    align-items: center;
    padding: 1rem 0.5rem;

    &--expanded {
      background: var(--lighter-grey);
      border-radius: $radius-card $radius-card 0 0;
    }
  }

  &__num {
    font-size: $text-body;
    font-weight: 600;
    color: var(--blue);
    font-family: $font-satoshi;
    width: 2rem;
    text-align: center;
  }

  &__name {
    font-size: $text-sm;
    font-weight: 500;
    color: var(--blue);
    font-family: $font-satoshi;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__count {
    width: 4rem;
    text-align: center;
  }

  &__count-link {
    font-size: $text-sm;
    font-weight: 600;
    color: var(--split-yours);
    font-family: $font-satoshi;

    &:hover { text-decoration: underline; }
  }

  &__share { width: 8rem; }

  &__share-inner {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  &__share-pct {
    font-size: $text-sm;
    font-weight: 600;
    color: var(--blue);
    font-family: $font-satoshi;
  }

  &__action {
    width: 7rem;
    display: flex;
    justify-content: flex-end;
  }

  &__btn {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.5rem 1rem;
    border: 1px solid var(--brand-secondary);
    border-radius: $radius-button;
    font-size: $text-sm;
    font-weight: 600;
    font-family: $font-satoshi;
    transition: background 0.15s, border-color 0.15s, color 0.15s;

    &--add {
      color: var(--brand-secondary);
      &:hover { background: rgba($color-brand-secondary, 0.05); }
    }

    &--edit {
      color: var(--brand-secondary);
      &:hover { background: rgba($color-brand-secondary, 0.05); }
    }

    &--close {
      border-color: var(--ditto-grey);
      color: var(--ditto-grey);
      background: #fff;
    }
  }

  &__btn-icon {
    width: 1rem;
    height: 1rem;
  }
}
</style>
