<template>
  <!-- Desktop layout -->
  <div class="hidden sm:grid grid-cols-[1fr_1fr_auto] gap-4 items-start py-3">
    <!-- Name field with autocomplete -->
    <div class="relative">
      <label class="block text-xs text-ditto-grey mb-1 font-satoshi">Name:</label>
      <input
        v-if="isEditable"
        ref="nameInputRef"
        v-model="localName"
        type="text"
        placeholder="Enter name"
        class="w-full text-sm text-ditto-blue font-satoshi border-b border-faded-grey pb-1 focus:border-brand-secondary focus:outline-none bg-transparent"
        @input="handleNameInput"
        @focus="showAutocomplete = filteredCollaborators.length > 0"
        @blur="hideAutocompleteDelayed"
        @keydown.down.prevent="navigateAutocomplete(1)"
        @keydown.up.prevent="navigateAutocomplete(-1)"
        @keydown.enter.prevent="selectHighlighted"
        @keydown.escape="showAutocomplete = false"
      />
      <span v-else class="text-sm text-ditto-blue font-satoshi">{{ name }}</span>
      
      <!-- Autocomplete dropdown -->
      <div
        v-if="isEditable && showAutocomplete && filteredCollaborators.length > 0"
        class="absolute top-full left-0 right-0 mt-1 bg-white border border-faded-grey rounded-lg shadow-lg py-1 z-20 max-h-40 overflow-y-auto"
      >
        <button
          v-for="(collab, index) in filteredCollaborators"
          :key="collab.email"
          type="button"
          class="w-full px-3 py-2 text-left text-sm font-satoshi transition-colors"
          :class="index === highlightedIndex ? 'bg-brand-secondary/10 text-brand-secondary' : 'text-ditto-blue hover:bg-light-grey'"
          @mousedown.prevent="selectCollaborator(collab)"
        >
          <span class="font-medium">{{ collab.name }}</span>
          <span class="text-xs text-ditto-grey ml-2">{{ collab.email }}</span>
        </button>
      </div>
    </div>

    <!-- Email field -->
    <div>
      <label class="block text-xs text-ditto-grey mb-1 font-satoshi">Email*</label>
      <input
        v-if="isEditable"
        v-model="localEmail"
        type="email"
        placeholder="We'll contact them here"
        class="w-full text-sm text-ditto-blue font-satoshi border-b border-faded-grey pb-1 focus:border-brand-secondary focus:outline-none bg-transparent"
        @input="emitUpdate"
      />
      <span v-else class="text-sm text-ditto-blue font-satoshi">{{ email }}</span>
    </div>

    <!-- Share and status -->
    <div class="flex items-start gap-3">
      <!-- Share input -->
      <div class="text-right">
        <label class="block text-xs text-ditto-grey mb-1 font-satoshi">
          {{ shareLabel }}
        </label>
        <div class="flex items-center gap-1">
          <input
            v-if="isEditable || isEditingShare"
            ref="shareInputRef"
            v-model.number="localShare"
            type="number"
            min="0"
            max="100"
            placeholder="0%"
            class="w-12 text-sm font-satoshi text-right border-b pb-1 focus:outline-none bg-transparent"
            :class="shareExceeds100 ? 'text-error border-error' : 'text-ditto-blue border-faded-grey focus:border-brand-secondary'"
            @input="isEditable ? emitUpdate() : null"
            @keydown.enter="isEditable ? handleShareComplete() : saveShareEdit()"
            @keydown.tab="isEditable ? handleShareComplete() : null"
            @keydown.escape="cancelShareEdit"
          />
          <span v-else class="text-sm font-satoshi" :class="status === 'rejected' ? 'text-error line-through' : 'text-ditto-blue'">{{ share }}</span>
          <span class="text-sm font-satoshi" :class="shareExceeds100 || status === 'rejected' ? 'text-error' : 'text-ditto-grey'" :style="status === 'rejected' ? 'text-decoration: line-through' : ''">%</span>
        </div>
        <p v-if="(isEditable || isEditingShare) && shareExceeds100" class="text-[10px] text-error font-satoshi mt-1 whitespace-nowrap">
          Exceeds 100%
        </p>
        <!-- Save/Cancel buttons when editing share -->
        <div v-if="isEditingShare" class="flex items-center gap-1 mt-1.5 justify-end">
          <button
            @click="saveShareEdit"
            :disabled="shareExceeds100 || localShare === share"
            class="px-2 py-0.5 text-[10px] font-medium rounded bg-brand-secondary text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save
          </button>
          <button
            @click="cancelShareEdit"
            class="px-2 py-0.5 text-[10px] font-medium rounded border border-faded-grey text-ditto-grey hover:border-ditto-grey"
          >
            Cancel
          </button>
        </div>
      </div>

      <!-- Status indicator with tooltip -->
      <div v-if="status && !isEditable && !isEditingShare" class="flex flex-col items-center min-w-[80px] relative group">
        <div
          class="w-2.5 h-2.5 rounded-full mb-1"
          :class="statusDotClass"
        />
        <span class="text-xs font-satoshi text-center leading-tight cursor-help" :class="status === 'rejected' ? 'text-error' : 'text-ditto-grey'">
          {{ statusText }}
        </span>
        <!-- Tooltip -->
        <div v-if="statusTooltip" class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-ditto-blue text-white text-[10px] rounded-lg w-48 text-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 shadow-lg">
          {{ statusTooltip }}
          <div class="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-ditto-blue" />
        </div>
      </div>

      <!-- Action buttons -->
      <div class="flex items-center gap-1">
        <!-- Edit share icon (for active or rejected splits) -->
        <div v-if="!isEditable && !isEditingShare && (status === 'active' || status === 'rejected')" class="relative group">
          <button
            @click="startShareEdit"
            class="p-1.5 text-ditto-grey hover:text-brand-secondary transition-colors"
          >
            <EditIcon />
          </button>
          <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-ditto-blue text-white text-[10px] rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
            {{ status === 'rejected' ? 'Edit & resend offer' : 'Edit share' }}
          </div>
        </div>

        <!-- Resend confirmation (for pending splits) -->
        <div v-if="!isEditable && status === 'pending'" class="relative group">
          <button
            @click="$emit('resend')"
            class="p-1.5 text-ditto-grey hover:text-brand-secondary transition-colors"
          >
            <SendIcon />
          </button>
          <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-ditto-blue text-white text-[10px] rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
            Resend confirmation email
          </div>
        </div>

        <!-- Delete button -->
        <div class="relative group">
          <button
            @click="$emit('remove')"
            class="p-1.5 text-error hover:text-error/80 transition-colors"
          >
            <TrashIcon />
          </button>
          <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-ditto-blue text-white text-[10px] rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
            Remove split
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Mobile layout -->
  <div class="sm:hidden flex flex-col gap-3 py-3">
    <!-- Row 1: Name and Share -->
    <div class="flex gap-3">
      <div class="flex-1 relative">
        <label class="block text-xs text-ditto-grey mb-1 font-satoshi">Name:</label>
        <input
          v-if="isEditable"
          v-model="localName"
          type="text"
          placeholder="Name"
          class="w-full text-sm text-ditto-blue font-satoshi border-b border-faded-grey pb-1 focus:border-brand-secondary focus:outline-none bg-transparent"
          @input="handleNameInput"
          @focus="showAutocomplete = filteredCollaborators.length > 0"
          @blur="hideAutocompleteDelayed"
        />
        <span v-else class="text-sm text-ditto-blue font-satoshi">{{ name }}</span>
        
        <!-- Mobile autocomplete dropdown -->
        <div
          v-if="isEditable && showAutocomplete && filteredCollaborators.length > 0"
          class="absolute top-full left-0 right-0 mt-1 bg-white border border-faded-grey rounded-lg shadow-lg py-1 z-20 max-h-32 overflow-y-auto"
        >
          <button
            v-for="collab in filteredCollaborators"
            :key="collab.email"
            type="button"
            class="w-full px-3 py-2 text-left text-sm font-satoshi text-ditto-blue hover:bg-light-grey transition-colors"
            @mousedown.prevent="selectCollaborator(collab)"
          >
            <span class="font-medium">{{ collab.name }}</span>
          </button>
        </div>
      </div>
      <div class="w-16 shrink-0">
        <label class="block text-xs text-ditto-grey mb-1 font-satoshi">{{ shareLabel }}</label>
        <div class="flex items-center gap-1">
          <input
            v-if="isEditable"
            v-model.number="localShare"
            type="number"
            min="0"
            max="100"
            placeholder="0"
            class="w-10 text-sm font-satoshi text-right border-b pb-1 focus:outline-none bg-transparent"
            :class="shareExceeds100 ? 'text-error border-error' : 'text-ditto-blue border-faded-grey focus:border-brand-secondary'"
            @input="emitUpdate"
            @keydown.enter="handleShareComplete"
            @keydown.tab="handleShareComplete"
          />
          <span v-else class="text-sm text-ditto-blue font-satoshi">{{ share }}</span>
          <span class="text-sm font-satoshi" :class="shareExceeds100 ? 'text-error' : 'text-ditto-grey'">%</span>
        </div>
        <p v-if="isEditable && shareExceeds100" class="text-[10px] text-error font-satoshi mt-1">
          Exceeds 100%
        </p>
      </div>
    </div>

    <!-- Row 2: Email -->
    <div>
      <label class="block text-xs text-ditto-grey mb-1 font-satoshi">Email*</label>
      <input
        v-if="isEditable"
        v-model="localEmail"
        type="email"
        placeholder="Email address"
        class="w-full text-sm text-ditto-blue font-satoshi border-b border-faded-grey pb-1 focus:border-brand-secondary focus:outline-none bg-transparent"
        @input="emitUpdate"
      />
      <span v-else class="text-sm text-ditto-blue font-satoshi">{{ email }}</span>
    </div>

    <!-- Row 3: Status and actions (only for non-editable) -->
    <div v-if="!isEditable" class="flex items-center justify-between">
      <!-- Status indicator -->
      <div v-if="status" class="flex items-center gap-2">
        <div
          class="w-2 h-2 rounded-full"
          :class="statusDotClass"
        />
        <span class="text-xs text-ditto-grey font-satoshi">
          {{ mobileStatusText }}
        </span>
      </div>
      <div v-else />

      <!-- Action buttons -->
      <div class="flex items-center gap-1">
        <button
          v-if="status === 'active' || status === 'rejected'"
          @click="$emit('edit-share')"
          class="p-1.5 text-ditto-grey hover:text-brand-secondary transition-colors"
        >
          <EditIcon />
        </button>
        <button
          v-if="status === 'pending'"
          @click="$emit('resend')"
          class="p-1.5 text-ditto-grey hover:text-brand-secondary transition-colors"
        >
          <SendIcon />
        </button>
        <button
          @click="$emit('remove')"
          class="p-1.5 text-error hover:text-error/80 transition-colors"
        >
          <TrashIcon />
        </button>
      </div>
    </div>

    <!-- Row 3 for editable: just the delete button -->
    <div v-else class="flex justify-end">
      <button
        @click="$emit('remove')"
        class="p-1.5 text-error hover:text-error/80 transition-colors"
      >
        <TrashIcon />
      </button>
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
  name: string
  email: string
  share: number
  status?: SplitStatus
  activeSince?: string
  shareIndex?: number
  isEditable?: boolean
  canEditEmail?: boolean
  knownCollaborators?: KnownCollaborator[]
  currentTotalShare?: number // Total share already allocated (excluding this row)
}>(), {
  isEditable: false,
  canEditEmail: false,
  knownCollaborators: () => [],
  currentTotalShare: 0
})

