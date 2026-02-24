<template>
  <!-- Desktop layout -->
  <div
    class="sr"
    :class="{ 'sr--deleted': isDeleted }"
    @focusout="handleRowFocusOut"
  >
    <!-- Name field with autocomplete -->
    <div class="sr__col--rel">
      <label class="sr__label">Name:</label>
      <input
        v-if="isEditable"
        ref="nameInputRef"
        v-model="localName"
        type="text"
        placeholder="Enter name"
        class="sr__input"
        @input="handleNameInput"
        @focus="showAutocomplete = filteredCollaborators.length > 0"
        @blur="hideAutocompleteDelayed"
        @keydown.down.prevent="navigateAutocomplete(1)"
        @keydown.up.prevent="navigateAutocomplete(-1)"
        @keydown.enter.prevent="selectHighlighted"
        @keydown.escape="showAutocomplete = false"
      />
      <span v-else class="sr__val" :class="{ 'sr__val--struck': isDeleted }">{{ name }}</span>

      <!-- Autocomplete dropdown -->
      <div
        v-if="isEditable && showAutocomplete && filteredCollaborators.length > 0"
        class="sr__dropdown" :class="{ 'sr__dropdown--rls': isRLS }"
      >
        <button
          v-for="(collab, index) in filteredCollaborators"
          :key="collab.email"
          type="button"
          class="sr__dd-item"
          :class="[index === highlightedIndex ? 'sr__dd-item--hl' : '', isRLS ? 'sr__dd-item--rls' : '']"
          @mousedown.prevent="selectCollaborator(collab)"
        >
          <span class="sr__dd-name">{{ collab.name }}</span>
          <span class="sr__dd-email" :class="{ 'sr__dd-email--rls': isRLS }">{{ collab.email }}</span>
        </button>
      </div>
    </div>

    <!-- Email field -->
    <div>
      <label class="sr__label">Email*</label>
      <input
        v-if="isEditable"
        v-model="localEmail"
        type="email"
        placeholder="We'll contact them here"
        class="sr__input"
        @input="emitUpdate"
      />
      <div v-else class="sr__email-ro">
        <span class="sr__val" :class="{ 'sr__val--struck': isDeleted }">{{ email }}</span>
        <!-- Unregistered indicator -->
        <div v-if="!isRLS && hasAccount === false" class="sr__unreg-wrap">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" class="sr__unreg-icon">
            <circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.5"/>
            <path d="M8 5V8.5M8 10.5V10.51" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
          <div class="sr__tooltip sr__tooltip--narrow">
            Not registered yet. They'll need to create a Ditto account to approve.
            <div class="sr__tooltip-arrow" />
          </div>
        </div>
      </div>
    </div>

    <!-- Split value -->
    <div class="sr__share">
      <label class="sr__label sr__label--nowrap">{{ shareLabel }}</label>
      <div class="sr__share-row">
        <input
          v-if="isEditable || isEditingShare"
          ref="shareInputRef"
          v-model.number="localShare"
          type="number"
          min="0" max="100"
          placeholder="0%"
          class="sr__share-input"
          :class="{ 'sr__share-input--error': shareExceeds100 }"
          @input="isEditable ? emitUpdate() : null"
          @keydown.enter="isEditingShare ? applyShareEdit() : null"
          @keydown.escape="cancelShareEdit"
        />
        <span v-else class="sr__val" :class="{ 'sr__val--error-struck': status === 'rejected' || isDeleted }">{{ share }}</span>
        <span class="sr__pct" :class="{ 'sr__pct--error': shareExceeds100 || status === 'rejected' || isDeleted }" :style="status === 'rejected' || isDeleted ? 'text-decoration: line-through' : ''">%</span>
      </div>
      <p v-if="(isEditable || isEditingShare) && shareExceeds100" class="sr__exceed">Exceeds 100%</p>
      <div v-if="isEditingShare" class="sr__share-actions">
        <button @click="applyShareEdit" :disabled="shareExceeds100 || localShare === share" class="sr__share-apply">Apply</button>
        <button @click="cancelShareEdit" class="sr__share-cancel">Cancel</button>
      </div>
    </div>

    <!-- Status indicator -->
    <div class="sr__status">
      <template v-if="status && !isEditable && !isEditingShare">
        <template v-if="hasPendingChange && !isRLS">
          <div class="sr__pend-change">
            <span class="sr__pend-from">{{ originalShare }}%</span>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" class="sr__pend-arrow">
              <path d="M4 6H8M8 6L6 4M8 6L6 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span class="sr__pend-to">{{ share }}%</span>
          </div>
          <div class="sr__pend-badge">
            <div class="sr__dot sr__dot--pending" />
            <span class="sr__pend-label">Pending</span>
          </div>
        </template>
        <template v-else>
          <div class="sr__dot sr__dot--lg" :class="statusDotClass" />
          <span class="sr__status-text" :class="{ 'sr__status-text--error': status === 'rejected', 'sr__status-text--rls': isRLS && status !== 'rejected' }">
            {{ displayStatusText }}
          </span>
        </template>
        <!-- Tooltip -->
        <div v-if="statusTooltip" class="sr__tooltip" :class="{ 'sr__tooltip--rls': isRLS }">
          {{ statusTooltip }}
          <div class="sr__tooltip-arrow" :class="{ 'sr__tooltip-arrow--rls': isRLS }" />
        </div>
      </template>
    </div>

    <!-- Action buttons -->
    <div class="sr__actions">
      <div v-if="!isEditable && !isEditingShare && !isDeleted && (status === 'active' || status === 'pending' || (isRLS && status === 'unclaimed'))" class="sr__act-wrap">
        <button @click="isNew ? $emit('re-edit') : startShareEdit()" class="sr__icon-btn" :class="{ 'sr__icon-btn--rls': isRLS }">
          <EditIcon />
        </button>
        <div class="sr__mini-tip" :class="{ 'sr__mini-tip--rls': isRLS }">Edit split</div>
      </div>

      <div v-if="!isEditable && !isEditingShare && status === 'pending' && !isRLS" class="sr__act-wrap">
        <button @click="$emit('resend')" class="sr__icon-btn"><SendIcon /></button>
        <div class="sr__mini-tip">Resend confirmation email</div>
      </div>

      <div class="sr__act-wrap">
        <button @click="$emit('remove')" class="sr__icon-btn sr__icon-btn--delete"><TrashIcon /></button>
        <div class="sr__mini-tip" :class="{ 'sr__mini-tip--rls': isRLS }">Remove split</div>
      </div>
    </div>
  </div>

  <!-- Mobile layout -->
  <div class="sr-m" @focusout="handleRowFocusOut">
    <div class="sr-m__top">
      <div class="sr-m__name">
        <label class="sr__label">Name:</label>
        <input
          v-if="isEditable"
          v-model="localName"
          type="text"
          placeholder="Name"
          class="sr__input"
          @input="handleNameInput"
          @focus="showAutocomplete = filteredCollaborators.length > 0"
          @blur="hideAutocompleteDelayed"
        />
        <span v-else class="sr__val">{{ name }}</span>

        <div
          v-if="isEditable && showAutocomplete && filteredCollaborators.length > 0"
          class="sr__dropdown sr__dropdown--short" :class="{ 'sr__dropdown--rls': isRLS }"
        >
          <button
            v-for="collab in filteredCollaborators"
            :key="collab.email"
            type="button"
            class="sr__dd-item" :class="{ 'sr__dd-item--rls': isRLS }"
            @mousedown.prevent="selectCollaborator(collab)"
          >
            <span class="sr__dd-name">{{ collab.name }}</span>
          </button>
        </div>
      </div>
      <div class="sr-m__share-col">
        <label class="sr__label">{{ shareLabel }}</label>
        <div class="sr-m__share-row">
          <input
            v-if="isEditable"
            v-model.number="localShare"
            type="number"
            min="0" max="100"
            placeholder="0"
            class="sr__share-input sr__share-input--mob"
            :class="{ 'sr__share-input--error': shareExceeds100 }"
            @input="emitUpdate"
          />
          <span v-else class="sr__val">{{ share }}</span>
          <span class="sr__pct" :class="{ 'sr__pct--error': shareExceeds100 }">%</span>
        </div>
        <p v-if="isEditable && shareExceeds100" class="sr__exceed">Exceeds 100%</p>
      </div>
    </div>

    <div>
      <label class="sr__label">Email*</label>
      <input
        v-if="isEditable"
        v-model="localEmail"
        type="email"
        placeholder="Email address"
        class="sr__input"
        @input="emitUpdate"
      />
      <span v-else class="sr__val">{{ email }}</span>
    </div>

    <div v-if="!isEditable" class="sr-m__footer">
      <div v-if="status" class="sr-m__status">
        <div class="sr__dot" :class="statusDotClass" />
        <span class="sr-m__status-text">{{ mobileStatusText }}</span>
      </div>
      <div v-else />

      <div class="sr-m__btns">
        <button v-if="status === 'active' || status === 'rejected'" @click="$emit('edit-share')" class="sr__icon-btn"><EditIcon /></button>
        <button v-if="status === 'pending'" @click="$emit('resend')" class="sr__icon-btn"><SendIcon /></button>
        <button @click="$emit('remove')" class="sr__icon-btn sr__icon-btn--delete"><TrashIcon /></button>
      </div>
    </div>

    <div v-else class="sr-m__footer sr-m__footer--end">
      <button @click="$emit('remove')" class="sr__icon-btn sr__icon-btn--delete"><TrashIcon /></button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import type { SplitStatus } from '../../types'
