<template>
  <Teleport to="body">
    <div class="eem-overlay" @click="$emit('close')">
      <div class="eem" @click.stop>
        <div class="eem__head">
          <h2 class="eem__title">Edit Email</h2>
          <p class="eem__desc">Update the email for <strong class="eem__strong">{{ collaboratorName }}</strong></p>

          <div class="eem__field">
            <label class="eem__label">New email address</label>
            <input v-model="newEmail" type="email" :placeholder="currentEmail" class="eem__input" @keydown.enter="handleConfirm" />
            <p v-if="emailError" class="eem__error">{{ emailError }}</p>
          </div>

          <div class="eem__sel-header">
            <p class="eem__sel-label">Update on these tracks:</p>
            <button @click="toggleSelectAll" class="eem__sel-toggle">{{ allSelected ? 'Deselect all' : 'Select all' }}</button>
          </div>
        </div>

        <div class="eem__body">
          <div class="eem__chips">
            <button
              v-for="track in tracksWithCollaborator"
              :key="track.trackId"
              @click="toggleTrack(track.trackId)"
              class="eem__chip" :class="{ 'eem__chip--sel': selectedTracks.has(track.trackId) }"
            >
              <svg v-if="selectedTracks.has(track.trackId)" width="12" height="12" viewBox="0 0 24 24" fill="none" class="eem__chip-check">
                <path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              <span class="eem__chip-num">{{ track.trackNumber }}.</span>
              <span class="eem__chip-name">{{ track.trackName }}</span>
            </button>
          </div>
        </div>

        <div class="eem__foot">
          <div class="eem__foot-row">
            <button @click="$emit('close')" class="eem__btn-cancel">Cancel</button>
            <button @click="handleConfirm" :disabled="!canConfirm" class="eem__btn-confirm">Update Email</button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { TrackSplit } from '../../types'

const props = defineProps<{
  collaboratorName: string
  collaboratorEmail: string
  currentEmail: string
  tracksWithCollaborator: TrackSplit[]
}>()

const emit = defineEmits<{
  close: []
  confirm: [newEmail: string, selectedTrackIds: string[]]
}>()

const newEmail = ref('')
const selectedTracks = ref<Set<string>>(new Set())

// Pre-select all tracks on mount
onMounted(() => {
  props.tracksWithCollaborator.forEach(t => selectedTracks.value.add(t.trackId))
})

const toggleTrack = (trackId: string) => {
  if (selectedTracks.value.has(trackId)) {
    selectedTracks.value.delete(trackId)
  } else {
    selectedTracks.value.add(trackId)
  }
  // Force reactivity
  selectedTracks.value = new Set(selectedTracks.value)
}

const allSelected = computed(() => 
  selectedTracks.value.size === props.tracksWithCollaborator.length
)

const toggleSelectAll = () => {
  if (allSelected.value) {
    selectedTracks.value = new Set()
  } else {
    selectedTracks.value = new Set(props.tracksWithCollaborator.map(t => t.trackId))
  }
}

// Email validation
const emailError = computed(() => {
  if (!newEmail.value.trim()) return null
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(newEmail.value.trim())) {
    return 'Please enter a valid email address'
  }
  if (newEmail.value.toLowerCase().trim() === props.currentEmail.toLowerCase()) {
    return 'New email is the same as current email'
  }
  return null
})

const canConfirm = computed(() => 
  newEmail.value.trim() !== '' && 
  !emailError.value && 
  selectedTracks.value.size > 0
)

const handleConfirm = () => {
  if (canConfirm.value) {
    emit('confirm', newEmail.value.trim(), Array.from(selectedTracks.value))
  }
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
}

.eem {
  background: #fff;
  border-radius: $radius-card;
  width: 100%;
  max-width: 95vw;
  max-height: 90vh;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  margin: 0 0.5rem;
  display: flex;
  flex-direction: column;

  @include sm { width: 480px; margin: 0; }

  &__head {
    padding: 1rem;
    padding-bottom: 0;
    flex-shrink: 0;
    @include sm { padding: 1.5rem; padding-bottom: 0; }
  }

  &__title {
    font-size: $text-h4;
    font-weight: 700;
    color: var(--blue);
    font-family: $font-poppins;
    margin-bottom: 0.5rem;
    @include sm { font-size: $text-h3; }
  }

  &__desc {
    font-size: $text-sm;
    color: var(--ditto-grey);
    font-family: $font-satoshi;
    margin-bottom: 1rem;
  }

  &__strong { color: var(--blue); }

  &__field { margin-bottom: 1rem; }

  &__label {
    display: block;
    font-size: $text-xs;
    color: var(--ditto-grey);
    margin-bottom: 0.25rem;
    font-family: $font-satoshi;
  }

  &__input {
    width: 100%;
    padding: 0.625rem 1rem;
    border: 1px solid var(--faded-grey);
    border-radius: $radius-card;
    font-size: $text-sm;
    color: var(--blue);
    font-family: $font-satoshi;

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

  &__sel-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.75rem;
  }

  &__sel-label {
    font-size: $text-sm;
    font-weight: 600;
    color: var(--blue);
    font-family: $font-satoshi;
  }

  &__sel-toggle {
    font-size: $text-xs;
    font-weight: 500;
    color: var(--brand-secondary);
    font-family: $font-satoshi;
    &:hover { text-decoration: underline; }
  }

  &__body {
    flex: 1;
    overflow-y: auto;
    padding: 0 1rem;
    min-height: 0;
    @include sm { padding: 0 1.5rem; }
  }

  &__chips {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    padding-bottom: 1rem;
  }

  &__chip {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.375rem 0.75rem;
    border-radius: $radius-lg;
    font-size: $text-sm;
    font-weight: 500;
    font-family: $font-satoshi;
    cursor: pointer;
    transition: all 0.15s;
    border: 1px solid var(--faded-grey);
    background: var(--light-grey);
    color: var(--ditto-grey);

    &:hover { border-color: rgba($color-brand-secondary, 0.5); }

    &--sel {
      border-color: var(--brand-secondary);
      background: rgba($color-brand-secondary, 0.1);
      color: var(--brand-secondary);
    }
  }

  &__chip-check { flex-shrink: 0; }
  &__chip-num { font-size: $text-xs; opacity: 0.6; }
  &__chip-name {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 140px;
    @include sm { max-width: 180px; }
  }

  &__foot {
    padding: 0.75rem 1rem 1rem;
    border-top: 1px solid var(--faded-grey);
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
    &:hover { background: rgba($color-text-fill, 0.9); }
    &:disabled { opacity: 0.5; cursor: not-allowed; }
  }
}
</style>