const emit = defineEmits<{
  update: [{ name: string; email: string; share: number }]
  remove: []
  'edit-share': []
  'update-share': [newShare: number]
  complete: []
  resend: []
}>()

const nameInputRef = ref<HTMLInputElement | null>(null)
const shareInputRef = ref<HTMLInputElement | null>(null)
const localName = ref(props.name)
const localEmail = ref(props.email)
const localShare = ref(props.share)
const showAutocomplete = ref(false)
const highlightedIndex = ref(-1)
const isEditingShare = ref(false)

watch(() => props.name, (val) => { localName.value = val })
watch(() => props.email, (val) => { localEmail.value = val })
watch(() => props.share, (val) => { localShare.value = val })

// Inline validation: check if share exceeds 100%
const shareExceeds100 = computed(() => {
  return props.currentTotalShare + (localShare.value || 0) > 100
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

// Share editing
const startShareEdit = () => {
  localShare.value = props.share
  isEditingShare.value = true
  nextTick(() => {
    shareInputRef.value?.focus()
    shareInputRef.value?.select()
  })
}

const saveShareEdit = () => {
  if (!shareExceeds100.value && localShare.value !== props.share) {
    emit('update-share', localShare.value)
  }
  isEditingShare.value = false
}

const cancelShareEdit = () => {
  localShare.value = props.share
  isEditingShare.value = false
}

// Check if row is complete (valid for adding)
const isRowComplete = computed(() => {
  return localName.value.trim() !== '' && 
         localEmail.value.trim() !== '' && 
         localShare.value > 0 &&
         !shareExceeds100.value
})

const handleShareComplete = () => {
  if (props.isEditable && isRowComplete.value) {
    emit('complete')
  }
}

const shareLabel = computed(() => {
  if (props.shareIndex !== undefined) {
    return `Share #${props.shareIndex}`
  }
  return 'Share'
})

const statusDotClass = computed(() => {
  switch (props.status) {
    case 'active': return 'bg-success'
    case 'pending': return 'bg-amber-500'
    case 'rejected': return 'bg-error'
    default: return 'bg-ditto-grey'
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
    default:
      return ''
  }
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
      return "The collaborator hasn't accepted their share via email yet."
    case 'rejected':
      return 'The collaborator declined this split offer. Edit to send a new offer.'
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