import { EditIcon, TrashIcon, SendIcon } from './icons'

export interface KnownCollaborator {
  name: string
  email: string
}

const props = withDefaults(defineProps<{
  splitId?: string
  name: string
  email: string
  share: number
  status?: SplitStatus
  activeSince?: string
  shareIndex?: number
  isEditable?: boolean
  isNew?: boolean // Is this a new split not yet saved
  isDeleted?: boolean // Is this split marked for deletion
  canEditEmail?: boolean
  knownCollaborators?: KnownCollaborator[]
  currentTotalShare?: number // Total share already allocated (excluding this row)
  originalShare?: number // The share value before editing (for showing pending changes)
  isRLS?: boolean
  hasAccount?: boolean // Whether the collaborator has a Ditto account
}>(), {
  isEditable: false,
  isNew: false,
  isDeleted: false,
  canEditEmail: false,
  knownCollaborators: () => [],
  currentTotalShare: 0,
  isRLS: false
})

const emit = defineEmits<{
  update: [{ name: string; email: string; share: number }]
  remove: []
  resend: []
  commit: []
  're-edit': []
}>()

const nameInputRef = ref<HTMLInputElement | null>(null)
const shareInputRef = ref<HTMLInputElement | null>(null)
const localName = ref(props.name)
const localEmail = ref(props.email)
const localShare = ref(props.share)
const showAutocomplete = ref(false)
const highlightedIndex = ref(-1)
const isEditingShare = ref(false)
const commitGuard = ref(false) // Prevents immediate re-commit after re-edit

