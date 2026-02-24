<template>
  <Teleport to="body">
    <div class="csm-overlay" @click="$emit('close')">
      <div class="csm" @click.stop>
        <!-- Header -->
        <div class="csm__head">
          <h2 class="csm__title">Copy Splits</h2>

          <template v-if="mode === 'select-source'">
            <p class="csm__desc">Select a track to copy splits from{{ currentTrackName ? ` to "${currentTrackName}"` : '' }}:</p>
            <div class="csm__chips csm__chips--scroll">
              <button
                v-for="track in sourceTracks"
                :key="track.trackId"
                @click="selectSourceTrack(track)"
                class="csm__chip" :class="{ 'csm__chip--sel': selectedSourceTrack?.trackId === track.trackId }"
              >
                <span class="csm__chip-num">{{ track.trackNumber }}.</span>
                <span class="csm__chip-name">{{ track.trackName }}</span>
                <span class="csm__chip-meta">({{ track.splits.length }} split{{ track.splits.length !== 1 ? 's' : '' }})</span>
              </button>
            </div>
          </template>

          <div v-if="selectedSourceTrack" class="csm__preview">
            <p class="csm__desc">Copying from <strong class="csm__strong">{{ selectedSourceTrack.trackName }}</strong></p>
            <div class="csm__tags">
              <span class="csm__tag csm__tag--you"><span class="csm__tag-b">You</span> {{ selectedSourceTrack.userShare }}%</span>
              <span v-for="split in selectedSourceTrack.splits" :key="split.id" class="csm__tag csm__tag--collab">
                <span class="csm__tag-b">{{ split.name }}</span> {{ split.share }}%
              </span>
            </div>
          </div>

          <div v-if="selectedSourceTrack && !isSingleTargetMode" class="csm__sel-header">
            <p class="csm__sel-label">Select tracks to copy to:</p>
            <button @click="toggleSelectAll" class="csm__sel-toggle">{{ allSelected ? 'Deselect all' : 'Select all' }}</button>
          </div>
        </div>

        <!-- Scrollable target list -->
        <div v-if="selectedSourceTrack && !isSingleTargetMode" class="csm__body">
          <div class="csm__chips">
            <button
              v-for="track in availableTargetTracks"
              :key="track.trackId"
              @click="toggleTrack(track.trackId)"
              class="csm__chip csm__chip--sm" :class="{ 'csm__chip--sel': selectedTracks.has(track.trackId) }"
            >
              <span class="csm__check" :class="{ 'csm__check--on': selectedTracks.has(track.trackId) }">
                <svg v-if="selectedTracks.has(track.trackId)" width="10" height="10" viewBox="0 0 24 24" fill="none">
                  <path d="M20 6L9 17L4 12" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </span>
              <span class="csm__chip-num">{{ track.trackNumber }}.</span>
              <span class="csm__chip-name csm__chip-name--target">{{ track.trackName }}</span>
              <span v-if="track.splits.length > 0" class="csm__conflict">
                <svg width="10" height="10" viewBox="0 0 16 16" fill="none" class="csm__conflict-icon">
                  <path d="M8 5V8.5M8 11V11.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
                {{ track.splits.length }}
                <span class="csm__conflict-tip">Will replace {{ track.splits.length }} existing split{{ track.splits.length > 1 ? 's' : '' }}</span>
              </span>
            </button>
          </div>
        </div>

        <!-- Warnings -->
        <div v-if="selectedSourceTrack && isSingleTargetMode && currentTrackHasSplits" class="csm__warn-wrap">
          <div class="csm__warn">
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" class="csm__warn-icon">
              <path d="M10 6V10M10 14H10.01M18 10C18 14.4183 14.4183 18 10 18C5.58172 18 2 14.4183 2 10C2 5.58172 5.58172 2 10 2C14.4183 2 18 5.58172 18 10Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <p class="csm__warn-text"><strong>This track has existing splits.</strong> Confirming will replace them with the new splits.</p>
          </div>
        </div>
        <div v-if="selectedSourceTrack && !isSingleTargetMode && selectedHaveConflicts" class="csm__warn-wrap">
          <div class="csm__warn">
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" class="csm__warn-icon">
              <path d="M10 6V10M10 14H10.01M18 10C18 14.4183 14.4183 18 10 18C5.58172 18 2 14.4183 2 10C2 5.58172 5.58172 2 10 2C14.4183 2 18 5.58172 18 10Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <p class="csm__warn-text"><strong>{{ conflictCount }} track{{ conflictCount > 1 ? 's have' : ' has' }} existing splits.</strong> Confirming will replace them with the new splits.</p>
          </div>
        </div>

        <!-- Footer -->
        <div class="csm__foot">
          <div class="csm__foot-row">
            <button @click="$emit('close')" class="csm__btn-cancel">Cancel</button>
            <button @click="handleConfirm" :disabled="!selectedSourceTrack || (!isSingleTargetMode && selectedTracks.size === 0)" class="csm__btn-confirm">
              {{ isSingleTargetMode ? 'Copy Splits' : `Copy to ${selectedTracks.size} track${selectedTracks.size !== 1 ? 's' : ''}` }}
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
  // Current track ID - when provided in select-source mode, copy directly to this track only
  currentTrackId?: string
}>(), {
  mode: 'copy-to',
  sourceTracks: () => []
})

