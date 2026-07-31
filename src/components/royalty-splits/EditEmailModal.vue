<template>
  <Teleport to="body">
    <div class="eem-overlay" @click="$emit('close')">
      <div class="eem" @click.stop>
        <div class="eem__head">
          <div class="eem__head-row">
            <h2 class="eem__title">Update collaborator email</h2>
            <button class="eem__close" @click="$emit('close')" aria-label="Close">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 6L6 18M6 6l12 12" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </button>
          </div>
          <p class="eem__desc">
            Changing this email will move all sales and royalties for this split to the new email's account. Invitations previously sent to the old email address will no longer work.
          </p>
        </div>

        <div class="eem__body">
          <div class="eem__field">
            <label class="eem__label">Current email</label>
            <p class="eem__current">{{ currentEmail }}</p>
          </div>

          <div class="eem__field">
            <label class="eem__label">New email</label>
            <input
              v-model="newEmail"
              type="email"
              placeholder="name@example.com"
              class="eem__input"
              @keydown.enter="handleConfirm"
            />
            <p v-if="emailError" class="eem__error">{{ emailError }}</p>
          </div>

          <label v-if="otherTracks.length > 0" class="eem__check">
            <input type="checkbox" :checked="applyToAll" class="eem__check-input" @change="applyToAll = !applyToAll" />
            <span class="eem__check-box" :class="{ 'eem__check-box--on': applyToAll }">
              <svg v-if="applyToAll" width="12" height="12" viewBox="0 0 24 24" fill="none">
                <path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </span>
            <span class="eem__check-label">
              Apply this update to all other splits linked to this collaborator email
              <span class="eem__check-count">({{ otherTracks.length }} other {{ otherTracks.length === 1 ? 'track' : 'tracks' }})</span>
            </span>
          </label>
        </div>

        <div class="eem__foot">
          <div class="eem__foot-row">
            <button class="eem__btn-cancel" @click="$emit('close')">Cancel</button>
            <button class="eem__btn-confirm" :disabled="!canConfirm" @click="handleConfirm">Update</button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { TrackSplit } from '../../types'

const props = defineProps<{
  collaboratorName: string
  collaboratorEmail: string
  currentEmail: string
  currentTrackId: string
  tracksWithCollaborator: TrackSplit[]
}>()

const emit = defineEmits<{
  close: []
  confirm: [newEmail: string, selectedTrackIds: string[]]
}>()

const newEmail = ref('')
const applyToAll = ref(false)

// Other tracks (besides the one the edit was launched from) that share this email
const otherTracks = computed(() =>
  props.tracksWithCollaborator.filter(t => t.trackId !== props.currentTrackId)
)

// Email validation
const emailError = computed(() => {
  const value = newEmail.value.trim()
  if (!value) return null
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(value)) {
    return 'Please enter a valid email address'
  }
  if (value.toLowerCase() === props.currentEmail.toLowerCase()) {
    return 'New email is the same as current email'
  }
  return null
})

const canConfirm = computed(() =>
  newEmail.value.trim() !== '' && !emailError.value
)

const handleConfirm = () => {
  if (!canConfirm.value) return
  // Always update the originating track; include the rest only if the user opted in.
  const selectedTrackIds = applyToAll.value
    ? props.tracksWithCollaborator.map(t => t.trackId)
    : [props.currentTrackId]
  emit('confirm', newEmail.value.trim(), selectedTrackIds)
}
</script>

<style lang="scss" scoped>
.eem-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 1rem;
}

.eem {
  background: #fff;
  border-radius: $radius-card;
  width: 100%;
  max-width: 95vw;
  max-height: 90vh;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;

  @include sm { width: 460px; }

  &__head {
    padding: 1.25rem 1.25rem 0;
    flex-shrink: 0;
    @include sm { padding: 1.5rem 1.5rem 0; }
  }

  &__head-row {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1rem;
    margin-bottom: 0.5rem;
  }

  &__title {
    font-size: $text-h4;
    font-weight: 900;
    color: var(--blue);
    font-family: $font-satoshi;
    letter-spacing: -0.03em;
    @include sm { font-size: $text-h3; }
  }

  &__close {
    flex-shrink: 0;
    margin: -0.25rem -0.25rem 0 0;
    padding: 0.25rem;
    color: var(--ditto-grey);
    transition: color 0.15s;
    cursor: pointer;

    &:hover { color: var(--blue); }
  }

  &__desc {
    font-size: $text-sm;
    color: var(--ditto-grey);
    font-family: $font-satoshi;
    line-height: 1.5;
  }

  &__body {
    flex: 1;
    overflow-y: auto;
    padding: 1.25rem;
    min-height: 0;
    @include sm { padding: 1.5rem; }
  }

  &__field {
    margin-bottom: 1.25rem;
  }

  &__label {
    display: block;
    font-size: $text-xs;
    color: var(--ditto-grey);
    margin-bottom: 0.25rem;
    font-family: $font-satoshi;
  }

  &__current {
    font-size: $text-sm;
    color: var(--blue);
    font-family: $font-satoshi;
    font-weight: 500;
  }

  &__input {
    width: 100%;
    font-size: $text-sm;
    color: var(--blue);
    font-family: $font-satoshi;
    border-bottom: 1px solid var(--faded-grey);
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
    background: transparent;

    &:focus {
      border-color: var(--brand-secondary);
      outline: none;
    }
  }

  &__error {
    font-size: $text-xs;
    color: var(--error);
    font-family: $font-satoshi;
    margin-top: 0.25rem;
  }

  /* Apply-to-all checkbox */
  &__check {
    display: flex;
    align-items: flex-start;
    gap: 0.625rem;
    cursor: pointer;
  }

  &__check-input {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
  }

  &__check-box {
    flex-shrink: 0;
    margin-top: 0.0625rem;
    width: 1.25rem;
    height: 1.25rem;
    border-radius: 0.375rem;
    border: 2px solid var(--faded-grey);
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    transition: background 0.15s, border-color 0.15s;

    &--on {
      background: var(--brand-secondary);
      border-color: var(--brand-secondary);
    }
  }

  &__check-label {
    font-size: $text-sm;
    color: var(--blue);
    font-family: $font-satoshi;
    line-height: 1.4;
  }

  &__check-count {
    color: var(--ditto-grey);
  }

  &__foot {
    padding: 0.75rem 1.25rem 1.25rem;
    flex-shrink: 0;
    background: #fff;
    border-radius: 0 0 $radius-card $radius-card;
    @include sm { padding: 0.75rem 1.5rem 1.5rem; }
  }

  &__foot-row {
    display: flex;
    flex-direction: column-reverse;
    justify-content: flex-end;
    gap: 0.5rem;
    @include sm { flex-direction: row; gap: 0.75rem; }
  }

  &__btn-cancel {
    padding: 0.625rem 1.5rem;
    border: 1px solid var(--faded-grey);
    border-radius: $radius-button;
    font-size: $text-sm;
    font-weight: 600;
    color: var(--ditto-grey);
    font-family: $font-satoshi;
    transition: border-color 0.15s, color 0.15s;
    cursor: pointer;
    &:hover { border-color: var(--blue); color: var(--blue); }
  }

  &__btn-confirm {
    padding: 0.625rem 1.5rem;
    background: var(--blue);
    color: #fff;
    border-radius: $radius-button;
    font-size: $text-sm;
    font-weight: 600;
    font-family: $font-satoshi;
    transition: background 0.15s;
    cursor: pointer;
    &:hover { background: rgba($color-text-fill, 0.9); }
    &:disabled { opacity: 0.5; cursor: not-allowed; }
  }
}
</style>
