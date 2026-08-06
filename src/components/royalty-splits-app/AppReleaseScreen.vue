<template>
  <div class="ars">
    <p class="ars__intro">Add &amp; edit royalty splits to automatically share the money you earn from this release with your collaborators.</p>

    <!-- Release card -->
    <div class="ars__card">
      <div class="ars__release">
        <img :src="release.artwork" :alt="release.title" class="ars__artwork" />
        <div class="ars__release-info">
          <p class="ars__release-title">{{ release.title }}</p>
          <p class="ars__release-label">Account Holder:</p>
          <p class="ars__release-holder">{{ release.accountHolder }}</p>
        </div>
      </div>

      <!-- Completion (aligned with the web version's ReleaseHeader) -->
      <div class="ars__progress">
        <div class="ars__progress-text">
          <p class="ars__progress-num">{{ tracksWithSplits }}<span class="ars__progress-total">/{{ release.tracks.length }}</span></p>
          <p class="ars__progress-label">tracks with splits</p>
        </div>
        <svg width="44" height="44" viewBox="0 0 44 44" class="ars__ring">
          <circle cx="22" cy="22" r="18" fill="none" stroke="#EFEFFC" stroke-width="4" />
          <circle cx="22" cy="22" r="18" fill="none" stroke="#5f1fff" stroke-width="4" stroke-linecap="round"
            :stroke-dasharray="circumference" :stroke-dashoffset="progressOffset" class="ars__ring-fg" />
        </svg>
      </div>

      <!-- Info note (aligned with the web version's ReleaseHeader) -->
      <p class="ars__note ars__note--spaced">
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" class="ars__note-icon"><circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.5"/><path d="M8 7V11M8 5V5.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
        <span><b class="ars__note-b">Splits apply from confirmation date.</b> Collaborators receive an email to accept. Until confirmed, all royalties remain yours.</span>
      </p>
    </div>

    <!-- Tracks -->
    <h3 class="ars__tracks-title">Tracks</h3>

    <button v-for="track in release.tracks" :key="track.trackId" class="ars__track" :class="trackRowClass(track)" @click="$emit('open-track', track.trackId)">
      <span class="ars__track-num">{{ track.trackNumber }}</span>
      <div class="ars__track-body">
        <p class="ars__track-name">{{ track.trackName }}</p>
        <div class="ars__track-meta">
          <span>Splits: <b class="ars__meta-purple">{{ track.splits.length }}</b></span>
          <span class="ars__track-bar">
            <span class="ars__track-bar-seg ars__track-bar-seg--user" :style="{ width: `${trackUserShare(track)}%` }"></span>
            <span v-if="trackActive(track) > 0" class="ars__track-bar-seg ars__track-bar-seg--active" :style="{ width: `${trackActive(track)}%` }"></span>
          </span>
          <span class="ars__meta-b ars__meta-share">{{ trackUserShare(track) }}%</span>

          <!-- Pending / unclaimed badges (web ShareBarEnhanced parity) -->
          <span v-if="trackPendingCount(track) > 0" class="ars__badge ars__badge--pending">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><circle cx="5" cy="5" r="4" stroke="currentColor" stroke-width="1.5"/><path d="M5 3V5.5L6.5 6.5" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/></svg>
            {{ trackPendingCount(track) }}
          </span>
          <span v-if="trackUnclaimedCount(track) > 0" class="ars__badge ars__badge--unclaimed">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><circle cx="5" cy="5" r="4" stroke="currentColor" stroke-width="1.5"/><path d="M5 3V5.5M5 7V7.01" stroke="currentColor" stroke-width="1.25" stroke-linecap="round"/></svg>
            {{ trackUnclaimedCount(track) }}
          </span>
        </div>
      </div>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ars__track-chevron"><polyline points="9,18 15,12 9,6"/></svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Release, TrackSplit } from '../../types'

const props = defineProps<{ release: Release }>()

defineEmits<{
  'open-track': [trackId: string]
}>()

const tracksWithSplits = computed(() => props.release.tracks.filter(t => t.splits.length > 0).length)
const circumference = 2 * Math.PI * 18
const progressOffset = computed(() => {
  const progress = props.release.tracks.length > 0 ? tracksWithSplits.value / props.release.tracks.length : 0
  return circumference * (1 - progress)
})

// Web semantics: the bar shows the ACTIVE distribution — pending shares still
// count as yours (badges carry the counts) and rejected shares return to you.
const trackActive = (t: TrackSplit) => t.splits.filter(s => s.status === 'active').reduce((sum, s) => sum + s.share, 0)
const trackUserShare = (t: TrackSplit) => Math.max(0, 100 - trackActive(t))
const trackPendingCount = (t: TrackSplit) => t.splits.filter(s => s.status === 'pending').length
const trackUnclaimedCount = (t: TrackSplit) => t.splits.filter(s => s.status === 'unclaimed').length

// Status wash, matching the web TrackGroup row tinting (same precedence)
const trackRowClass = (t: TrackSplit): string => {
  if (t.splits.length === 0) return ''
  const hasActive = t.splits.some(s => s.status === 'active')
  if (t.splits.some(s => s.status === 'unclaimed')) return 'ars__track--unclaimed'
  if (t.splits.some(s => s.status === 'pending')) return 'ars__track--pending'
  if (t.splits.some(s => s.status === 'rejected') && !hasActive) return 'ars__track--rejected'
  return 'ars__track--confirmed'
}

</script>

<style lang="scss" scoped>
.ars {
  &__intro {
    padding: 0.25rem 1.25rem 1rem;
    font-size: $text-sm;
    color: var(--blue);
    font-family: $font-satoshi;
    line-height: 1.5;
  }

  &__card {
    background: var(--lighter-grey);
    padding: 1.25rem;
  }

  &__release {
    display: flex;
    gap: 1rem;
    align-items: center;
  }

  &__artwork {
    width: 5rem;
    height: 5rem;
    border-radius: 0.375rem;
    object-fit: cover;
    flex-shrink: 0;
  }

  &__release-info { min-width: 0; }

  &__release-title {
    font-size: 1.0625rem;
    font-weight: 700;
    color: var(--blue);
    font-family: $font-satoshi;
    letter-spacing: -0.01em;
  }

  &__release-label {
    font-size: 11px;
    color: var(--ditto-grey);
    font-family: $font-satoshi;
    margin-top: 0.5rem;
  }

  &__release-holder {
    font-size: $text-body;
    color: var(--blue);
    font-family: $font-satoshi;
  }

  &__progress {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.625rem;
    margin-top: 1rem;
    padding: 0.875rem 1rem;
    background: #fff;
    border-radius: 0.75rem;
  }

  &__progress-text { text-align: left; }

  &__progress-num {
    font-size: 1.375rem;
    font-weight: 900;
    color: var(--blue);
    font-family: $font-satoshi;
    letter-spacing: -0.03em;
  }

  &__progress-total {
    color: var(--ditto-grey);
    font-weight: 400;
  }

  &__progress-label {
    font-size: 10px;
    color: var(--ditto-grey);
    font-family: $font-satoshi;
  }

  &__ring {
    transform: rotate(-90deg);
    flex-shrink: 0;
  }

  &__ring-fg { transition: stroke-dashoffset 0.5s ease; }

  &__note {
    display: flex;

    &--spaced { margin-top: 1rem; }

    align-items: flex-start;
    gap: 0.5rem;
    font-size: $text-xs;
    color: var(--ditto-grey);
    font-family: $font-satoshi;
    line-height: 1.6;
  }

  &__note-icon {
    flex-shrink: 0;
    margin-top: 0.1875rem;
  }

  &__note-b { color: var(--blue); }

  &__tracks-title {
    padding: 1.25rem 1.25rem 0.75rem;
    font-size: $text-h4;
    font-weight: 500;
    color: var(--blue);
    font-family: $font-satoshi;
    letter-spacing: -0.01em;
  }

  &__track {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 0.875rem;
    text-align: left;
    padding: 1rem 1.25rem;
    border-top: 1px solid var(--faded-grey);
    cursor: pointer;

    &--confirmed { background: rgba($color-success, 0.05); }
    &--pending { background: rgba($color-amber-500, 0.05); }
    &--unclaimed { background: rgba($color-orange-500, 0.05); }
    &--rejected { background: rgba($color-error, 0.05); }
    &:last-child { border-bottom: 1px solid var(--faded-grey); }
    &:active { background: var(--light-grey); }
  }

  &__track-num {
    font-size: $text-h4;
    font-weight: 500;
    color: var(--blue);
    font-family: $font-satoshi;
    flex-shrink: 0;
    width: 1.25rem;
  }

  &__track-body {
    flex: 1;
    min-width: 0;
  }

  &__track-name {
    font-size: $text-body;
    font-weight: 500;
    color: var(--blue);
    font-family: $font-satoshi;
    letter-spacing: -0.01em;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__track-meta {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: $text-xs;
    color: var(--ditto-grey);
    font-family: $font-satoshi;
    margin-top: 0.375rem;
  }

  &__meta-purple { color: $color-brand-primary; }
  &__meta-share { color: var(--brand-secondary); }
  &__meta-b { font-weight: 600; }

  &__track-bar {
    display: flex;
    width: 6rem;
    height: 0.5rem;
    border-radius: 9999px;
    overflow: hidden;
    background: var(--light-grey);
  }

  &__track-bar-seg {
    height: 100%;

    &--user { background: var(--brand-secondary); }
    &--active { background: var(--success); }
  }

  &__badge {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.125rem 0.375rem;
    border-radius: 0.375rem;
    font-size: 10px;
    font-weight: 500;
    font-family: $font-satoshi;

    &--pending {
      background: $color-amber-100;
      color: $color-amber-600;
    }

    &--unclaimed {
      background: $color-orange-100;
      color: $color-orange-600;
    }
  }

  &__track-status {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    font-size: $text-xs;
    color: var(--blue);
    font-family: $font-satoshi;
    margin-top: 0.5rem;
  }

  &__track-dot {
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 9999px;
    background: #00d346;
  }

  &__track-chevron {
    color: var(--darkening-grey);
    flex-shrink: 0;
  }
}
</style>
