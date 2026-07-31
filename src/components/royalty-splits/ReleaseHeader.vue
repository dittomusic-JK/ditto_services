<template>
  <div class="rh">
    <div class="rh__row">
      <div class="rh__left">
        <img :src="artwork" :alt="title" class="rh__artwork" />

        <div class="rh__info">
          <h2 class="rh__title">{{ title }}</h2>
          <p class="rh__subtitle">{{ accountHolder }}</p>
        </div>

        <div v-if="totalTracks > 0" class="rh__progress">
          <div class="rh__progress-text">
            <p class="rh__progress-num">
              {{ tracksWithSplits }}<span class="rh__progress-total">/{{ totalTracks }}</span>
            </p>
            <p class="rh__progress-label">tracks with splits</p>
          </div>
          <svg width="44" height="44" viewBox="0 0 44 44" class="rh__ring">
            <circle cx="22" cy="22" r="18" fill="none" stroke="#EFEFFC" stroke-width="4" />
            <circle
              cx="22" cy="22" r="18" fill="none" stroke="#6C5CE7" stroke-width="4"
              stroke-linecap="round"
              :stroke-dasharray="circumference"
              :stroke-dashoffset="progressOffset"
              class="rh__ring-fg"
            />
          </svg>
        </div>
      </div>
    </div>

    <div v-if="userType === 'subscription'" class="rh__note">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" class="rh__note-icon">
        <circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.5"/>
        <path d="M8 7V11M8 5V5.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
      <p class="rh__note-body">
        <strong class="rh__note-bold">Splits apply from confirmation date.</strong> Collaborators receive an email to accept. Until confirmed, all royalties remain yours.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { UserType } from '../../types'

const props = defineProps<{
  title: string
  artwork: string
  accountHolder: string
  userType: UserType
  totalTracks: number
  tracksWithSplits: number
}>()

const circumference = 2 * Math.PI * 18 // r=18
const progressOffset = computed(() => {
  const progress = props.totalTracks > 0 ? props.tracksWithSplits / props.totalTracks : 0
  return circumference * (1 - progress)
})
</script>

<style lang="scss" scoped>
.rh {
  background: var(--lighter-grey);
  border-radius: $radius-card;
  padding: 0.75rem;

  @include sm {
    padding: 1rem;
  }

  &__row {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;

    @include sm {
      flex-direction: row;
      align-items: center;
      gap: 1rem;
    }
  }

  &__left {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex: 1;
    min-width: 0;

    @include sm { gap: 1rem; }
  }

  &__artwork {
    width: 3rem;
    height: 3rem;
    border-radius: $radius-lg;
    object-fit: cover;
    flex-shrink: 0;

    @include sm {
      width: 4rem;
      height: 4rem;
    }
  }

  &__info {
    flex: 1;
    min-width: 0;
  }

  &__title {
    font-size: $text-body;
    font-weight: 900;
    color: var(--blue);
    font-family: $font-satoshi;
    letter-spacing: -0.03em;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    @include sm { font-size: $text-h4; }
  }

  &__subtitle {
    font-size: $text-xs;
    color: var(--ditto-grey);
    font-family: $font-satoshi;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__progress {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-shrink: 0;

    @include sm { gap: 0.75rem; }
  }

  &__progress-text { text-align: right; }

  &__progress-num {
    font-size: $text-h4;
    font-weight: 900;
    color: var(--blue);
    font-family: $font-satoshi;
    letter-spacing: -0.03em;

    @include sm { font-size: $text-h2; }
  }

  &__progress-total {
    color: var(--ditto-grey);
    font-weight: 400;
  }

  &__progress-label {
    font-size: 10px;
    color: var(--ditto-grey);
    font-family: $font-satoshi;

    @include sm { font-size: $text-xs; }
  }

  &__ring {
    transform: rotate(-90deg);
    display: none;

    @include sm { display: block; }
  }

  &__ring-fg {
    transition: all 0.5s ease;
  }

  /* ---- Info note ---- */
  &__note {
    margin-top: 0.75rem;
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
    font-size: $text-xs;
    color: var(--ditto-grey);
    font-family: $font-satoshi;
  }

  &__note-icon {
    flex-shrink: 0;
    margin-top: 0.125rem;
  }

  &__note-body {
    line-height: 1.625;
  }

  &__note-bold {
    color: var(--blue);
  }
}
</style>
