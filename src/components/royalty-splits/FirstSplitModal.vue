<template>
  <Teleport to="body">
    <div class="fsm-overlay" @click="$emit('close')">
      <div class="fsm" :class="{ 'fsm--rls': isRLS }" @click.stop>
        <h2 class="fsm__title" :class="{ 'fsm__title--rls': isRLS }">You've set up your first split! 🎉</h2>
        <p class="fsm__subtitle" :class="{ 'fsm__subtitle--rls': isRLS }">Here's how it works:</p>

        <div v-if="!isRLS" class="fsm__steps">
          <div class="fsm__step">
            <div class="fsm__step-icon fsm__step-icon--blue">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M14 4L6 12L2 8" stroke="#287EF7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </div>
            <div>
              <p class="fsm__step-title">We'll email your collaborator</p>
              <p class="fsm__step-desc">They'll receive an invite to confirm their share</p>
            </div>
          </div>
          <div class="fsm__step">
            <div class="fsm__step-icon fsm__step-icon--amber">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="#F59E0B" stroke-width="2"/><path d="M8 5V8.5L10 10" stroke="#F59E0B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </div>
            <div>
              <p class="fsm__step-title">They can accept or decline</p>
              <p class="fsm__step-desc">The split is pending until they respond</p>
            </div>
          </div>
          <div class="fsm__step">
            <div class="fsm__step-icon fsm__step-icon--purple">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 1V15M1 8H15" stroke="#6C5CE7" stroke-width="2" stroke-linecap="round"/></svg>
            </div>
            <div>
              <p class="fsm__step-title">Royalties stay yours until confirmed</p>
              <p class="fsm__step-desc">Splits only apply from the confirmation date</p>
            </div>
          </div>
        </div>

        <div v-else class="fsm__steps">
          <div class="fsm__step">
            <div class="fsm__step-icon fsm__step-icon--rls-success">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M14 4L6 12L2 8" stroke="#00ff99" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </div>
            <div>
              <p class="fsm__step-title fsm__step-title--rls">Royalties split immediately</p>
              <p class="fsm__step-desc fsm__step-desc--rls">We'll start allocating their share right away</p>
            </div>
          </div>
          <div class="fsm__step">
            <div class="fsm__step-icon fsm__step-icon--rls-highlight">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="2" y="4" width="12" height="8" rx="1" stroke="#ffb100" stroke-width="2"/><path d="M5 8H11" stroke="#ffb100" stroke-width="2" stroke-linecap="round"/></svg>
            </div>
            <div>
              <p class="fsm__step-title fsm__step-title--rls">Funds held until they register</p>
              <p class="fsm__step-desc fsm__step-desc--rls">Their share is safely held in their placeholder account</p>
            </div>
          </div>
          <div class="fsm__step">
            <div class="fsm__step-icon fsm__step-icon--rls-accent">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 2L10 6H14L11 9L12 14L8 11L4 14L5 9L2 6H6L8 2Z" stroke="#9e77ff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </div>
            <div>
              <p class="fsm__step-title fsm__step-title--rls">They can withdraw once registered</p>
              <p class="fsm__step-desc fsm__step-desc--rls">As soon as they create a Ditto account, they can access their earnings</p>
            </div>
          </div>
        </div>

        <p class="fsm__note" :class="{ 'fsm__note--rls': isRLS }">
          {{ isRLS ? 'We\'ll notify them by email to create their account.' : 'You can resend confirmation emails from this page anytime.' }}
        </p>

        <button @click="$emit('close')" class="fsm__cta" :class="{ 'fsm__cta--rls': isRLS }">Got it</button>

        <button v-if="otherTracksCount > 0" @click="$emit('copy-to-all')" class="fsm__copy-link" :class="{ 'fsm__copy-link--rls': isRLS }">
          or Copy this split to {{ otherTracksCount === 1 ? '1 other track' : `all ${otherTracksCount} other tracks` }} →
        </button>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
defineProps<{
  otherTracksCount?: number
  isRLS?: boolean
}>()

defineEmits<{
  close: []
  'copy-to-all': []
}>()
</script>

<style lang="scss" scoped>
.fsm-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.fsm {
  border-radius: $radius-card;
  padding: 1rem;
  width: 100%;
  max-width: 95vw;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  margin: 0 0.5rem;
  background: #fff;

  @include sm { padding: 1.5rem; width: 440px; margin: 0; }

  &--rls { background: var(--rls-card); }

  &__title {
    font-size: $text-h4;
    font-weight: 900;
    font-family: $font-satoshi;
    letter-spacing: -0.03em;
    margin-bottom: 1rem;
    color: var(--blue);

    @include sm { font-size: $text-h3; }
    &--rls { color: var(--rls-text); }
  }

  &__subtitle {
    font-size: $text-sm;
    font-weight: 500;
    font-family: $font-satoshi;
    margin-bottom: 0.75rem;
    color: var(--blue);

    &--rls { color: var(--rls-text); }
  }

  &__steps {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  &__step {
    display: flex;
    gap: 0.75rem;
  }

  &__step-icon {
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    &--blue { background: rgba($color-brand-secondary, 0.1); }
    &--amber { background: $color-amber-100; }
    &--purple { background: rgba($color-ditto-purple, 0.1); }
    &--rls-success { background: rgba($color-rls-success, 0.2); }
    &--rls-highlight { background: rgba($color-rls-highlight, 0.2); }
    &--rls-accent { background: rgba($color-rls-accent, 0.2); }
  }

  &__step-title {
    font-size: $text-sm;
    font-weight: 500;
    color: var(--blue);
    font-family: $font-satoshi;

    &--rls { color: var(--rls-text); }
  }

  &__step-desc {
    font-size: $text-xs;
    color: var(--ditto-grey);
    font-family: $font-satoshi;

    &--rls { color: var(--rls-text-secondary); }
  }

  &__note {
    font-size: $text-xs;
    font-family: $font-satoshi;
    margin-bottom: 1.5rem;
    color: var(--ditto-grey);

    &--rls { color: var(--rls-text-secondary); }
  }

  &__cta {
    width: 100%;
    padding: 0.75rem 1.5rem;
    color: #fff;
    border-radius: $radius-button;
    font-size: $text-sm;
    font-weight: 600;
    font-family: $font-satoshi;
    transition: background 0.15s;
    background: var(--brand-secondary);

    &:hover { background: rgba($color-brand-secondary, 0.9); }
    &--rls {
      background: var(--rls-accent);
      &:hover { background: rgba($color-rls-accent, 0.9); }
    }
  }

  &__copy-link {
    width: 100%;
    margin-top: 0.75rem;
    font-size: $text-sm;
    font-weight: 500;
    font-family: $font-satoshi;
    color: var(--brand-secondary);
    transition: color 0.15s;

    &:hover { text-decoration: underline; }
    &--rls { color: var(--rls-accent); }
  }
}
</style>
