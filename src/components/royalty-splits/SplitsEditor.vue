<template>
  <div
    ref="containerRef"
    class="se"
    :class="{ 'se--rls': isRLS }"
    tabindex="-1"
    @keydown.escape.prevent="$emit('close')"
    @keydown.enter.ctrl.prevent="handleSave"
    @keydown.enter.meta.prevent="handleSave"
  >
    <!-- User's split summary -->
    <div class="se__summary" :class="{ 'se__summary--rls': isRLS }">
      <div>
        <span class="se__summary-label" :class="{ 'se__summary-label--rls': isRLS }">Your Split:</span>
        <div class="se__summary-row">
          <p class="se__summary-val" :class="{ 'se__summary-val--rls': isRLS }">{{ activeUserShare }}%</p>
          <template v-if="hasPendingChanges && !isRLS && activeUserShare !== currentUserShare">
            <span class="se__summary-sep">&gt;</span>
            <p class="se__summary-pending">{{ currentUserShare }}%</p>
            <span class="se__summary-pending-tag">Pending</span>
          </template>
        </div>
      </div>
    </div>

    <!-- Splits section header -->
    <div class="se__header">
      <h4 class="se__title" :class="{ 'se__title--rls': isRLS }">
        Splits{{ visibleSplits.length > 0 ? ` (${visibleSplits.length})` : '' }}
      </h4>
      <button @click="handleClose" class="se__close-btn" :class="{ 'se__close-btn--rls': isRLS }">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M18 6L6 18M6 6l12 12" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>

    <!-- All splits -->
    <div v-if="visibleSplits.length > 0" class="se__rows" :class="{ 'se__rows--rls': isRLS }">
      <SplitRow
        v-for="(split, index) in visibleSplits"
        :key="split.id"
        :split-id="split.id"
        :name="split.name"
        :email="split.email"
        :share="split.share"
        :status="split.status"
        :active-since="split.activeSince"
        :original-share="split.originalShare"
        :has-account="split.hasAccount"
        :share-index="index + 1"
        :is-editable="(split.isNew && !split.isCommitted) || false"
        :is-new="split.isNew"
        :is-deleted="split.isDeleted"
        :known-collaborators="availableCollaborators"
        :current-total-share="currentTotalShare - split.share"
        :is-r-l-s="isRLS"
        @update="(data) => handleSplitUpdate(split.id, data)"
        @remove="handleRemoveSplit(split.id)"
        @resend="$emit('resend-confirmation', split.id)"
        @commit="handleCommitSplit(split.id)"
        @re-edit="handleReEditSplit(split.id)"
        @edit-email="$emit('edit-email', split.email)"
      />
    </div>

    <!-- Add new split button -->
    <div class="se__add-section" :class="{ 'se__add-section--rls': isRLS }">
      <button @click="addNewSplitRow" class="se__pill-btn" :class="{ 'se__pill-btn--rls': isRLS }">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M8 3.33334V12.6667M3.33333 8H12.6667" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        Add Split
      </button>
    </div>

    <!-- Action buttons -->
    <div class="se__bar" :class="{ 'se__bar--rls': isRLS }">
      <div class="se__bar-left">
        <button
          v-if="otherTracks.length > 0"
          @click="$emit('open-copy-modal')"
          class="se__pill-btn se__pill-btn--full-mob" :class="{ 'se__pill-btn--rls': isRLS }"
        >
          <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
            <path d="M15 6H8.25C7.42 6 6.75 6.67 6.75 7.5V14.25C6.75 15.08 7.42 15.75 8.25 15.75H15C15.83 15.75 16.5 15.08 16.5 14.25V7.5C16.5 6.67 15.83 6 15 6Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M3.75 12H3C2.60218 12 2.22064 11.842 1.93934 11.5607C1.65804 11.2794 1.5 10.8978 1.5 10.5V3C1.5 2.60218 1.65804 2.22064 1.93934 1.93934C2.22064 1.65804 2.60218 1.5 3 1.5H10.5C10.8978 1.5 11.2794 1.65804 11.5607 1.93934C11.842 2.22064 12 2.60218 12 3V3.75" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Copy splits from
        </button>
      </div>

      <div class="se__save-wrap">
        <button @click="handleSave" :disabled="!canSave" class="se__save-btn">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M13.333 5.333L6 12.667 2.667 9.333" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Save Splits
        </button>
        <div v-if="sharesExceed100" class="se__save-tip">
          Total splits cannot exceed 100%. Adjust the splits before saving.
          <div class="se__save-tip-arrow" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, watch, onMounted } from 'vue'
