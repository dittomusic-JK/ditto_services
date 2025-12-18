<template>
  <div 
    class="bg-lighter-grey border-t border-b-2 border-faded-grey px-3 sm:px-6 py-4 rounded-b-xl"
    @keydown.escape="$emit('close')"
    @keydown.enter.ctrl="handleSave"
    @keydown.enter.meta="handleSave"
  >
    <!-- User's split summary -->
    <div class="flex items-center gap-3 sm:gap-4 pb-4 border-b border-faded-grey">
      <div>
        <span class="text-xs text-ditto-grey font-satoshi">You:</span>
        <p class="text-sm font-semibold text-ditto-blue font-satoshi">{{ accountHolder }}</p>
      </div>
      <div>
        <span class="text-xs text-ditto-grey font-satoshi">Your Split:</span>
        <div class="flex items-center gap-1.5">
          <p class="text-sm font-bold text-brand-secondary font-satoshi">{{ activeUserShare }}%</p>
          <template v-if="hasPendingChanges">
            <span class="text-ditto-grey">→</span>
            <p class="text-sm font-bold text-amber-500 font-satoshi">{{ userShare }}%</p>
            <span class="text-[10px] text-amber-500 font-satoshi">(pending)</span>
          </template>
        </div>
      </div>
    </div>

    <!-- Splits section header -->
    <div class="flex items-center justify-between py-4">
      <h4 class="text-base font-bold text-ditto-blue font-poppins">
        Splits{{ existingSplits.length > 0 ? ` (${existingSplits.length})` : '' }}
      </h4>
      <button
        @click="$emit('close')"
        class="p-1 text-ditto-grey hover:text-ditto-blue transition-colors"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M18 6L6 18M6 6l12 12" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>

    <!-- Existing splits (read-only) -->
    <div v-if="existingSplits.length > 0" class="divide-y divide-faded-grey">
      <SplitRow
        v-for="(split, index) in existingSplits"
        :key="split.id"
        :name="split.name"
        :email="split.email"
        :share="split.share"
        :status="split.status"
        :active-since="split.activeSince"
        :share-index="index + 1"
        :is-editable="false"
        :can-edit-email="false"
        :current-total-share="currentTotalShare - split.share"
        @remove="$emit('remove-split', split.id)"
        @update-share="(newShare) => $emit('update-share', split.id, newShare)"
        @resend="$emit('resend-confirmation', split.id)"
      />
    </div>

    <!-- New split entry row -->
    <div class="border-t border-faded-grey pt-4">
      <SplitRow
        :name="newSplit.name"
        :email="newSplit.email"
        :share="newSplit.share"
        :is-editable="true"
        :known-collaborators="knownCollaborators"
        :current-total-share="currentTotalShare"
        @update="handleNewSplitUpdate"
        @remove="clearNewSplit"
        @complete="autoAddSplit"
      />
      <!-- Duplicate collaborator warning -->
      <p v-if="duplicateCollaborator" class="text-xs text-amber-600 font-satoshi mt-2 flex items-center gap-1.5">
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.5"/>
          <path d="M8 5V8.5M8 10.5V10.51" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
        {{ duplicateCollaborator.name }} is already on this track. Edit their existing split instead.
      </p>
      <p v-else-if="canAddSplit" class="text-xs text-success font-satoshi mt-2 flex items-center gap-1.5">
        <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
          <path d="M13.333 4L6 11.333 2.667 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        Press <kbd class="px-1 py-0.5 bg-white border border-faded-grey rounded text-[10px] mx-0.5">Tab</kbd> or <kbd class="px-1 py-0.5 bg-white border border-faded-grey rounded text-[10px] mx-0.5">Enter</kbd> to add another
      </p>
      <p v-else class="text-xs text-ditto-grey font-satoshi mt-2 hidden sm:block">
        <kbd class="px-1.5 py-0.5 bg-white border border-faded-grey rounded text-[10px]">⌘</kbd> + <kbd class="px-1.5 py-0.5 bg-white border border-faded-grey rounded text-[10px]">Enter</kbd> to save · <kbd class="px-1.5 py-0.5 bg-white border border-faded-grey rounded text-[10px]">Esc</kbd> to close
      </p>
    </div>

    <!-- Action buttons -->
    <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4 border-t border-faded-grey mt-4">
      <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
        <!-- Copy Splits dropdown -->
        <div class="relative">
          <button
            @click="showCopyDropdown = !showCopyDropdown"
            class="flex items-center justify-center sm:justify-start gap-2 w-full sm:w-auto px-4 py-2 border border-faded-grey rounded-full text-sm font-medium text-ditto-grey font-satoshi hover:border-brand-secondary transition-colors"
          >
            Copy Splits from...
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" class="transition-transform" :class="{ 'rotate-180': showCopyDropdown }">
              <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          <div
            v-if="showCopyDropdown"
            class="absolute top-full left-0 right-0 sm:right-auto mt-1 bg-white border border-faded-grey rounded-xl shadow-lg py-2 min-w-[200px] z-10"
          >
            <button
              v-for="track in otherTracks"
              :key="track.trackId"
              @click="handleCopyFrom(track.trackId)"
              class="w-full px-4 py-2 text-left text-sm text-ditto-blue font-satoshi hover:bg-light-grey transition-colors"
            >
              {{ track.trackName }}
            </button>
            <p v-if="otherTracks.length === 0" class="px-4 py-2 text-sm text-ditto-grey font-satoshi">
              No other tracks with splits
            </p>
          </div>
        </div>
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
import { ref, computed, reactive } from 'vue'
import type { Collaborator, TrackSplit } from '../../types'
import SplitRow from './SplitRow.vue'

const props = defineProps<{
  accountHolder: string
  userShare: number
  existingSplits: Collaborator[]
  otherTracks: TrackSplit[]
  hasChanges?: boolean
  knownCollaborators?: { name: string; email: string }[]
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
  'copy-from': [trackId: string]
}>()

const showCopyDropdown = ref(false)

const newSplit = reactive({
  name: '',
  email: '',
  share: 0
})

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

// Can save if there are pending changes OR a valid new split to add
const canSave = computed(() => {
  return props.hasChanges || canAddSplit.value
})

// Save handler - add pending split first if valid, then emit save
const handleSave = () => {
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

const autoAddSplit = () => {
  if (canAddSplit.value) {
    emit('add-split', { ...newSplit })
    clearNewSplit()
  }
}

const clearNewSplit = () => {
  newSplit.name = ''
  newSplit.email = ''
  newSplit.share = 0
}

const handleCopyFrom = (trackId: string) => {
  emit('copy-from', trackId)
  showCopyDropdown.value = false
}
</script>
