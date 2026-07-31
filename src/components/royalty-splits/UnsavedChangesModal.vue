<template>
  <Teleport to="body">
    <div class="ucm-overlay" @click.self="$emit('cancel')">
      <div class="ucm" @click.stop>
        <div class="ucm__body">
          <div class="ucm__icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" class="ucm__icon-svg">
              <path d="M12 9V13M12 17H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <h2 class="ucm__title">Unsaved Changes</h2>
          <p class="ucm__desc">You have unsaved changes to your royalty splits. Do you want to save before leaving?</p>
        </div>
        <div class="ucm__actions">
          <button @click="$emit('save')" class="ucm__btn-save">Save Changes</button>
          <button @click="$emit('discard')" class="ucm__btn-discard">Discard Changes</button>
          <button @click="$emit('cancel')" class="ucm__btn-cancel">Cancel</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
defineEmits<{
  save: []
  discard: []
  cancel: []
}>()
</script>

<style lang="scss" scoped>
.ucm-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.ucm {
  background: #fff;
  border-radius: $radius-card;
  width: 100%;
  max-width: 95vw;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  margin: 0 0.5rem;

  @include sm { width: 400px; margin: 0; }

  &__body {
    padding: 1rem;
    @include sm { padding: 1.5rem; }
  }

  &__icon {
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    background: $color-amber-100;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 1rem;
  }

  &__icon-svg { color: $color-amber-600; }

  &__title {
    font-size: $text-h4;
    font-weight: 900;
    color: var(--blue);
    font-family: $font-satoshi;
    letter-spacing: -0.03em;
    text-align: center;
    margin-bottom: 0.5rem;
  }

  &__desc {
    font-size: $text-sm;
    color: var(--ditto-grey);
    font-family: $font-satoshi;
    text-align: center;
  }

  &__actions {
    padding: 0 1rem 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    @include sm { padding: 0 1.5rem 1.5rem; }
  }

  &__btn-save {
    width: 100%;
    padding: 0.625rem 1.5rem;
    background: var(--brand-secondary);
    color: #fff;
    border-radius: $radius-button;
    font-size: $text-sm;
    font-weight: 600;
    font-family: $font-satoshi;
    transition: background 0.15s;
    &:hover { background: rgba($color-brand-secondary, 0.9); }
  }

  &__btn-discard {
    width: 100%;
    padding: 0.625rem 1.5rem;
    border: 1px solid var(--faded-grey);
    border-radius: $radius-button;
    font-size: $text-sm;
    font-weight: 600;
    color: var(--ditto-grey);
    font-family: $font-satoshi;
    transition: border-color 0.15s, color 0.15s;
    &:hover { border-color: var(--error); color: var(--error); }
  }

  &__btn-cancel {
    width: 100%;
    padding: 0.625rem 1.5rem;
    font-size: $text-sm;
    font-weight: 500;
    color: var(--ditto-grey);
    font-family: $font-satoshi;
    transition: color 0.15s;
    &:hover { color: var(--blue); }
  }
}
</style>
