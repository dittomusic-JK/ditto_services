<template>
  <div
    @click="!disabled ? $emit('toggle') : undefined"
    class="feature-card"
    :class="{ 'feature-card--disabled': disabled }"
  >
    <div class="feature-card__header">
      <div class="feature-card__left">
        <div class="feature-card__icon">
          <slot name="icon" />
        </div>
        <div class="feature-card__info">
          <div class="feature-card__title-row">
            <h3 class="feature-card__title">{{ title }}</h3>
            <PlanBadge v-if="badge" :text="badge" :variant="badgeVariant" />
          </div>
          <p class="feature-card__desc">{{ description }}</p>
          <a
            v-if="disabled && disabledMessage && disabledMessageIsLink"
            href="#"
            class="feature-card__disabled-link"
          >
            {{ disabledMessage }}
          </a>
          <p v-else-if="disabled && disabledMessage" class="feature-card__disabled-msg">
            {{ disabledMessage }}
          </p>
        </div>
      </div>
      <div class="feature-card__right">
        <span v-if="isFree" class="feature-card__price feature-card__price--free">Free</span>
        <span v-else-if="price" class="feature-card__price">{{ price }}</span>
        <CircleCheck :checked="checked" :disabled="disabled" @click="$emit('toggle')" />
      </div>
    </div>
    <div v-if="$slots.default" class="feature-card__content">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import PlanBadge from './PlanBadge.vue'
import CircleCheck from './CircleCheck.vue'

withDefaults(defineProps<{
  title: string
  badge?: string
  badgeVariant?: 'green' | 'grey'
  description: string
  checked: boolean
  disabled?: boolean
  disabledMessage?: string
  disabledMessageIsLink?: boolean
  price?: string
  isFree?: boolean
}>(), {
  badgeVariant: 'green'
})

defineEmits<{
  toggle: []
}>()
</script>

<style lang="scss" scoped>
.feature-card {
  border-radius: $radius-card;
  border: 1px solid var(--faded-grey);
  background: var(--lighter-grey);
  padding: 0.75rem;
  overflow: visible;
  cursor: pointer;

  @include sm {
    padding: 1rem;
  }

  &:hover:not(.feature-card--disabled) {
    border-color: var(--brand-secondary);
  }

  &--disabled {
    opacity: 0.7;
    cursor: default;
  }

  &__header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 0.75rem;

    @include sm {
      align-items: center;
      gap: 1rem;
    }
  }

  &__left {
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
    flex: 1;
    min-width: 0;

    @include sm {
      align-items: center;
      gap: 0.75rem;
    }
  }

  &__icon {
    width: 2rem;
    height: 2rem;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 0.125rem;

    @include sm {
      width: 2.5rem;
      height: 2.5rem;
      margin-top: 0;
    }
  }

  &__info {
    flex: 1;
    min-width: 0;
  }

  &__title-row {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    flex-wrap: wrap;

    @include sm {
      flex-direction: row;
      align-items: center;
      gap: 0.75rem;
    }
  }

  &__title {
    font-size: $text-sm;
    font-weight: 600;
    color: var(--blue);
    font-family: $font-satoshi;

    @include sm {
      font-size: $text-body;
    }
  }

  &__desc {
    margin-top: 0.25rem;
    font-size: 13px;
    color: var(--ditto-grey);
    font-family: $font-satoshi;
    line-height: 1.625;

    @include sm {
      font-size: $text-sm;
    }
  }

  &__disabled-link {
    display: block;
    margin-top: 0.25rem;
    font-size: $text-xs;
    color: var(--ditto-starter);
    font-family: $font-satoshi;
    text-decoration: underline;

    &:hover {
      opacity: 0.8;
    }
  }

  &__disabled-msg {
    margin-top: 0.25rem;
    font-size: $text-xs;
    color: var(--ditto-grey);
    font-family: $font-satoshi;
    font-style: italic;
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

  &__price {
    font-size: 13px;
    font-weight: 700;
    color: var(--blue);
    font-family: $font-satoshi;

    @include sm {
      font-size: $text-sm;
    }

    &--free {
      color: var(--ditto-pro);
    }
  }

  &__content {
    margin-top: 1.25rem;
    overflow: visible;
    margin-left: 2.5rem;

    @include sm {
      margin-left: 3.25rem;
    }
  }
}
</style>