watch(() => props.name, (val) => { localName.value = val })
watch(() => props.email, (val) => { localEmail.value = val })
watch(() => props.share, (val) => { localShare.value = val })

// When row switches back to editable (re-edit), set a brief guard to prevent immediate re-commit
watch(() => props.isEditable, (newVal, oldVal) => {
  if (newVal && !oldVal && props.isNew) {
    commitGuard.value = true
    setTimeout(() => { commitGuard.value = false }, 300)
  }
})

// Inline validation: check if share exceeds 100%
const shareExceeds100 = computed(() => {
  return props.currentTotalShare + (localShare.value || 0) > 100
})

// Check if there's a pending change (originalShare differs from current share)
const hasPendingChange = computed(() => {
  return props.originalShare !== undefined && 
         props.originalShare !== props.share &&
         props.status === 'pending'
})

// Filter collaborators based on input
const filteredCollaborators = computed(() => {
  if (!localName.value.trim()) return props.knownCollaborators.slice(0, 5)
  const search = localName.value.toLowerCase()
  return props.knownCollaborators
    .filter(c => c.name.toLowerCase().includes(search) || c.email.toLowerCase().includes(search))
    .slice(0, 5)
})

const handleNameInput = () => {
  showAutocomplete.value = filteredCollaborators.value.length > 0
  highlightedIndex.value = -1
  emitUpdate()
}

const selectCollaborator = (collab: KnownCollaborator) => {
  localName.value = collab.name
  localEmail.value = collab.email
  showAutocomplete.value = false
  highlightedIndex.value = -1
  emitUpdate()
}