// Single target mode: when currentTrackId is provided in select-source mode, we copy directly to that track
const isSingleTargetMode = computed(() => props.mode === 'select-source' && !!props.currentTrackId)

// Get current track name for display
const currentTrackName = computed(() => {
  if (!props.currentTrackId) return null
  const track = props.targetTracks.find(t => t.trackId === props.currentTrackId)
  return track?.trackName ?? null
})

// Check if current track has existing splits (for warning)
const currentTrackHasSplits = computed(() => {
  if (!props.currentTrackId) return false
  const track = props.targetTracks.find(t => t.trackId === props.currentTrackId)
  return (track?.splits.length ?? 0) > 0
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
  const targetIds = isSingleTargetMode.value && props.currentTrackId
    ? [props.currentTrackId]
    : Array.from(selectedTracks.value)
  emit('confirm', 'replace', targetIds, sourceId)
}
</script>

<style lang="scss" scoped>
@mixin modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

@mixin modal-card($w: 520px) {
  background: #fff;
  border-radius: $radius-card;
  width: 100%;
  max-width: 95vw;
  max-height: 90vh;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  margin: 0 0.5rem;
  display: flex;
  flex-direction: column;

  @include sm {
    width: $w;
    margin: 0;
  }
}

@mixin btn-cancel {
  padding: 0.625rem 1.5rem;
  border: 1px solid var(--faded-grey);
  border-radius: $radius-button;
  font-size: $text-sm;
  font-weight: 600;
  color: var(--ditto-grey);
  font-family: $font-satoshi;
  transition: border-color 0.15s, color 0.15s;

  &:hover {
    border-color: var(--blue);
    color: var(--blue);
  }
}

@mixin btn-primary {
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

.csm-overlay { @include modal-overlay; }

.csm {
  @include modal-card;

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
    margin-bottom: 1rem;

    @include sm { font-size: $text-h3; }
  }

  &__desc {
    font-size: $text-sm;
    color: var(--ditto-grey);
    font-family: $font-satoshi;
    margin-bottom: 0.75rem;
  }

  &__strong { color: var(--blue); }

  &__chips {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 1rem;

    &--scroll { max-height: 8rem; overflow-y: auto; }
  }

  &__chip {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.5rem 0.75rem;
    border-radius: $radius-lg;
    font-size: $text-sm;
    font-weight: 500;
    font-family: $font-satoshi;
    cursor: pointer;
    transition: all 0.15s;
    border: 1px solid var(--faded-grey);
    background: var(--light-grey);
    color: var(--blue);

    &:hover { border-color: rgba($color-brand-secondary, 0.5); }

    &--sel {
      border-color: var(--brand-secondary);
      background: rgba($color-brand-secondary, 0.1);
      color: var(--brand-secondary);
    }

    &--sm { padding: 0.375rem 0.75rem; }
  }

  &__chip-num { font-size: $text-xs; opacity: 0.6; }
  &__chip-name {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 160px;

    &--target {
      max-width: 140px;
      @include sm { max-width: 180px; }
    }
  }
  &__chip-meta { font-size: 10px; opacity: 0.6; }

  &__check {
    flex-shrink: 0;
    width: 1rem;
    height: 1rem;
    border-radius: 50%;
    border: 2px solid rgba($color-ditto-purple, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.15s;
    background: transparent;

    &--on {
      border-color: var(--brand-secondary);
      background: var(--brand-secondary);
    }
  }

  &__preview { margin-bottom: 1rem; }

  &__tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.375rem;
  }

  &__tag {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.25rem 0.5rem;
    border-radius: 0.375rem;
    font-size: $text-xs;
    font-family: $font-satoshi;

    &--you {
      background: rgba($color-brand-secondary, 0.1);
      color: var(--brand-secondary);
    }

    &--collab {
      background: rgba($color-success, 0.1);
      color: var(--success);
    }
  }

  &__tag-b { font-weight: 500; }

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

  &__conflict {
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: 0.125rem;
    font-size: 10px;
    font-weight: 700;
    color: var(--error);
    background: rgba($color-error, 0.15);
    padding: 0.125rem 0.375rem;
    border-radius: 0.25rem;
    flex-shrink: 0;
    cursor: help;

    &:hover > .csm__conflict-tip { opacity: 1; }
  }

  &__conflict-icon { flex-shrink: 0; }

  &__conflict-tip {
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    margin-bottom: 0.25rem;
    padding: 0.25rem 0.5rem;
    background: var(--blue);
    color: #fff;
    font-size: 10px;
    font-weight: 400;
    border-radius: 0.25rem;
    white-space: nowrap;
    opacity: 0;
    transition: opacity 0.15s;
    pointer-events: none;
    z-index: 20;
  }

  &__warn-wrap {
    padding: 0 1rem 1rem;
    @include sm { padding: 0 1.5rem 1rem; }
  }

  &__warn {
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
    padding: 0.75rem;
    background: $color-amber-50;
    border: 1px solid $color-amber-100;
    border-radius: $radius-card;
  }

  &__warn-icon {
    flex-shrink: 0;
    color: $color-amber-600;
    margin-top: 0.125rem;
  }

  &__warn-text {
    font-size: $text-xs;
    color: $color-amber-800;
    font-family: $font-satoshi;
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

  &__btn-cancel { @include btn-cancel; }
  &__btn-confirm { @include btn-primary; }
}
</style>
