<template>
  <div 
    ref="containerRef"
    class="border-t border-b-2 px-3 sm:px-6 py-4 rounded-b-xl focus:outline-none"
    :class="isRLS ? 'bg-rls-bg-elevated border-rls-border' : 'bg-lighter-grey border-faded-grey'"
    tabindex="-1"
    @keydown.escape.prevent="$emit('close')"
    @keydown.enter.ctrl.prevent="handleSave"
    @keydown.enter.meta.prevent="handleSave"
  >
    <!-- User's split summary -->
    <div class="flex items-center gap-3 sm:gap-4 pb-4 border-b" :class="isRLS ? 'border-rls-border' : 'border-faded-grey'">
      <div>
        <span class="text-xs font-satoshi" :class="isRLS ? 'text-rls-text-secondary' : 'text-ditto-grey'">Your Split:</span>
        <div class="flex items-center gap-1.5">
          <!-- Show current user share based on staged splits -->
          <p class="text-sm font-bold font-satoshi" :class="isRLS ? 'text-rls-accent' : 'text-brand-secondary'">{{ currentUserShare }}%</p>
          <!-- Show pending indicator if there are unsaved changes -->
          <template v-if="hasUnsavedChanges && !isRLS">
            <span class="text-ditto-grey">→</span>
            <p class="text-sm font-bold text-amber-500 font-satoshi">{{ currentUserShare }}%</p>
            <span class="text-[10px] text-amber-500 font-satoshi">(unsaved)</span>
          </template>
        </div>
      </div>
    </div>

    <!-- Splits section header -->
    <div class="flex items-center justify-between py-4">
      <h4 class="text-base font-bold font-poppins" :class="isRLS ? 'text-rls-text' : 'text-ditto-blue'">
        Splits{{ visibleSplits.length > 0 ? ` (${visibleSplits.length})` : '' }}
      </h4>
      <button
        @click="handleClose"
        class="p-1 transition-colors" :class="isRLS ? 'text-rls-text-secondary hover:text-rls-text' : 'text-ditto-grey hover:text-ditto-blue'"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M18 6L6 18M6 6l12 12" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>

    <!-- All splits - existing (read-only) and new (editable) -->
    <div v-if="visibleSplits.length > 0" class="divide-y" :class="isRLS ? 'divide-rls-border' : 'divide-faded-grey'">
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
        :is-editable="split.isNew || false"
        :is-new="split.isNew"
        :is-deleted="split.isDeleted"
        :known-collaborators="availableCollaborators"
        :current-total-share="currentTotalShare - split.share"
        :is-r-l-s="isRLS"
        @update="(data) => handleSplitUpdate(split.id, data)"
        @remove="handleRemoveSplit(split.id)"
        @resend="$emit('resend-confirmation', split.id)"
      />
    </div>

    <!-- Add new split button -->
    <div class="border-t pt-4" :class="isRLS ? 'border-rls-border' : 'border-faded-grey'">
      <button
        @click="addNewSplitRow"
        class="flex items-center gap-2 px-4 py-2 border rounded-full text-sm font-medium font-satoshi transition-colors"
        :class="isRLS ? 'border-rls-border text-rls-text-secondary hover:border-rls-accent hover:text-rls-accent' : 'border-faded-grey text-ditto-grey hover:border-brand-secondary hover:text-brand-secondary'"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M8 3.33334V12.6667M3.33333 8H12.6667" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        Add Split
      </button>
    </div>

    <!-- Action buttons -->
    <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4 border-t mt-4" :class="isRLS ? 'border-rls-border' : 'border-faded-grey'">
      <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
        <!-- Copy Splits button (opens modal directly) -->
        <button
          v-if="otherTracks.length > 0"
          @click="$emit('open-copy-modal')"
          class="flex items-center justify-center sm:justify-start gap-2 w-full sm:w-auto px-4 py-2 border rounded-full text-sm font-medium font-satoshi transition-colors"
          :class="isRLS ? 'border-rls-border text-rls-text-secondary hover:border-rls-accent hover:text-rls-accent' : 'border-faded-grey text-ditto-grey hover:border-brand-secondary hover:text-brand-secondary'"
        >
          <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
            <path d="M15 6H8.25C7.42 6 6.75 6.67 6.75 7.5V14.25C6.75 15.08 7.42 15.75 8.25 15.75H15C15.83 15.75 16.5 15.08 16.5 14.25V7.5C16.5 6.67 15.83 6 15 6Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M3.75 12H3C2.60218 12 2.22064 11.842 1.93934 11.5607C1.65804 11.2794 1.5 10.8978 1.5 10.5V3C1.5 2.60218 1.65804 2.22064 1.93934 1.93934C2.22064 1.65804 2.60218 1.5 3 1.5H10.5C10.8978 1.5 11.2794 1.65804 11.5607 1.93934C11.842 2.22064 12 2.60218 12 3V3.75" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Copy splits from
        </button>
      </div>

      <!-- Save button with tooltip for validation errors -->
      <div class="relative group">
        <button
          @click="handleSave"
          :disabled="!canSave"
          class="flex items-center justify-center gap-2 px-6 py-2 border border-brand-secondary rounded-full text-sm font-semibold text-brand-secondary font-satoshi hover:bg-brand-secondary/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M13.333 5.333L6 12.667 2.667 9.333" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Save Splits
        </button>
        <!-- Validation tooltip -->
        <div v-if="sharesExceed100" class="absolute bottom-full right-0 mb-2 px-3 py-2 bg-ditto-blue text-white text-xs rounded-lg w-48 text-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 shadow-lg">
          Total shares cannot exceed 100%. Adjust the splits before saving.
          <div class="absolute top-full right-6 border-4 border-transparent border-t-ditto-blue" />
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
}

const props = defineProps<{
  accountHolder: string
  userShare: number
  existingSplits: Collaborator[]
  otherTracks: TrackSplit[]
  hasChanges?: boolean
  knownCollaborators?: { name: string; email: string }[]
  isRLS?: boolean
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
    // Will be handled by parent's unsaved changes modal
    emit('close')
  } else {
    emit('close')
  }
}
</script>
