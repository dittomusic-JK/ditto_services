<template>
  <!-- Scoped to the phone frame (absolute rather than a teleported fixed overlay),
       matching AppFirstSplitModal. -->
  <div class="acm-overlay" @click="$emit('cancel')">
    <div class="acm" @click.stop>
      <h2 class="acm__title">{{ title }}</h2>
      <p class="acm__body">{{ body }}</p>

      <div class="acm__actions">
        <button class="acm__btn acm__btn--cancel" @click="$emit('cancel')">{{ cancelLabel }}</button>
        <button class="acm__btn acm__btn--confirm" @click="$emit('confirm')">{{ confirmLabel }}</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  title: string
  body: string
  confirmLabel?: string
  cancelLabel?: string
}>(), {
  confirmLabel: 'Remove',
  cancelLabel: 'Cancel',
})

defineEmits<{
  confirm: []
  cancel: []
}>()
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.acm-overlay {
  position: absolute;
  inset: 0;
  z-index: 30;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  background: rgba(16, 31, 60, 0.45);
}

.acm {
  width: 100%;
  background: #fff;
  border-radius: 1rem;
  padding: 1.5rem 1.25rem 1.25rem;
  text-align: center;
  box-shadow: 0 12px 32px rgba(16, 31, 60, 0.24);

  &__title {
    font-size: $text-h4;
    font-weight: 700;
    color: var(--blue);
    font-family: $font-satoshi;
    letter-spacing: -0.02em;
  }

  &__body {
    margin-top: 0.5rem;
    font-size: $text-sm;
    line-height: 1.55;
    color: var(--ditto-grey);
    font-family: $font-satoshi;
  }

  &__actions {
    display: flex;
    gap: 0.75rem;
    margin-top: 1.5rem;
  }

  &__btn {
    flex: 1;
    padding: 0.875rem 1rem;
    border-radius: 9999px;
    font-size: $text-sm;
    font-weight: 500;
    font-family: $font-satoshi;
    cursor: pointer;

    &--cancel {
      border: 1px solid var(--faded-grey);
      background: #fff;
      color: var(--ditto-grey);

      &:active { background: var(--lighter-grey); }
    }

    &--confirm {
      background: var(--split-rejected);
      color: #fff;

      &:active { opacity: 0.9; }
    }
  }
}
</style>
