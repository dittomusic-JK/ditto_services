<template>
  <div class="ats">
    <!-- Track header -->
    <div class="ats__head">
      <button class="ats__back" @click="$emit('back')" aria-label="Back to release">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15,18 9,12 15,6"/></svg>
      </button>
      <span v-if="trackNumber" class="ats__num">{{ trackNumber }}</span>
      <div class="ats__head-info">
        <h2 class="ats__title">{{ title }}</h2>
        <div class="ats__meta">
          <span>Splits: <b class="ats__meta-purple">{{ splits.length }}</b></span>
          <span>
            Your Split: <b class="ats__meta-purple">{{ activeUserShare }}%</b>
            <template v-if="stagedUserShare !== activeUserShare">
              <span class="ats__meta-sep">&gt;</span>
              <b class="ats__meta-pending">{{ stagedUserShare }}%</b>
              <span class="ats__meta-tag">Pending</span>
            </template>
          </span>
        </div>
        <p v-if="pendingCount > 0" class="ats__pending-note">
          <svg width="11" height="11" viewBox="0 0 10 10" fill="none"><circle cx="5" cy="5" r="4" stroke="currentColor" stroke-width="1.5"/><path d="M5 3V5.5L6.5 6.5" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/></svg>
          {{ pendingCount }} pending invite{{ pendingCount === 1 ? '' : 's' }} awaiting confirmation
        </p>
      </div>
    </div>

    <!-- Collaborators -->
    <p v-if="splits.length > 0" class="ats__section-label">Collaborators</p>

    <div v-for="split in splits" :key="split.id" class="ats__collab">
      <div class="ats__collab-top">
        <p class="ats__collab-name">{{ split.name }}</p>
        <button class="ats__menu" @click="$emit('menu', split)" aria-label="Collaborator options">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="1.8"/><circle cx="12" cy="12" r="1.8"/><circle cx="19" cy="12" r="1.8"/></svg>
        </button>
      </div>
      <p class="ats__collab-line">Email: <span class="ats__collab-email">{{ split.email }}</span></p>
      <p class="ats__collab-line">
        Share:
        <!-- Share changed and awaiting re-confirmation (web pending-change parity) -->
        <template v-if="hasPendingChange(split)">
          <span class="ats__pend-from">{{ split.originalShare }}%</span>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" class="ats__pend-arrow"><path d="M4 6H8M8 6L6 4M8 6L6 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          <span class="ats__pend-to">{{ split.share }}%</span>
        </template>
        <span v-else class="ats__collab-share" :class="{ 'ats__collab-share--rejected': split.status === 'rejected' }">{{ split.share }}%</span>
      </p>

      <!-- Not registered yet — web shows this on hover; mobile has no hover, so it's inline -->
      <p v-if="split.hasAccount === false" class="ats__unreg">
        <svg width="13" height="13" viewBox="0 0 16 16" fill="none" class="ats__unreg-icon"><circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.5"/><path d="M8 5V8.5M8 10.5V10.51" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
        Not registered yet. They'll need to create a Ditto account to approve.
      </p>
      <p v-if="split.status === 'active'" class="ats__status ats__status--active">
        <span class="ats__dot ats__dot--active"></span>
        Active{{ split.activeSince ? ` since ${split.activeSince}` : '' }}
      </p>
      <p v-else-if="split.status === 'pending'" class="ats__status ats__status--pending">
        <span class="ats__dot ats__dot--pending"></span>
        Pending
      </p>
      <p v-else-if="split.status === 'unclaimed'" class="ats__status ats__status--unclaimed">
        <span class="ats__dot ats__dot--unclaimed"></span>
        Needs a Ditto account to claim
      </p>
      <p v-else-if="split.status === 'rejected'" class="ats__status ats__status--rejected">
        <span class="ats__dot ats__dot--rejected"></span>
        Declined &mdash; their share stays with you. Edit to send a new offer.
      </p>
    </div>

    <!-- Empty placeholder (matches the design's greyed New Collaborator card) -->
    <button v-if="splits.length === 0" class="ats__placeholder" @click="$emit('add')">
      <div class="ats__placeholder-body">
        <p class="ats__placeholder-title">New Collaborator</p>
        <p class="ats__placeholder-line">Email: <span class="ats__placeholder-purple">N/A</span></p>
        <p class="ats__placeholder-line">Share: <span class="ats__placeholder-purple">0%</span> <span class="ats__placeholder-pie"></span></p>
      </div>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ats__placeholder-chevron"><polyline points="9,18 15,12 9,6"/></svg>
    </button>

    <!-- Add + copy links -->
    <button class="ats__add-link" @click="$emit('add')">+ Add another collaborator</button>
    <button v-if="hasCopySources" class="ats__add-link ats__add-link--copy" @click="$emit('copy-from')">Copy splits from another track</button>
    <button v-if="splits.length > 0" class="ats__add-link ats__add-link--copy" @click="$emit('copy-to')">Copy these splits to other tracks</button>

    <!-- Save -->
    <button class="ats__save" :disabled="!dirty" @click="$emit('save')">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7l-4-4zm-7 16a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm3-10H6V5h9v4z"/></svg>
      Save Royalty Split
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Collaborator } from '../../types'

