<template>
  <Teleport to="body">
    <div
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]"
      @click="$emit('close')"
    >
      <div
        class="bg-white rounded-2xl w-full sm:w-[520px] max-w-[95vw] max-h-[90vh] shadow-xl mx-2 sm:mx-0 flex flex-col"
        @click.stop
      >
        <!-- Sticky header -->
        <div class="p-4 sm:p-6 pb-0 shrink-0">
          <h2 class="text-lg sm:text-xl font-bold text-ditto-blue font-poppins mb-4">
            Copy Splits
          </h2>
          
          <!-- Step 1: Select source track (if mode allows) -->
          <template v-if="mode === 'select-source'">
            <p class="text-sm text-ditto-grey font-satoshi mb-3">
              Select a track to copy splits from:
            </p>
            <div class="flex flex-wrap gap-2 mb-4 max-h-32 overflow-y-auto">
              <button
                v-for="track in sourceTracks"
                :key="track.trackId"
                @click="selectSourceTrack(track)"
                class="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium font-satoshi cursor-pointer transition-all border"
                :class="selectedSourceTrack?.trackId === track.trackId 
                  ? 'border-brand-secondary bg-brand-secondary/10 text-brand-secondary' 
                  : 'border-faded-grey bg-light-grey text-ditto-blue hover:border-brand-secondary/50'"
              >
                <span class="text-xs opacity-60">{{ track.trackNumber }}.</span>
                <span class="truncate max-w-[160px]">{{ track.trackName }}</span>
                <span class="text-[10px] opacity-60">({{ track.splits.length }} split{{ track.splits.length !== 1 ? 's' : '' }})</span>
              </button>
            </div>
          </template>
          
          <!-- Source preview (when source is selected) -->
          <div v-if="selectedSourceTrack" class="mb-4">
            <p class="text-sm text-ditto-grey font-satoshi mb-2">
              Copying from <strong class="text-ditto-blue">{{ selectedSourceTrack.trackName }}</strong>
            </p>
            
            <!-- Splits being copied -->
            <div class="flex flex-wrap gap-1.5">
              <!-- You -->
              <span class="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-brand-secondary/10 text-xs font-satoshi text-brand-secondary">
                <span class="font-medium">You</span>
                <span>{{ selectedSourceTrack.userShare }}%</span>
              </span>
              <!-- Collaborators -->
              <span 
                v-for="split in selectedSourceTrack.splits" 
                :key="split.id"
                class="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-success/10 text-xs font-satoshi text-success"
              >
                <span class="font-medium">{{ split.name }}</span>
                <span>{{ split.share }}%</span>
              </span>
            </div>
          </div>

          <!-- Select header row (target tracks) -->
          <div v-if="selectedSourceTrack" class="flex items-center justify-between mb-3">
            <p class="text-sm font-semibold text-ditto-blue font-satoshi">Select tracks to copy to:</p>
            <button 
              @click="toggleSelectAll"
              class="text-xs font-medium text-brand-secondary hover:underline font-satoshi"
            >
              {{ allSelected ? 'Deselect all' : 'Select all' }}
            </button>
          </div>
        </div>

        <!-- Scrollable track list (target tracks) -->
        <div v-if="selectedSourceTrack" class="flex-1 overflow-y-auto px-4 sm:px-6 min-h-0">
          <div class="flex flex-wrap gap-2 pb-4">
            <button
              v-for="track in availableTargetTracks"
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
              
              <!-- Existing splits indicator - more prominent -->
              <span 
                v-if="track.splits.length > 0" 
                class="relative group/badge inline-flex items-center gap-0.5 text-[10px] font-bold text-error bg-error/15 px-1.5 py-0.5 rounded shrink-0 cursor-help"
              >
                <svg width="10" height="10" viewBox="0 0 16 16" fill="none" class="shrink-0">
                  <path d="M8 5V8.5M8 11V11.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
                {{ track.splits.length }}
                <span class="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-ditto-blue text-white text-[10px] rounded whitespace-nowrap opacity-0 group-hover/badge:opacity-100 transition-opacity pointer-events-none z-20">
                  Will replace {{ track.splits.length }} existing split{{ track.splits.length > 1 ? 's' : '' }}
                </span>
              </span>
            </button>
          </div>
        </div>
        
        <!-- Confirmation warning for tracks with existing splits -->
        <div v-if="selectedSourceTrack && selectedHaveConflicts" class="px-4 sm:px-6 pb-4">
          <div class="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl">
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" class="shrink-0 text-amber-600 mt-0.5">
              <path d="M10 6V10M10 14H10.01M18 10C18 14.4183 14.4183 18 10 18C5.58172 18 2 14.4183 2 10C2 5.58172 5.58172 2 10 2C14.4183 2 18 5.58172 18 10Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <p class="text-xs text-amber-800 font-satoshi">
              <strong>{{ conflictCount }} track{{ conflictCount > 1 ? 's have' : ' has' }} existing splits.</strong>
              Confirming will replace them with the new splits.
            </p>
          </div>
        </div>

        <!-- Sticky footer with actions -->
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
              :disabled="!selectedSourceTrack || selectedTracks.size === 0"
              class="px-6 py-2.5 bg-ditto-blue text-white rounded-full text-sm font-semibold font-satoshi transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-ditto-blue/90"
            >
              Copy to {{ selectedTracks.size }} track{{ selectedTracks.size !== 1 ? 's' : '' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import type { TrackSplit, Collaborator } from '../../types'

const props = withDefaults(defineProps<{
  // Mode: 'select-source' shows source track picker, 'copy-to' uses pre-selected source
  mode?: 'select-source' | 'copy-to'
  // All tracks with splits (for source selection)
  sourceTracks?: TrackSplit[]
  // Pre-selected source (for copy-to mode - legacy support)
  sourceTrackName?: string
  sourceUserShare?: number
  sourceSplits?: Collaborator[]
  // All tracks that can be targets
  targetTracks: TrackSplit[]
  // Current track to exclude from targets (optional)
  currentTrackId?: string
}>(), {
  mode: 'copy-to',
  sourceTracks: () => []
})

const emit = defineEmits<{
  close: []
  confirm: [mode: 'replace', selectedTrackIds: string[], sourceTrackId?: string]
}>()

const selectedTracks = ref<Set<string>>(new Set())
const selectedSourceTrack = ref<TrackSplit | null>(null)

// For legacy mode, create a virtual source track
onMounted(() => {
  if (props.mode === 'copy-to' && props.sourceTrackName) {
    selectedSourceTrack.value = {
      trackId: 'legacy-source',
      trackNumber: 0,
      trackName: props.sourceTrackName,
      userShare: props.sourceUserShare ?? 100,
      splits: props.sourceSplits ?? []
    }
  }
  // Pre-select all target tracks
  availableTargetTracks.value.forEach(t => selectedTracks.value.add(t.trackId))
})

// Filter out the source track from available targets
const availableTargetTracks = computed(() => {
  const sourceId = selectedSourceTrack.value?.trackId
  return props.targetTracks.filter(t => 
    t.trackId !== sourceId && 
    t.trackId !== props.currentTrackId
  )
})

// When source track changes, update target selection
watch(selectedSourceTrack, (newSource) => {
  if (newSource) {
    selectedTracks.value = new Set()
    availableTargetTracks.value.forEach(t => selectedTracks.value.add(t.trackId))
  }
})

const selectSourceTrack = (track: TrackSplit) => {
  selectedSourceTrack.value = track
}

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
  selectedTracks.value.size === availableTargetTracks.value.length
)

const toggleSelectAll = () => {
  if (allSelected.value) {
    selectedTracks.value = new Set()
  } else {
    selectedTracks.value = new Set(availableTargetTracks.value.map(t => t.trackId))
  }
}

const selectedHaveConflicts = computed(() => 
  availableTargetTracks.value
    .filter(t => selectedTracks.value.has(t.trackId))
    .some(t => t.splits.length > 0)
)

const conflictCount = computed(() =>
  availableTargetTracks.value
    .filter(t => selectedTracks.value.has(t.trackId) && t.splits.length > 0)
    .length
)

const handleConfirm = () => {
  const sourceId = selectedSourceTrack.value?.trackId !== 'legacy-source' 
    ? selectedSourceTrack.value?.trackId 
    : undefined
  emit('confirm', 'replace', Array.from(selectedTracks.value), sourceId)
}
</script>