import type { Collaborator, TrackSplit } from '../../types'
import SplitRow from './SplitRow.vue'

interface StagedSplit {
  id: string
  name: string
  email: string
  share: number
  status?: 'active' | 'pending' | 'rejected' | 'unclaimed'
  activeSince?: string
  originalShare?: number
  hasAccount?: boolean
  isNew?: boolean // New split not yet saved
  isEdited?: boolean // Existing split that has been edited
  isDeleted?: boolean // Marked for deletion
  isCommitted?: boolean // New split visually locked-in but not yet saved to DB
}

const props = defineProps<{
  accountHolder: string
  userShare: number
  existingSplits: Collaborator[]
  otherTracks: TrackSplit[]
  hasChanges?: boolean
  knownCollaborators?: { name: string; email: string }[]
  isRLS?: boolean
  saveRequested?: number
}>()

// Local staged state - starts as a copy of existing splits
const stagedSplits = ref<StagedSplit[]>([])

// Initialize staged splits from props
const initializeStagedSplits = () => {
  stagedSplits.value = props.existingSplits.map(s => ({ ...s }))
  // Always add an empty row when opening
  addNewSplitRow()
}

// Initialize on mount and when existingSplits change
onMounted(() => {
  initializeStagedSplits()
})

watch(() => props.existingSplits, () => {
  // Only reinitialize if there are no unsaved changes
  if (!hasUnsavedChanges.value) {
    initializeStagedSplits()
  }
}, { deep: true })

// Calculate total share from staged splits (excluding deleted and rejected)
const currentTotalShare = computed(() => {
  const allocatedShares = stagedSplits.value
    .filter(s => !s.isDeleted && s.status !== 'rejected')
    .reduce((sum, s) => sum + s.share, 0)
  return allocatedShares
})

// Calculate user's current share
const currentUserShare = computed(() => {
  return 100 - currentTotalShare.value
})

// Check if there are pending changes (only pending splits - rejected means share is back with user)
const hasPendingChanges = computed(() => 
  props.existingSplits.some(s => s.status === 'pending')
)

// Calculate what the user's share would be with only active splits (rejected splits don't reduce user share)
const activeUserShare = computed(() => {
  const activeTotal = props.existingSplits
    .filter(s => s.status === 'active')
    .reduce((sum, s) => sum + s.share, 0)
  return 100 - activeTotal
})

// Check if total shares exceed 100%
const sharesExceed100 = computed(() => {
  return currentTotalShare.value > 100
})

// Check if there are any unsaved changes
const hasUnsavedChanges = computed(() => {
  // Check for new splits with actual data (not empty rows)
  const hasNewSplits = stagedSplits.value.some(s => 
    s.isNew && 
    !s.isDeleted && 
    (s.name.trim() !== '' || s.email.trim() !== '' || s.share > 0)
  )
  // Check for edited splits
  const hasEditedSplits = stagedSplits.value.some(s => s.isEdited && !s.isDeleted)
  // Check for deleted splits
  const hasDeletedSplits = stagedSplits.value.some(s => s.isDeleted)
  
  return hasNewSplits || hasEditedSplits || hasDeletedSplits
})

const emit = defineEmits<{
  close: []
  save: [changes: { added: Collaborator[], edited: Collaborator[], deleted: string[] }]
  'resend-confirmation': [id: string]
  'open-copy-modal': []
  'dirty-change': [isDirty: boolean]
  'edit-email': [email: string]
}>()

const containerRef = ref<HTMLDivElement | null>(null)

// Detect Mac vs Windows for keyboard shortcut display
const isMac = computed(() => 
  typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform)
)
const modifierKey = computed(() => isMac.value ? '⌘' : 'Ctrl')

// Focus container on mount so keyboard shortcuts work
onMounted(() => {
  containerRef.value?.focus()
})

// Emit dirty state changes
watch(hasUnsavedChanges, (isDirty) => {
  emit('dirty-change', isDirty)
})

// Watch for external save requests (e.g. from unsaved changes modal)
watch(() => props.saveRequested, () => {
  if (canSave.value) {
    handleSave()
  }
})