const navigateAutocomplete = (direction: number) => {
  if (!showAutocomplete.value) return
  const max = filteredCollaborators.value.length - 1
  highlightedIndex.value = Math.max(-1, Math.min(max, highlightedIndex.value + direction))
}

const selectHighlighted = () => {
  if (highlightedIndex.value >= 0 && highlightedIndex.value < filteredCollaborators.value.length) {
    selectCollaborator(filteredCollaborators.value[highlightedIndex.value])
  }
}

const hideAutocompleteDelayed = () => {
  setTimeout(() => { showAutocomplete.value = false }, 150)
}

// Handle focus leaving the entire row — commit new splits with valid data
const handleRowFocusOut = (e: FocusEvent) => {
  if (!props.isEditable || !props.isNew) return
  if (commitGuard.value) return
  // Check if the new focus target is still within the same row
  const row = (e.currentTarget as HTMLElement)
  const relatedTarget = e.relatedTarget as HTMLElement | null
  if (relatedTarget && row.contains(relatedTarget)) return
  // Delay slightly to allow autocomplete mousedown to fire first
  setTimeout(() => {
    if (localName.value.trim() && localEmail.value.trim() && (localShare.value || 0) > 0) {
      emitUpdate()
      emit('commit')
    }
  }, 200)
}

// Inline share editing for saved splits
const startShareEdit = () => {
  localShare.value = props.share
  isEditingShare.value = true
  nextTick(() => {
    shareInputRef.value?.focus()
    shareInputRef.value?.select()
  })
}

const applyShareEdit = () => {
  if (!shareExceeds100.value && localShare.value !== props.share) {
    // Emit update to mark this split as edited
    emitUpdate()
  }
  isEditingShare.value = false
}

const cancelShareEdit = () => {
  localShare.value = props.share
  isEditingShare.value = false
}
const shareLabel = computed(() => {
  if (props.shareIndex !== undefined) {
    return `Split #${props.shareIndex}`
  }
  return 'Split'
})

const statusDotClass = computed(() => {
  if (props.isRLS && props.status === 'pending') return 'sr__dot--active'
  switch (props.status) {
    case 'active': return 'sr__dot--active'
    case 'pending': return 'sr__dot--pending'
    case 'rejected': return 'sr__dot--rejected'
    case 'unclaimed': return props.isRLS ? 'sr__dot--unclaimed-rls' : 'sr__dot--unclaimed'
    default: return 'sr__dot--default'
  }
})

// Format date like "10th March 2025" to "Mar '25"
const formatShortDate = (dateStr: string): string => {
  const months: Record<string, string> = {
    'January': 'Jan', 'February': 'Feb', 'March': 'Mar', 'April': 'Apr',
    'May': 'May', 'June': 'Jun', 'July': 'Jul', 'August': 'Aug',
    'September': 'Sep', 'October': 'Oct', 'November': 'Nov', 'December': 'Dec'
  }
  for (const [full, short] of Object.entries(months)) {
    if (dateStr.includes(full)) {
      const year = dateStr.match(/\d{4}/)?.[0]?.slice(-2) || ''
      return `${short} '${year}`
    }
  }
  return dateStr
}

const statusText = computed(() => {
  switch (props.status) {
    case 'active':
      return 'Active'
    case 'pending':
      return 'Pending'
    case 'rejected':
      return 'Rejected'
    case 'unclaimed':
      return 'Unclaimed'
    default:
      return ''
  }
})

// For RLS, don't show "Pending" - show "Active" instead (immediate splits)
const displayStatusText = computed(() => {
  if (props.isRLS && props.status === 'pending') {
    return 'Active'
  }
  return statusText.value
})

// Mobile shows full date inline since there's more room
const mobileStatusText = computed(() => {
  if (props.status === 'active' && props.activeSince) {
    return `Active since ${props.activeSince}`
  }
  return statusText.value
})

const statusTooltip = computed(() => {
  switch (props.status) {
    case 'active':
      return props.activeSince ? `Active since ${props.activeSince}` : ''
    case 'pending':
      return "The collaborator hasn't accepted their split via email yet."
    case 'rejected':
      return 'The collaborator declined this split offer. Edit to send a new offer.'
    case 'unclaimed':
      return 'This collaborator needs to log in or create a Ditto account to claim their split.'
    default:
      return ''
  }
})

