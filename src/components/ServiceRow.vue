<template>
  <div
    @click="isClickable ? $emit('toggle') : undefined"
    class="service-row"
    :class="rowModifier"
  >
    <div class="service-row__left">
      <div class="service-row__icon-wrap">
        <slot name="icon" />
        <div v-if="flagCode" class="service-row__flag">
          <img :src="`https://hatscripts.github.io/circle-flags/flags/${flagCode}.svg`" :alt="flagCode" />
        </div>
      </div>
      <span class="service-row__title" :class="{ 'service-row__title--muted': isUnavailable }">
        {{ title }}
      </span>
    </div>
    <div class="service-row__right">
      <span v-if="isActive" class="service-row__badge service-row__badge--active">Active</span>
      <span v-else-if="isUnavailable" class="service-row__badge service-row__badge--unavail">
        Unavailable
        <div v-if="unavailableTooltip" class="service-row__tooltip">
          {{ unavailableTooltip }}
          <div class="service-row__tooltip-arrow" />
        </div>
      </span>
      <span v-else-if="purchased" class="service-row__badge service-row__badge--active">Active</span>
      <template v-else>
        <span class="service-row__price">{{ price }}</span>
        <div class="service-row__check" :class="{ 'service-row__check--selected': selected }">
          <svg v-if="selected" width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M20 6L9 17L4 12" stroke="#2680EB" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ServiceStatus } from '../types'

const props = defineProps<{
  title: string
  price: string
  selected: boolean
  purchased?: boolean
  flagCode?: string
  status?: ServiceStatus
  unavailableTooltip?: string
}>()

defineEmits<{
  toggle: []
}>()

const isActive = computed(() => props.status === 'active')
const isUnavailable = computed(() => props.status === 'unavailable')
const isClickable = computed(() => !props.purchased && !isActive.value && !isUnavailable.value)

const rowModifier = computed(() => {
  if (isActive.value) return 'service-row--active'
  if (isUnavailable.value) return 'service-row--unavail'
  if (props.purchased) return 'service-row--active'
  if (props.selected) return 'service-row--selected'
  return 'service-row--default'
})
</script>

<style lang="scss" scoped>
.service-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem;
  border-radius: $radius-card;
  transition: all 0.15s ease;

  @include sm {
    padding: 1rem;
  }

  &--active {
    background: rgba($color-ditto-pro, 0.1);
  }

  &--unavail {
    background: var(--lighter-grey);
    opacity: 0.6;
  }

  &--selected {
    background: var(--lighter-grey);
  }

  &--default {
    background: var(--lighter-grey);
    cursor: pointer;

    &:hover {
      background: rgba($color-brand-secondary, 0.05);
    }
  }

  &__left {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    min-width: 0;
    flex: 1;

    @include sm {
      gap: 0.75rem;
    }
  }

  &__icon-wrap {
    position: relative;
    width: 2rem;
    height: 2rem;
    border-radius: $radius-lg;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: visible;
    flex-shrink: 0;

    @include sm {
      width: 2.5rem;
      height: 2.5rem;
    }
  }

  &__flag {
    position: absolute;
    top: -0.25rem;
    right: -0.25rem;
    width: 1rem;
    height: 1rem;
    border-radius: 50%;
    overflow: hidden;
    border: 2px solid #fff;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);

    @include sm {
      width: 1.25rem;
      height: 1.25rem;
    }

    img {
      width: 100%;
      height: 100%;
    }
  }

  &__title {
    font-size: $text-sm;
    font-weight: 600;
    font-family: $font-satoshi;
    color: var(--blue);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    @include sm {
      font-size: $text-body;
    }

    &--muted {
      color: var(--dark-grey);
    }
  }

  &__right {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-shrink: 0;

    @include sm {
      gap: 0.75rem;
    }
  }

  &__badge {
    font-size: $text-xs;
    font-weight: 600;
    padding: 0.25rem 0.75rem;
    border-radius: $radius-button;

    &--active {
      color: var(--success);
      background: rgba($color-ditto-pro, 0.2);
    }

    &--unavail {
      color: var(--ditto-grey);
      background: rgba($color-border-grey, 0.5);
      position: relative;
      cursor: help;

      &:hover .service-row__tooltip {
        opacity: 1;
      }
    }
  }

  &__tooltip {
    position: absolute;
    bottom: 100%;
    right: 0;
    margin-bottom: 0.5rem;
    padding: 0.75rem;
    background: var(--blue);
    color: #fff;
    font-size: $text-xs;
    border-radius: $radius-lg;
    white-space: nowrap;
    opacity: 0;
    transition: opacity 0.15s ease;
    pointer-events: none;
    z-index: 10;
  }

  &__tooltip-arrow {
    position: absolute;
    top: 100%;
    right: 1rem;
    border: 4px solid transparent;
    border-top-color: var(--blue);
  }

  &__price {
    font-size: 13px;
    font-weight: 700;
    color: var(--blue);
    font-family: $font-satoshi;

    @include sm {
      font-size: $text-sm;
    }
  }

  &__check {
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    border: 3px solid var(--faded-grey);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.15s ease;
    background: #fff;

    @include sm {
      width: 2.25rem;
      height: 2.25rem;
    }

    &--selected {
      border-color: #2680EB;
    }
  }
}
</style>
