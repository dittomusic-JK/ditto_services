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
          <!-- For RLS: just show userShare directly (no pending concept) -->
          <p class="text-sm font-bold font-satoshi" :class="isRLS ? 'text-rls-accent' : 'text-brand-secondary'">{{ isRLS ? userShare : activeUserShare }}%</p>
          <!-- Pending indicator - not shown for RLS -->
          <template v-if="hasPendingChanges && !isRLS">
            <span class="text-ditto-grey">→</span>
            <p class="text-sm font-bold text-amber-500 font-satoshi">{{ userShare }}%</p>
            <span class="text-[10px] text-amber-500 font-satoshi">(pending)</span>
          </template>
        </div>
      </div>
    </div>

    <!-- Splits section header -->
    <div class="flex items-center justify-between py-4">
      <h4 class="text-base font-bold font-poppins" :class="isRLS ? 'text-rls-text' : 'text-ditto-blue'">
        Splits{{ existingSplits.length > 0 ? ` (${existingSplits.length})` : '' }}
      </h4>
      <button
        @click="$emit('close')"
        class="p-1 transition-colors" :class="isRLS ? 'text-rls-text-secondary hover:text-rls-text' : 'text-ditto-grey hover:text-ditto-blue'"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M18 6L6 18M6 6l12 12" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>

    <!-- Existing splits (read-only) -->
    <div v-if="existingSplits.length > 0" class="divide-y" :class="isRLS ? 'divide-rls-border' : 'divide-faded-grey'">
      <SplitRow
        v-for="(split, index) in existingSplits"
        :key="split.id"
        :name="split.name"
        :email="split.email"
        :share="split.share"
        :status="split.status"
        :active-since="split.activeSince"
        :original-share="split.originalShare"
        :share-index="index + 1"
        :is-editable="false"
        :can-edit-email="false"
        :current-total-share="currentTotalShare - split.share"
        :is-r-l-s="isRLS"
        @remove="$emit('remove-split', split.id)"
        @update-share="(newShare) => $emit('update-share', split.id, newShare)"
        @resend="$emit('resend-confirmation', split.id)"
      />
    </div>

    <!-- New split entry row (always shown) -->
    <div class="border-t pt-4" :class="isRLS ? 'border-rls-border' : 'border-faded-grey'">
      <SplitRow
        ref="newSplitRowRef"
        :name="newSplit.name"
        :email="newSplit.email"
        :share="newSplit.share"
        :is-editable="true"
        :known-collaborators="availableCollaborators"
        :current-total-share="currentTotalShare"
        :is-r-l-s="isRLS"
        @update="handleNewSplitUpdate"
        @remove="clearNewSplit"
      />
      <!-- Duplicate collaborator warning -->
      <p v-if="duplicateCollaborator" class="text-xs text-amber-600 font-satoshi mt-2 flex items-center gap-1.5">
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.5"/>
          <path d="M8 5V8.5M8 10.5V10.51" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
        {{ duplicateCollaborator.name }} is already on this track. Edit their existing split instead.
      </p>
      
      <!-- Keyboard shortcut hint -->
      <p class="text-xs font-satoshi mt-3 hidden sm:block text-center" :class="isRLS ? 'text-rls-text-secondary' : 'text-ditto-grey'">
        <kbd class="px-1.5 py-0.5 border rounded text-[10px]" :class="isRLS ? 'bg-rls-card border-rls-border' : 'bg-white border-faded-grey'">⌘</kbd> + <kbd class="px-1.5 py-0.5 border rounded text-[10px]" :class="isRLS ? 'bg-rls-card border-rls-border' : 'bg-white border-faded-grey'">Enter</kbd> to save · <kbd class="px-1.5 py-0.5 border rounded text-[10px]" :class="isRLS ? 'bg-rls-card border-rls-border' : 'bg-white border-faded-grey'">Esc</kbd> to close
      </p>
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

      <!-- Save button -->
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, watch, onMounted } from 'vue'
import type { Collaborator, TrackSplit } from '../../types'
import SplitRow from './SplitRow.vue'

const props = defineProps<{
  accountHolder: string
  userShare: number
  existingSplits: Collaborator[]
  otherTracks: TrackSplit[]
  hasChanges?: boolean
  knownCollaborators?: { name: string; email: string }[]
  isRLS?: boolean
}>()

// Calculate total share already allocated (100 - userShare)
const currentTotalShare = computed(() => 100 - props.userShare)

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

const emit = defineEmits<{
  close: []
  save: []
  'add-split': [split: { name: string; email: string; share: number }]
  'remove-split': [id: string]
  'update-share': [id: string, newShare: number]
  'resend-confirmation': [id: string]
  'open-copy-modal': []
  'dirty-change': [isDirty: boolean, pendingSplit: { name: string; email: string; share: number } | null]
}>()

const containerRef = ref<HTMLDivElement | null>(null)
const newSplitRowRef = ref<InstanceType<typeof SplitRow> | null>(null)

// Focus container on mount so keyboard shortcuts work
onMounted(() => {
  containerRef.value?.focus()
})

const newSplit = reactive({
  name: '',
  email: '',
  share: 0
})

// Get emails already in splits (including pending)
const existingEmails = computed(() => 
  new Set(props.existingSplits.map(s => s.email.toLowerCase()))
)

// Filter out already-added collaborators from the suggestions
const availableCollaborators = computed(() => 
  (props.knownCollaborators || []).filter(
    c => !existingEmails.value.has(c.email.toLowerCase())
  )
)

// Check if the email already exists in splits
const duplicateCollaborator = computed(() => {
  if (!newSplit.email.trim()) return null
  return props.existingSplits.find(
    s => s.email.toLowerCase() === newSplit.email.toLowerCase().trim()
  )
})

const canAddSplit = computed(() => {
  return newSplit.name.trim() !== '' && 
         newSplit.email.trim() !== '' && 
         newSplit.share > 0 &&
         !duplicateCollaborator.value
})

// Check if form has any data entered (even if not complete)
const hasFormData = computed(() => {
  return newSplit.name.trim() !== '' || 
         newSplit.email.trim() !== '' || 
         newSplit.share > 0
})

// Emit dirty state changes so parent can track unsaved form data
watch([hasFormData, () => ({ ...newSplit })], ([isDirty, splitData]) => {
  emit('dirty-change', isDirty, isDirty && canAddSplit.value ? splitData : null)
}, { deep: true })

// Can save if there are pending changes OR a valid new split is being entered
const canSave = computed(() => {
  return props.hasChanges || canAddSplit.value
})

// Save handler - if there's a valid new split, add it first then save
const handleSave = () => {
  // Only proceed if there's something to save
  if (!canSave.value) return
  
  if (canAddSplit.value) {
    emit('add-split', { ...newSplit })
    clearNewSplit()
  }
  emit('save')
}

const handleNewSplitUpdate = (data: { name: string; email: string; share: number }) => {
  newSplit.name = data.name
  newSplit.email = data.email
  newSplit.share = data.share
}

const clearNewSplit = () => {
  newSplit.name = ''
  newSplit.email = ''
  newSplit.share = 0
}
</script>