const emitUpdate = () => {
  emit('update', {
    name: localName.value,
    email: localEmail.value,
    share: localShare.value
  })
}
</script>

<style lang="scss" scoped>
/* ========= Shared elements (used in both desktop & mobile) ========= */

.sr__label {
  display: block;
  font-size: $text-xs;
  color: var(--ditto-grey);
  margin-bottom: 0.25rem;
  font-family: $font-satoshi;

  &--nowrap { white-space: nowrap; }
}

.sr__input {
  width: 100%;
  font-size: $text-sm;
  color: var(--blue);
  font-family: $font-satoshi;
  border-bottom: 1px solid var(--faded-grey);
  padding-bottom: 0.25rem;
  background: transparent;

  &:focus {
    border-color: var(--brand-secondary);
    outline: none;
  }
}

.sr__val {
  font-size: $text-sm;
  color: var(--blue);
  font-family: $font-satoshi;

  &--struck { text-decoration: line-through; }
  &--error-struck {
    color: var(--error);
    text-decoration: line-through;
  }
}

.sr__pct {
  font-size: $text-sm;
  font-family: $font-satoshi;
  color: var(--ditto-grey);

  &--error { color: var(--error); }
}

/* Autocomplete dropdown */
.sr__dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 0.25rem;
  border: 1px solid var(--faded-grey);
  border-radius: $radius-lg;
  box-shadow: $shadow-card;
  padding: 0.25rem 0;
  z-index: 20;
  max-height: 10rem;
  overflow-y: auto;
  background: #fff;

  &--rls {
    background: var(--rls-bg-elevated);
    border-color: var(--rls-border);
  }

  &--short { max-height: 8rem; }
}

.sr__dd-item {
  width: 100%;
  padding: 0.5rem 0.75rem;
  text-align: left;
  font-size: $text-sm;
  font-family: $font-satoshi;
  transition: color 0.15s, background 0.15s;
  color: var(--blue);

  &:hover { background: var(--light-grey); }

  &--hl {
    background: rgba($color-brand-secondary, 0.1);
    color: var(--brand-secondary);
  }

  &--rls {
    color: var(--rls-text);
    &:hover { background: rgba(255, 255, 255, 0.05); }
  }
}

.sr__dd-name { font-weight: 500; }

.sr__dd-email {
  font-size: $text-xs;
  margin-left: 0.5rem;
  color: var(--ditto-grey);

  &--rls { color: var(--rls-text-secondary); }
}

/* Dot indicator */
.sr__dot {
  border-radius: 50%;
  width: 0.5rem;
  height: 0.5rem;

  &--lg { width: 0.625rem; height: 0.625rem; margin-bottom: 0.25rem; }
  &--active { background: var(--success); }
  &--pending { background: $color-amber-500; }
  &--rejected { background: var(--error); }
  &--unclaimed { background: $color-orange-500; }
  &--unclaimed-rls { background: var(--warning); }
  &--default { background: var(--ditto-grey); }
}

/* Tooltip (shared) */
@mixin sr-tip {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-bottom: 0.5rem;
  padding: 0.5rem 0.75rem;
  color: #fff;
  font-size: 10px;
  border-radius: $radius-lg;
  text-align: center;
  opacity: 0;
  transition: opacity 0.15s;
  pointer-events: none;
  z-index: 20;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  background: var(--blue);
}

.sr__tooltip {
  @include sr-tip;
  width: 12rem;

  &--narrow { width: 11rem; }
  &--rls {
    background: var(--rls-bg-elevated);
    border: 1px solid var(--rls-border);
  }
}

.sr__tooltip-arrow {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 4px solid transparent;
  border-top-color: var(--blue);

  &--rls { border-top-color: var(--rls-bg-elevated); }
}

.sr__mini-tip {
  @include sr-tip;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  white-space: nowrap;
  width: auto;

  &--rls {
    background: var(--rls-bg-elevated);
    border: 1px solid var(--rls-border);
  }
}

