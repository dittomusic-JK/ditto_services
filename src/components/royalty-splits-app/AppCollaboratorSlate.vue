<template>
  <div class="acs">
    <!-- Slate title -->
    <div class="acs__titlebar">
      <button class="acs__back" @click="$emit('cancel')" aria-label="Back">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15,18 9,12 15,6"/></svg>
      </button>
      <h2 class="acs__title">{{ title }}</h2>
    </div>

    <!-- Fields -->
    <div class="acs__fields">
      <div class="acs__field acs__field--rel">
        <label class="acs__label">Name</label>
        <div class="acs__control">
          <input
            v-if="!nameLocked"
            v-model="localName"
            type="text"
            placeholder="Collaborator name"
            class="acs__input"
            @input="showSuggestions = true"
            @focus="showSuggestions = true"
            @blur="hideSuggestionsDelayed"
          />
          <span v-else class="acs__value">{{ localName }}</span>
          <svg v-if="nameLocked" class="acs__lock" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a5 5 0 0 0-5 5v3H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-1V7a5 5 0 0 0-5-5zm-3 8V7a3 3 0 0 1 6 0v3H9z"/></svg>
        </div>

        <!-- Saved collaborator suggestions (web autocomplete parity) -->
        <div v-if="!nameLocked && showSuggestions && filteredCollaborators.length > 0" class="acs__suggestions">
          <p class="acs__suggestions-label">Saved collaborators</p>
          <button
            v-for="collab in filteredCollaborators"
            :key="collab.email"
            type="button"
            class="acs__suggestion"
            @mousedown.prevent="selectCollaborator(collab)"
          >
            <span class="acs__suggestion-avatar">{{ collab.name.slice(0, 1).toUpperCase() }}</span>
            <span class="acs__suggestion-body">
              <span class="acs__suggestion-name">{{ collab.name }}</span>
              <span class="acs__suggestion-email">{{ collab.email }}</span>
            </span>
          </button>
        </div>
      </div>

      <div class="acs__field">
        <label class="acs__label">Email</label>
        <div class="acs__control">
          <input v-if="!emailLocked" v-model="localEmail" type="email" placeholder="We'll contact them here" class="acs__input" />
          <span v-else class="acs__value">{{ localEmail }}</span>
          <svg v-if="emailLocked" class="acs__lock" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a5 5 0 0 0-5 5v3H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-1V7a5 5 0 0 0-5-5zm-3 8V7a3 3 0 0 1 6 0v3H9z"/></svg>
        </div>
        <p v-if="emailError" class="acs__error">{{ emailError }}</p>
      </div>

      <div v-if="!shareHidden" class="acs__field">
        <label class="acs__label">Share</label>
        <div class="acs__control">
          <input v-model.number="localShare" type="number" min="0" max="100" class="acs__input acs__input--share" />
          <span class="acs__suffix">%</span>
        </div>
        <p v-if="shareError" class="acs__error">{{ shareError }}</p>
      </div>
      <button v-if="otherTracksCount > 0" class="acs__apply" @click="applyToAll = !applyToAll">
        <span class="acs__check" :class="{ 'acs__check--on': applyToAll }">
          <svg v-if="applyToAll" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20,6 9,17 4,12"/></svg>
        </span>
        <span class="acs__apply-label">Apply this update to all other splits linked to this collaborator email <span class="acs__apply-count">({{ otherTracksCount }} other {{ otherTracksCount === 1 ? 'track' : 'tracks' }})</span></span>
      </button>
    </div>

    <!-- Actions -->
    <div class="acs__actions">
      <button class="acs__btn acs__btn--cancel" @click="$emit('cancel')">Cancel</button>
      <button class="acs__btn acs__btn--confirm" :disabled="!isValid" @click="confirm">{{ confirmLabel }}</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const props = withDefaults(defineProps<{
  title: string
  confirmLabel: string
  name?: string
  email?: string
  share?: number
  nameLocked?: boolean
  emailLocked?: boolean
  shareHidden?: boolean
  /** Share already allocated to others (for the 100% cap) */
  otherShare?: number
  /** For edit-email: the current email that must change */
  requireEmailChange?: boolean
  /** For edit-email: other tracks sharing this email (enables apply-to-all) */
  otherTracksCount?: number
  /** Saved collaborators for name autocomplete (add mode) */
  knownCollaborators?: { name: string; email: string }[]
}>(), {
  name: '',
  email: '',
  share: 0,
  nameLocked: false,
  emailLocked: false,
  shareHidden: false,
  otherShare: 0,
  requireEmailChange: false,
  otherTracksCount: 0,
  knownCollaborators: () => [],
})

const emit = defineEmits<{
  cancel: []
  confirm: [payload: { name: string; email: string; share: number; applyToAll: boolean }]
}>()

const localName = ref(props.name)
const localEmail = ref(props.email)
const localShare = ref(props.share)
const applyToAll = ref(false)
const showSuggestions = ref(false)

const filteredCollaborators = computed(() => {
  const q = localName.value.trim().toLowerCase()
  if (!q) return props.knownCollaborators.slice(0, 5)
  return props.knownCollaborators
    .filter(c => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q))
    .slice(0, 5)
})

const selectCollaborator = (collab: { name: string; email: string }) => {
  localName.value = collab.name
  localEmail.value = collab.email
  showSuggestions.value = false
}

