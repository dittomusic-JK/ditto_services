<template>
  <Teleport to="body">
    <div
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]"
      @click="$emit('close')"
    >
      <div
        class="bg-white rounded-2xl w-full sm:w-[480px] max-w-[95vw] max-h-[90vh] shadow-xl mx-2 sm:mx-0 flex flex-col"
        @click.stop
      >
        <!-- Header -->
        <div class="p-4 sm:p-6 pb-0 shrink-0">
          <h2 class="text-lg sm:text-xl font-bold text-ditto-blue font-poppins mb-2">
            Edit Email
          </h2>
          
          <p class="text-sm text-ditto-grey font-satoshi mb-4">
            Update the email for <strong class="text-ditto-blue">{{ collaboratorName }}</strong>
          </p>
          
          <!-- New email input -->
          <div class="mb-4">
            <label class="block text-xs text-ditto-grey mb-1 font-satoshi">New email address</label>
            <input
              v-model="newEmail"
              type="email"
              :placeholder="currentEmail"
              class="w-full px-4 py-2.5 border border-faded-grey rounded-xl text-sm text-ditto-blue font-satoshi focus:border-brand-secondary focus:outline-none"
              @keydown.enter="handleConfirm"
            />
            <p v-if="emailError" class="text-xs text-error font-satoshi mt-1">{{ emailError }}</p>
          </div>

          <!-- Track selection header -->
          <div class="flex items-center justify-between mb-3">
            <p class="text-sm font-semibold text-ditto-blue font-satoshi">
              Update on these tracks:
            </p>
            <button 
              @click="toggleSelectAll"
              class="text-xs font-medium text-brand-secondary hover:underline font-satoshi"
            >
              {{ allSelected ? 'Deselect all' : 'Select all' }}
            </button>
          </div>
        </div>

        <!-- Scrollable track list -->
        <div class="flex-1 overflow-y-auto px-4 sm:px-6 min-h-0">
          <div class="flex flex-wrap gap-2 pb-4">
            <button
              v-for="track in tracksWithCollaborator"
              :key="track.trackId"
              @click="toggleTrack(track.trackId)"
              class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium font-satoshi cursor-pointer transition-all border"
              :class="selectedTracks.has(track.trackId) 
                ? 'border-brand-secondary bg-brand-secondary/10 text-brand-secondary' 
                : 'border-faded-grey bg-light-grey text-ditto-grey hover:border-brand-secondary/50'"
            >
              <!-- Small checkmark when selected -->
              <svg 
                v-if="selectedTracks.has(track.trackId)" 
                width="12" height="12" viewBox="0 0 24 24" fill="none"
                class="shrink-0"
              >
                <path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              
              <!-- Track number + name -->
              <span class="text-xs opacity-60">{{ track.trackNumber }}.</span>
              <span class="truncate max-w-[140px] sm:max-w-[180px]">{{ track.trackName }}</span>
            </button>
          </div>
        </div>

        <!-- Footer with actions -->
        <div class="p-4 sm:p-6 pt-3 border-t border-faded-grey shrink-0 bg-white rounded-b-2xl">
          <div class="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3">
            <button
              @click="$emit('close')"
              class="px-6 py-2.5 border border-faded-grey rounded-full text-sm font-semibold text-ditto-grey font-satoshi hover:border-ditto-blue hover:text-ditto-blue transition-colors"
            >
              Cancel
            </button>
            <button
              @click="handleConfirm"
              :disabled="!canConfirm"
              class="px-6 py-2.5 bg-ditto-blue text-white rounded-full text-sm font-semibold font-satoshi transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-ditto-blue/90"
            >
              Update Email
            </button>
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