// Get emails already in splits (including staged, excluding deleted)
const existingEmails = computed(() => {
  const emails = stagedSplits.value
    .filter(s => !s.isDeleted)
    .map(s => s.email.toLowerCase())
  return new Set(emails)
})

// Filter out already-added collaborators from the suggestions
const availableCollaborators = computed(() => 
  (props.knownCollaborators || []).filter(
    c => !existingEmails.value.has(c.email.toLowerCase())
  )
)

// Add a new empty split row
const addNewSplitRow = () => {
  stagedSplits.value.push({
    id: `new_${Date.now()}_${Math.random()}`,
    name: '',
    email: '',
    share: 0,
    isNew: true
  })
}

// Update a staged split
const handleSplitUpdate = (id: string, data: { name: string; email: string; share: number }) => {
  const split = stagedSplits.value.find(s => s.id === id)
  if (split) {
    split.name = data.name
    split.email = data.email
    split.share = data.share
    
    // Mark as edited if it's not a new split
    if (!split.isNew) {
      split.isEdited = true
    }
  }
}

// Commit a new split — visually lock it in as pending
const handleCommitSplit = (id: string) => {
  const split = stagedSplits.value.find(s => s.id === id)
  if (split && split.isNew && !split.isCommitted) {
    split.isCommitted = true
    split.status = 'pending'
    // Add a new empty row for the next split
    addNewSplitRow()
  }
}

// Re-edit a committed split (when user clicks Edit icon on a committed new split)
const handleReEditSplit = (id: string) => {
  const split = stagedSplits.value.find(s => s.id === id)
  if (split && split.isNew && split.isCommitted) {
    split.isCommitted = false
    split.status = undefined
    // Remove the empty row that was auto-added when this split was committed
    // (to avoid duplicate empty rows)
    const emptyIdx = stagedSplits.value.findIndex(
      s => s.isNew && !s.isCommitted && s.id !== id && s.name === '' && s.email === '' && s.share === 0
    )
    if (emptyIdx > -1) {
      stagedSplits.value.splice(emptyIdx, 1)
    }
  }
}

// Mark a split for deletion
const handleRemoveSplit = (id: string) => {
  const split = stagedSplits.value.find(s => s.id === id)
  if (split) {
    if (split.isNew) {
      // Remove new unsaved splits immediately
      const index = stagedSplits.value.findIndex(s => s.id === id)
      if (index > -1) {
        stagedSplits.value.splice(index, 1)
      }
    } else {
      // Mark existing splits as deleted
      split.isDeleted = true
    }
  }
}

// Can save if there are unsaved changes and shares don't exceed 100%
const canSave = computed(() => {
  return hasUnsavedChanges.value && !sharesExceed100.value
})

// Save handler - collect all changes and emit
const handleSave = () => {
  if (!canSave.value) return
  
  // Collect added splits (new, not deleted, with complete data)
  const added = stagedSplits.value
    .filter(s => s.isNew && !s.isDeleted && s.name.trim() && s.email.trim() && s.share > 0)
    .map(s => ({
      id: s.id,
      name: s.name,
      email: s.email,
      share: s.share,
      status: s.status,
      activeSince: s.activeSince,
      hasAccount: s.hasAccount
    } as Collaborator))
  
  // Collect edited splits
  const edited = stagedSplits.value
    .filter(s => s.isEdited && !s.isDeleted && !s.isNew)
    .map(s => ({
      id: s.id,
      name: s.name,
      email: s.email,
      share: s.share,
      status: s.status,
      activeSince: s.activeSince,
      originalShare: s.originalShare,
      hasAccount: s.hasAccount
    } as Collaborator))
  
  // Collect deleted split IDs
  const deleted = stagedSplits.value
    .filter(s => s.isDeleted && !s.isNew)
    .map(s => s.id)
  
  emit('save', { added, edited, deleted })
  
  // Reset staged state after save
  initializeStagedSplits()
}

// Get all splits (including deleted ones which will show with strikethrough)
const visibleSplits = computed(() => stagedSplits.value)

// Handle close - check for unsaved changes
const handleClose = () => {
  if (hasUnsavedChanges.value) {
    emit('close')
  } else {
    emit('close')
  }
}
</script>

