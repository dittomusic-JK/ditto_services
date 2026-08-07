<template>
  <div class="sbe">
    <!-- Single bar showing ACTUAL current distribution -->
    <div class="sbe__track" :class="{ 'sbe__track--rls': isRLS }">
      <div class="sbe__seg sbe__seg--user" :style="{ width: `${actualUserShare}%` }" />
      <div v-if="confirmedShare > 0" class="sbe__seg sbe__seg--confirmed" :style="{ width: `${confirmedShare}%` }" />

      <!-- Tooltip -->
      <div class="sbe__tip" :class="{ 'sbe__tip--rls': isRLS }">
        <p class="sbe__tip-label">Current active split</p>
        <div class="sbe__tip-rows">
          <div class="sbe__tip-row">
            <div class="sbe__dot sbe__dot--user" />
            <span>You: {{ actualUserShare }}%</span>
          </div>
          <div v-if="confirmedShare > 0" class="sbe__tip-row">
            <div class="sbe__dot sbe__dot--confirmed" />
            <span>Collaborators: {{ confirmedShare }}%</span>
          </div>
        </div>
        <div class="sbe__tip-arrow" :class="{ 'sbe__tip-arrow--rls': isRLS }" />
      </div>
    </div>

    <!-- Your actual percentage -->
    <span class="sbe__pct" :class="{ 'sbe__pct--rls': isRLS }">
      {{ actualUserShare }}%
    </span>

    <!-- Pending invites badge -->
    <div v-if="pendingCount > 0" class="sbe__badge-wrap">
      <span class="sbe__badge sbe__badge--pending">
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          <circle cx="5" cy="5" r="4" stroke="currentColor" stroke-width="1.5"/>
          <path d="M5 3V5.5L6.5 6.5" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        {{ pendingCount }}
      </span>
      <div class="sbe__tip sbe__tip--badge">
        {{ pendingCount }} pending invite{{ pendingCount > 1 ? 's' : '' }} awaiting confirmation
        <div class="sbe__tip-arrow" />
      </div>
    </div>

    <!-- Unclaimed badge -->
    <div v-if="unclaimedCount && unclaimedCount > 0" class="sbe__badge-wrap">
      <span class="sbe__badge sbe__badge--unclaimed" :class="{ 'sbe__badge--unclaimed-rls': isRLS }">
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          <circle cx="5" cy="5" r="4" stroke="currentColor" stroke-width="1.5"/>
          <path d="M5 3V5.5M5 7V7.01" stroke="currentColor" stroke-width="1.25" stroke-linecap="round"/>
        </svg>
        {{ unclaimedCount }}
      </span>
      <div class="sbe__tip" :class="{ 'sbe__tip--rls': isRLS }">
        {{ unclaimedCount }} collaborator{{ unclaimedCount > 1 ? 's need' : ' needs' }} to create a Ditto account
        <div class="sbe__tip-arrow" :class="{ 'sbe__tip-arrow--rls': isRLS }" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  confirmedShare: number
  pendingCount: number
  unclaimedCount?: number
  isRLS?: boolean
}>()

const actualUserShare = computed(() => 100 - props.confirmedShare)
</script>

<style lang="scss" scoped>
/* Shared tooltip mixin */
@mixin tooltip {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-bottom: 0.5rem;
  padding: 0.5rem 0.75rem;
  color: #fff;
  font-size: $text-xs;
  border-radius: $radius-lg;
  white-space: nowrap;
  opacity: 0;
  transition: opacity 0.15s ease;
  pointer-events: none;
  z-index: 20;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  background: var(--blue);
}

.sbe {
  display: flex;
  align-items: center;
  gap: 0.5rem;

  /* ---- Track ---- */
  &__track {
    position: relative;
    display: flex;
    height: 0.5rem;
    width: 6rem;
    border-radius: $radius-button;
    overflow: hidden;
    cursor: help;
    background: var(--light-grey);

    &--rls { background: rgba(255, 255, 255, 0.1); }

    &:hover > .sbe__tip { opacity: 1; }
  }

  /* ---- Segments ---- */
  &__seg {
    height: 100%;
    transition: all 0.15s ease;

    &--user      { background: var(--split-yours); }
    &--confirmed { background: var(--split-confirmed); }
  }

  /* ---- Tooltip ---- */
  &__tip {
    @include tooltip;

    &--rls {
      background: var(--rls-bg-elevated);
      border: 1px solid var(--rls-border);
    }

    &--badge {
      /* inherits base tooltip; used inside badge-wrap */
    }
  }

  &__tip-label {
    font-size: 10px;
    color: rgba(255, 255, 255, 0.7);
    margin-bottom: 0.375rem;
  }

  &__tip-rows {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  &__tip-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  &__dot {
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 50%;

    &--user      { background: var(--split-yours); }
    &--confirmed { background: var(--split-confirmed); }
  }

  &__tip-arrow {
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 4px solid transparent;
    border-top-color: var(--blue);

    &--rls { border-top-color: var(--rls-bg-elevated); }
  }

  /* ---- Percentage ---- */
  &__pct {
    font-size: $text-xs;
    font-weight: 600;
    font-family: $font-satoshi;
    white-space: nowrap;
    color: var(--split-yours);
  }

  /* ---- Badge wrapper (for hover tooltip) ---- */
  &__badge-wrap {
    position: relative;

    &:hover > .sbe__tip { opacity: 1; }
  }

  /* ---- Badges ---- */
  &__badge {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.125rem 0.375rem;
    border-radius: $radius-button;
    font-size: 10px;
    font-weight: 500;
    font-family: $font-satoshi;
    cursor: help;

    &--pending {
      background: rgba($color-amber-500, 0.16);
      color: var(--split-pending);
    }

    &--unclaimed {
      background: rgba($color-orange-500, 0.16);
      color: var(--split-unclaimed);
    }

    &--unclaimed-rls {
      background: rgba($color-orange-500, 0.2);
      color: var(--split-unclaimed);
    }
  }
}
</style>
