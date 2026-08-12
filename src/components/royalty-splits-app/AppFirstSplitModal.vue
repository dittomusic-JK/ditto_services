<template>
  <!-- Same content as the web FirstSplitModal, scoped to the phone frame
       (absolute rather than a teleported fixed overlay). -->
  <div class="afs-overlay" @click="$emit('close')">
    <div class="afs" @click.stop>
      <h2 class="afs__title">You've set up your first split! 🎉</h2>
      <p class="afs__subtitle">Here's how it works:</p>

      <div class="afs__steps">
        <div class="afs__step">
          <div class="afs__step-icon afs__step-icon--blue">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M14 4L6 12L2 8" stroke="#287EF7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
          <div>
            <p class="afs__step-title">We'll email your collaborator</p>
            <p class="afs__step-desc">They'll receive an invite to confirm their share</p>
          </div>
        </div>
        <div class="afs__step">
          <div class="afs__step-icon afs__step-icon--amber">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="#F59E0B" stroke-width="2"/><path d="M8 5V8.5L10 10" stroke="#F59E0B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
          <div>
            <p class="afs__step-title">They can accept or decline</p>
            <p class="afs__step-desc">The split is pending until they respond</p>
          </div>
        </div>
        <div class="afs__step">
          <div class="afs__step-icon afs__step-icon--purple">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 1V15M1 8H15" stroke="#6C5CE7" stroke-width="2" stroke-linecap="round"/></svg>
          </div>
          <div>
            <p class="afs__step-title">Royalties stay yours until confirmed</p>
            <p class="afs__step-desc">Splits only apply from the confirmation date</p>
          </div>
        </div>
      </div>

      <p class="afs__note">You can resend confirmation emails from this page anytime.</p>

      <button class="afs__cta" @click="$emit('close')">Got it</button>

      <button v-if="otherTracksCount > 0" class="afs__copy-link" @click="$emit('copy-to-all')">
        or Copy this split to {{ otherTracksCount === 1 ? '1 other track' : `all ${otherTracksCount} other tracks` }} &rarr;
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ otherTracksCount?: number }>(), { otherTracksCount: 0 })

defineEmits<{
  close: []
  'copy-to-all': []
}>()
</script>

<style lang="scss" scoped>
.afs-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  z-index: 60;
}

.afs {
  width: 100%;
  background: #fff;
  border-radius: 1.25rem;
  padding: 1.5rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25);
  max-height: 100%;
  overflow-y: auto;

  &__title {
    font-size: $text-h4;
    font-weight: 700;
    color: var(--blue);
    font-family: $font-satoshi;
    letter-spacing: -0.03em;
    margin-bottom: 0.75rem;
  }

  &__subtitle {
    font-size: $text-sm;
    color: var(--blue);
    font-family: $font-satoshi;
    margin-bottom: 1rem;
  }

  &__steps {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 1.25rem;
  }

  &__step {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
  }

  &__step-icon {
    width: 2rem;
    height: 2rem;
    border-radius: 9999px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    &--blue { background: rgba($color-brand-secondary, 0.12); }
    &--amber { background: rgba($color-amber-500, 0.14); }
    &--purple { background: rgba($color-ditto-purple, 0.12); }
  }

  &__step-title {
    font-size: $text-sm;
    font-weight: 600;
    color: var(--blue);
    font-family: $font-satoshi;
  }

  &__step-desc {
    font-size: $text-xs;
    color: var(--ditto-grey);
    font-family: $font-satoshi;
    margin-top: 0.125rem;
    line-height: 1.45;
  }

  &__note {
    font-size: $text-xs;
    color: var(--ditto-grey);
    font-family: $font-satoshi;
    margin-bottom: 1.25rem;
  }

  &__cta {
    width: 100%;
    padding: 0.875rem 1rem;
    border-radius: 9999px;
    background: var(--brand-secondary);
    color: #fff;
    font-size: $text-sm;
    font-weight: 600;
    font-family: $font-satoshi;
    cursor: pointer;

    &:hover { opacity: 0.95; }
  }

  &__copy-link {
    display: block;
    width: 100%;
    margin-top: 0.875rem;
    font-size: $text-sm;
    font-weight: 500;
    color: var(--brand-secondary);
    font-family: $font-satoshi;
    text-align: center;
    cursor: pointer;

    &:hover { text-decoration: underline; }
  }
}
</style>