<style lang="scss" scoped>
.se {
  padding: 1rem 0.75rem;
  border-radius: 0 0 $radius-card $radius-card;
  background: var(--lighter-grey);

  &:focus { outline: none; }

  @include sm { padding: 1rem 1.5rem; }

  &--rls {
    background: var(--rls-bg-elevated);
  }

  /* ---- Summary ---- */
  &__summary {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding-bottom: 1rem;

    @include sm { gap: 1rem; }
  }

  &__summary-label {
    font-size: $text-xs;
    font-family: $font-satoshi;
    color: var(--ditto-grey);

    &--rls { color: var(--rls-text-secondary); }
  }

  &__summary-row {
    display: flex;
    align-items: center;
    gap: 0.375rem;
  }

  &__summary-val {
    font-size: $text-sm;
    font-weight: 700;
    font-family: $font-satoshi;
    color: var(--brand-secondary);

    &--rls { color: var(--rls-accent); }
  }

  &__summary-sep {
    color: var(--ditto-grey);
    font-family: $font-satoshi;
    font-size: $text-sm;
  }

  &__summary-pending {
    font-size: $text-sm;
    font-weight: 700;
    color: $color-amber-500;
    font-family: $font-satoshi;
  }

  &__summary-pending-tag {
    font-size: 10px;
    color: $color-amber-500;
    font-family: $font-satoshi;
  }

  /* ---- Header ---- */
  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 0;
  }

  &__title {
    font-size: $text-body;
    font-weight: 700;
    font-family: $font-satoshi;
    letter-spacing: -0.03em;
    color: var(--blue);

    &--rls { color: var(--rls-text); }
  }

  &__close-btn {
    padding: 0.25rem;
    transition: color 0.15s;
    color: var(--ditto-grey);

    &:hover { color: var(--blue); }
    &--rls {
      color: var(--rls-text-secondary);
      &:hover { color: var(--rls-text); }
    }
  }

  /* ---- Rows divider ---- */
  &__rows {}

  /* ---- Add section ---- */
  &__add-section {
    padding-top: 1rem;
  }

  /* ---- Bottom bar ---- */
  &__bar {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: space-between;
    gap: 0.75rem;
    padding-top: 1rem;
    margin-top: 1rem;

    @include sm {
      flex-direction: row;
      align-items: center;
    }
  }

  &__bar-left {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 0.5rem;

    @include sm {
      flex-direction: row;
      align-items: center;
      gap: 0.75rem;
    }
  }

  /* ---- Pill button (shared) ---- */
  &__pill-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    border: 1px solid var(--faded-grey);
    border-radius: $radius-button;
    font-size: $text-sm;
    font-weight: 500;
    font-family: $font-satoshi;
    color: var(--ditto-grey);
    transition: border-color 0.15s, color 0.15s;

    &:hover {
      border-color: var(--brand-secondary);
      color: var(--brand-secondary);
    }

    &--rls {
      border-color: var(--rls-border);
      color: var(--rls-text-secondary);

      &:hover {
        border-color: var(--rls-accent);
        color: var(--rls-accent);
      }
    }

    &--full-mob {
      justify-content: center;
      width: 100%;

      @include sm {
        justify-content: flex-start;
        width: auto;
      }
    }
  }

  /* ---- Save ---- */
  &__save-wrap {
    position: relative;

    &:hover > .se__save-tip { opacity: 1; }
  }

  &__save-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.5rem 1.5rem;
    border: 1px solid var(--brand-secondary);
    border-radius: $radius-button;
    font-size: $text-sm;
    font-weight: 600;
    color: var(--brand-secondary);
    font-family: $font-satoshi;
    transition: background 0.15s;

    &:hover { background: rgba($color-brand-secondary, 0.05); }
    &:disabled { opacity: 0.5; cursor: not-allowed; }
  }

  &__save-tip {
    position: absolute;
    bottom: 100%;
    right: 0;
    margin-bottom: 0.5rem;
    padding: 0.5rem 0.75rem;
    background: var(--blue);
    color: #fff;
    font-size: $text-xs;
    border-radius: $radius-lg;
    width: 12rem;
    text-align: center;
    opacity: 0;
    transition: opacity 0.15s;
    pointer-events: none;
    z-index: 20;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  &__save-tip-arrow {
    position: absolute;
    top: 100%;
    right: 1.5rem;
    border: 4px solid transparent;
    border-top-color: var(--blue);
  }
}
</style>