/* Icon buttons */
.sr__icon-btn {
  padding: 0.375rem;
  transition: color 0.15s;
  color: var(--ditto-grey);

  &:hover { color: var(--brand-secondary); }
  &--rls {
    color: var(--rls-text-secondary);
    &:hover { color: var(--rls-accent); }
  }
  &--delete {
    color: var(--error);
    &:hover { color: rgba($color-error, 0.8); }
  }
}

/* Share input */
.sr__share-input {
  width: 3rem;
  font-size: $text-sm;
  font-family: $font-satoshi;
  text-align: left;
  border-bottom: 1px solid var(--faded-grey);
  padding-bottom: 0.25rem;
  background: transparent;
  color: var(--blue);

  &:focus {
    outline: none;
    border-color: var(--brand-secondary);
  }

  &--error {
    color: var(--error);
    border-color: var(--error);
  }

  &--mob { text-align: right; width: 2.5rem; }
}

.sr__exceed {
  font-size: 10px;
  color: var(--error);
  font-family: $font-satoshi;
  margin-top: 0.25rem;
  white-space: nowrap;
}

.sr__share-actions {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin-top: 0.375rem;
  justify-content: flex-end;
}

.sr__share-apply {
  padding: 0.125rem 0.5rem;
  font-size: 10px;
  font-weight: 500;
  border-radius: 0.25rem;
  background: var(--brand-secondary);
  color: #fff;

  &:disabled { opacity: 0.5; cursor: not-allowed; }
}

.sr__share-cancel {
  padding: 0.125rem 0.5rem;
  font-size: 10px;
  font-weight: 500;
  border-radius: 0.25rem;
  border: 1px solid var(--faded-grey);
  color: var(--ditto-grey);

  &:hover { border-color: var(--ditto-grey); }
}

/* ========= Desktop layout ========= */

.sr {
  display: none;

  @include sm {
    display: grid;
    grid-template-columns: 1fr 1fr 70px 85px 100px;
    column-gap: 0.75rem;
    row-gap: 0;
    align-items: start;
    padding: 0.75rem 0;
  }

  &--deleted { opacity: 0.6; }

  &__col--rel { position: relative; }

  &__email-ro {
    display: flex;
    align-items: center;
    gap: 0.375rem;
  }

  &__unreg-wrap {
    position: relative;
    &:hover > .sr__tooltip { opacity: 1; }
  }

  &__unreg-icon {
    color: $color-amber-500;
    cursor: help;
  }

  &__share { text-align: left; }

  &__share-row {
    display: flex;
    align-items: baseline;
    gap: 0.25rem;
  }

  &__status {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    position: relative;

    &:hover > .sr__tooltip { opacity: 1; }
  }

  &__status-text {
    font-size: $text-xs;
    font-family: $font-satoshi;
    text-align: center;
    line-height: 1.25;
    cursor: help;
    color: var(--ditto-grey);

    &--error { color: var(--error); }
    &--rls { color: var(--rls-text-secondary); }
  }

  &__pend-change {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    margin-bottom: 0.25rem;
  }

  &__pend-from {
    font-size: $text-xs;
    font-weight: 500;
    color: var(--success);
    font-family: $font-satoshi;
  }

  &__pend-arrow { color: var(--ditto-grey); }

  &__pend-to {
    font-size: $text-xs;
    font-weight: 500;
    color: $color-amber-500;
    font-family: $font-satoshi;
  }

  &__pend-badge {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  &__pend-label {
    font-size: 10px;
    color: $color-amber-600;
    font-family: $font-satoshi;
  }

  &__actions {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    justify-content: flex-end;
  }

  &__act-wrap {
    position: relative;
    &:hover > .sr__mini-tip { opacity: 1; }
  }
}

/* ========= Mobile layout ========= */

.sr-m {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 0.75rem 0;

  @include sm { display: none; }

  &__top {
    display: flex;
    gap: 0.75rem;
  }

  &__name {
    flex: 1;
    position: relative;
  }

  &__share-col {
    width: 4rem;
    flex-shrink: 0;
  }

  &__share-row {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  &__footer {
    display: flex;
    align-items: center;
    justify-content: space-between;

    &--end { justify-content: flex-end; }
  }

  &__status {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  &__status-text {
    font-size: $text-xs;
    color: var(--ditto-grey);
    font-family: $font-satoshi;
  }

  &__btns {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }
}
</style>