const props = withDefaults(defineProps<{
  title: string
  trackNumber?: number
  splits: Collaborator[]
  dirty?: boolean
  hasCopySources?: boolean
}>(), {
  dirty: false,
  hasCopySources: false,
})

defineEmits<{
  back: []
  add: []
  save: []
  menu: [split: Collaborator]
  'copy-from': []
  'copy-to': []
}>()

// Web SplitsEditor semantics:
//  activeUserShare = what you hold today (only confirmed splits reduce it)
//  stagedUserShare = what you'd hold once pending splits confirm (rejected excluded)
const activeUserShare = computed(
  () => 100 - props.splits.filter(s => s.status === 'active').reduce((sum, s) => sum + s.share, 0)
)
const stagedUserShare = computed(
  () => Math.max(0, 100 - props.splits.filter(s => s.status !== 'rejected').reduce((sum, s) => sum + s.share, 0))
)
const pendingCount = computed(() => props.splits.filter(s => s.status === 'pending').length)

// A saved split whose share was revised and is awaiting re-confirmation
const hasPendingChange = (split: Collaborator): boolean =>
  split.originalShare !== undefined && split.originalShare !== split.share && split.status === 'pending'

</script>

<style lang="scss" scoped>
.ats {
  &__head {
    display: flex;
    align-items: center;
    gap: 0.625rem;
    padding: 1rem 1.25rem;
    border-bottom: 1px solid var(--faded-grey);
  }

  &__back {
    display: inline-flex;
    color: var(--blue);
    cursor: pointer;
    padding: 0.125rem;
    flex-shrink: 0;
  }

  &__num {
    font-size: $text-h4;
    font-weight: 500;
    color: var(--blue);
    font-family: $font-satoshi;
    flex-shrink: 0;
  }

  &__head-info { min-width: 0; }

  &__title {
    font-size: $text-body;
    font-weight: 500;
    color: var(--blue);
    font-family: $font-satoshi;
    letter-spacing: -0.01em;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__meta {
    display: flex;
    align-items: center;
    gap: 0.625rem;
    font-size: $text-xs;
    color: var(--ditto-grey);
    font-family: $font-satoshi;
    margin-top: 0.25rem;
  }

  &__meta-purple {
    color: $color-brand-primary;
    font-weight: 600;
  }

  &__meta-sep {
    margin: 0 0.25rem;
    color: var(--ditto-grey);
  }

  &__meta-pending {
    color: $color-amber-500;
    font-weight: 600;
  }

  &__meta-tag {
    margin-left: 0.25rem;
    font-size: 10px;
    color: $color-amber-500;
  }

  &__pending-note {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    margin-top: 0.375rem;
    font-size: $text-xs;
    color: $color-amber-600;
    font-family: $font-satoshi;
  }

  &__unreg {
    display: flex;
    align-items: flex-start;
    gap: 0.375rem;
    margin-top: 0.5rem;
    font-size: 11px;
    line-height: 1.45;
    color: $color-amber-600;
    font-family: $font-satoshi;
  }

  &__unreg-icon {
    flex-shrink: 0;
    margin-top: 0.0625rem;
  }

  &__section-label {
    padding: 1rem 1.25rem 0.25rem;
    font-size: $text-body;
    color: var(--blue);
    font-family: $font-satoshi;
  }

  &__collab {
    padding: 0.875rem 1.25rem;
    border-bottom: 1px solid var(--faded-grey);
  }

  &__collab-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__collab-name {
    font-size: 1.0625rem;
    font-weight: 500;
    color: var(--blue);
    font-family: $font-satoshi;
    letter-spacing: -0.01em;
  }

  &__menu {
    color: var(--ditto-grey);
    cursor: pointer;
    padding: 0.25rem;
    &:hover { color: var(--blue); }
  }

  &__collab-line {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    font-size: $text-sm;
    color: var(--blue);
    font-family: $font-satoshi;
    margin-top: 0.375rem;
  }

  &__collab-email { color: $color-brand-primary; }

  &__pend-from {
    font-size: $text-sm;
    font-weight: 600;
    color: #00b344;
    font-family: $font-satoshi;
  }

  &__pend-arrow { color: var(--ditto-grey); }

  &__pend-to {
    font-size: $text-sm;
    font-weight: 600;
    color: $color-amber-600;
    font-family: $font-satoshi;
  }

  &__collab-share {
    color: $color-brand-primary;
    font-weight: 600;

    &--rejected {
      color: var(--error);
      text-decoration: line-through;
    }
  }

  &__status {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    font-size: $text-xs;
    font-family: $font-satoshi;
    margin-top: 0.5rem;

    &--active { color: var(--blue); }
    &--pending { color: $color-amber-600; }
    &--unclaimed { color: $color-orange-600; }
    &--rejected { color: var(--error); }
  }

  &__dot {
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 9999px;

    &--active { background: #00d346; }
    &--pending { background: $color-amber-500; }
    &--unclaimed { background: $color-orange-500; }
    &--rejected { background: var(--error); }
  }

  &__placeholder {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    text-align: left;
    padding: 0.875rem 1.25rem;
    border-bottom: 1px solid var(--faded-grey);
    cursor: pointer;

    &:active { background: var(--lighter-grey); }
  }

  &__placeholder-title {
    font-size: 1.0625rem;
    font-weight: 500;
    color: var(--darkening-grey);
    font-family: $font-satoshi;
  }

  &__placeholder-line {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    font-size: $text-sm;
    color: var(--blue);
    font-family: $font-satoshi;
    margin-top: 0.375rem;
  }

  &__placeholder-purple { color: $color-brand-primary; }

  &__placeholder-pie {
    width: 14px;
    height: 14px;
    border-radius: 9999px;
    background: var(--light-grey);
  }

  &__placeholder-chevron { color: var(--darkening-grey); }

  &__add-link {
    display: block;
    margin: 1.25rem 1.25rem 0;

    &--copy {
      margin-top: 0.875rem;
      color: var(--ditto-grey);
    }

    font-size: $text-sm;
    color: var(--blue);
    font-family: $font-satoshi;
    text-decoration: underline;
    text-underline-offset: 3px;
    cursor: pointer;

    &:hover { color: $color-brand-primary; }
  }

  &__save {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    width: calc(100% - 2.5rem);
    margin: 1.5rem 1.25rem 0;
    padding: 0.875rem 1rem;
    border: 1.5px solid var(--brand-secondary);
    border-radius: 9999px;
    background: #fff;
    font-size: $text-sm;
    font-weight: 500;
    color: var(--brand-secondary);
    font-family: $font-satoshi;
    cursor: pointer;
    transition: background 0.15s, opacity 0.15s;

    &:hover { background: rgba($color-brand-secondary, 0.05); }
    &:disabled { opacity: 0.4; cursor: not-allowed; }
  }
}
</style>