const hideSuggestionsDelayed = () => {
  setTimeout(() => { showSuggestions.value = false }, 150)
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const emailError = computed(() => {
  const v = localEmail.value.trim()
  if (!v) return ''
  if (!EMAIL_RE.test(v)) return 'Please enter a valid email address'
  if (props.requireEmailChange && v.toLowerCase() === props.email.toLowerCase()) return 'This is already the current email'
  return ''
})

const shareError = computed(() => {
  if (props.shareHidden) return ''
  if ((localShare.value || 0) + props.otherShare > 100) return 'Total splits cannot exceed 100%'
  return ''
})

const isValid = computed(() => {
  if (!localName.value.trim()) return false
  const v = localEmail.value.trim()
  if (!v || !EMAIL_RE.test(v)) return false
  if (props.requireEmailChange && v.toLowerCase() === props.email.toLowerCase()) return false
  if (!props.shareHidden && ((localShare.value || 0) <= 0 || shareError.value)) return false
  return true
})

const confirm = () => {
  if (!isValid.value) return
  emit('confirm', { name: localName.value.trim(), email: localEmail.value.trim(), share: localShare.value || 0, applyToAll: applyToAll.value })
}
</script>

<style lang="scss" scoped>
.acs {
  &__titlebar {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem 1.25rem;
  }

  &__back {
    display: inline-flex;
    color: var(--blue);
    cursor: pointer;
    padding: 0.125rem;
  }

  &__title {
    font-size: $text-h4;
    font-weight: 700;
    color: var(--blue);
    font-family: $font-satoshi;
    letter-spacing: -0.03em;
  }

  &__fields {
    border-top: 1px solid var(--faded-grey);
  }

  &__field {
    padding: 0.75rem 1.25rem;
    border-bottom: 1px solid var(--faded-grey);
  }

  &__label {
    display: block;
    font-size: 11px;
    color: var(--ditto-grey);
    font-family: $font-satoshi;
    margin-bottom: 0.25rem;
  }

  &__control {
    display: flex;
    align-items: center;
    gap: 0.375rem;
  }

  &__input {
    flex: 1;
    font-size: $text-body;
    color: var(--blue);
    font-family: $font-satoshi;
    background: transparent;
    border: none;
    padding: 0;

    &:focus { outline: none; }
    &--share { flex: 0 0 3.5rem; }
  }

  &__value {
    flex: 1;
    font-size: $text-body;
    color: var(--blue);
    font-family: $font-satoshi;
  }

  &__suffix {
    font-size: $text-body;
    color: var(--blue);
    font-family: $font-satoshi;
  }

  &__lock {
    color: var(--blue);
    flex-shrink: 0;
  }

  &__field--rel { position: relative; }

  &__suggestions {
    position: absolute;
    left: 1.25rem;
    right: 1.25rem;
    top: 100%;
    margin-top: 0.25rem;
    background: #fff;
    border: 1px solid var(--faded-grey);
    border-radius: 0.75rem;
    box-shadow: 0 12px 32px rgba(16, 31, 60, 0.14);
    padding: 0.375rem 0;
    z-index: 30;
    max-height: 14rem;
    overflow-y: auto;
  }

  &__suggestions-label {
    padding: 0.375rem 0.875rem 0.25rem;
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: var(--ditto-grey);
    font-family: $font-satoshi;
  }

  &__suggestion {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 0.625rem;
    text-align: left;
    padding: 0.5rem 0.875rem;
    cursor: pointer;

    &:hover, &:active { background: var(--lighter-grey); }
  }

  &__suggestion-avatar {
    width: 1.75rem;
    height: 1.75rem;
    border-radius: 9999px;
    background: var(--light-grey);
    color: $color-brand-primary;
    font-size: $text-xs;
    font-weight: 700;
    font-family: $font-satoshi;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  &__suggestion-body { min-width: 0; }

  &__suggestion-name {
    display: block;
    font-size: $text-sm;
    font-weight: 500;
    color: var(--blue);
    font-family: $font-satoshi;
  }

  &__suggestion-email {
    display: block;
    font-size: $text-xs;
    color: var(--ditto-grey);
    font-family: $font-satoshi;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__error {
    font-size: $text-xs;
    color: var(--error);
    font-family: $font-satoshi;
    margin-top: 0.375rem;
  }

  &__apply {
    display: flex;
    align-items: flex-start;
    gap: 0.625rem;
    text-align: left;
    padding: 1rem 1.25rem 0;
    cursor: pointer;
  }

  &__check {
    width: 1.125rem;
    height: 1.125rem;
    border-radius: 0.3125rem;
    border: 2px solid var(--faded-grey);
    background: #fff;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    margin-top: 0.0625rem;
    transition: background 0.15s, border-color 0.15s;

    &--on {
      background: $color-brand-primary;
      border-color: $color-brand-primary;
    }
  }

  &__apply-label {
    font-size: $text-xs;
    color: var(--blue);
    font-family: $font-satoshi;
    line-height: 1.5;
  }

  &__apply-count { color: var(--ditto-grey); }

  &__actions {
    display: flex;
    gap: 0.75rem;
    padding: 1.5rem 1.25rem;
  }

  &__btn {
    flex: 1;
    padding: 0.875rem 1rem;
    border-radius: 9999px;
    font-size: $text-sm;
    font-weight: 500;
    font-family: $font-satoshi;
    cursor: pointer;
    transition: opacity 0.15s;

    &--cancel {
      background: var(--light-grey);
      color: var(--blue);
    }

    &--confirm {
      background: $color-brand-primary;
      color: #fff;

      &:hover { opacity: 0.92; }
      &:disabled { opacity: 0.4; cursor: not-allowed; }
    }
  }
}
</style>
