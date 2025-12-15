<template>
  <div class="w-full max-w-[820px] px-2 sm:px-4 md:px-0 flex flex-col gap-5 min-h-screen">
    <!-- Page header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <button 
          class="flex items-center gap-1 text-sm text-ditto-grey font-satoshi hover:text-ditto-blue transition-colors mb-2"
          @click="$emit('back')"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 12L6 8L10 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Back
        </button>
        <h1 class="text-xl font-bold text-ditto-blue font-poppins">
          Royalty Splits
        </h1>
      </div>
      
      <!-- Legend (hidden on mobile, shown in header on larger screens) -->
      <div class="hidden sm:flex items-center gap-4 text-xs font-satoshi">
        <div class="flex items-center gap-1.5">
          <div class="w-2.5 h-2.5 rounded-full bg-brand-secondary" />
          <span class="text-ditto-grey">Yours</span>
        </div>
        <div class="flex items-center gap-1.5">
          <div class="w-2.5 h-2.5 rounded-full bg-success" />
          <span class="text-ditto-grey">Collaborators</span>
        </div>
        <div class="flex items-center gap-1.5">
          <div class="w-2.5 h-2.5 rounded-full bg-amber-400" />
          <span class="text-ditto-grey">Pending</span>
        </div>
      </div>
    </div>

    <!-- Release header with progress -->
    <ReleaseHeader
      :title="release.title"
      :artwork="release.artwork"
      :account-holder="release.accountHolder"
      :user-type="userType"
      :total-tracks="release.tracks.length"
      :tracks-with-splits="tracksWithSplits.length"
    />

    <!-- Empty state - no splits configured yet -->
    <div 
      v-if="tracksWithSplits.length === 0"
      class="bg-white rounded-2xl border-2 border-dashed border-faded-grey p-8 text-center"
    >
      <div class="w-12 h-12 rounded-full bg-ditto-purple/10 flex items-center justify-center mx-auto mb-4">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H6C4.93913 15 3.92172 15.4214 3.17157 16.1716C2.42143 16.9217 2 17.9391 2 19V21" stroke="#6C5CE7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <circle cx="9" cy="7" r="4" stroke="#6C5CE7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M19 8V14M16 11H22" stroke="#6C5CE7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <h3 class="text-base font-semibold text-ditto-blue font-satoshi mb-2">
        No splits configured yet
      </h3>
      <p class="text-sm text-ditto-grey font-satoshi mb-4 max-w-sm mx-auto">
        Add collaborators to share royalties from this release. Click "Add Split" on any track below to get started.
      </p>
    </div>

    <!-- Unified track list in natural order -->
    <TrackGroup
      :tracks="sortedTracks"
      :expanded-track-id="expandedTrackId"
      :release="release"
      :pending-changes="pendingChanges"
      :known-collaborators="knownCollaborators"
      @toggle="toggleTrack"
      @save="handleSave"
      @add-split="handleAddSplit"
      @remove-split="handleRemoveSplit"
      @update-share="handleUpdateShare"
      @resend-confirmation="handleResendConfirmation"
      @copy-from="handleCopyFrom"
      @copy-to="openCopyToModal"
    />

    <!-- Copy Splits Modal -->
    <CopySplitsModal
      v-if="copyModal.show"
      :source-track-name="copyModal.sourceTrackName"
      :source-user-share="copyModal.sourceUserShare"
      :source-splits="copyModal.sourceSplits"
      :target-tracks="copyModal.targetTracks"
      @close="copyModal.show = false"
      @confirm="handleCopyConfirm"
    />

    <!-- First Split Onboarding Modal -->
    <FirstSplitModal
      v-if="showFirstSplitModal"
      :other-tracks-count="tracksWithoutSplits.length"
      @close="showFirstSplitModal = false"
      @copy-to-all="handleCopyFromFirstSplit"
    />

    <!-- Toast notification -->
    <Toast
      :visible="toast.visible"
      :message="toast.message"
      :type="toast.type"
      @close="toast.visible = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import type { UserType, Release, TrackSplit, Collaborator } from '../../types'
import ReleaseHeader from './ReleaseHeader.vue'
import TrackGroup from './TrackGroup.vue'
import CopySplitsModal from './CopySplitsModal.vue'
import FirstSplitModal from './FirstSplitModal.vue'
import Toast from '../ui/Toast.vue'

const props = withDefaults(defineProps<{
  userType?: UserType
  demo?: 'populated' | 'empty'
}>(), {
  userType: 'subscription',
  demo: 'populated'
})

defineEmits<{
  back: []
}>()

const expandedTrackId = ref<string | null>(null)
const pendingChanges = reactive<Record<string, boolean>>({})
const showFirstSplitModal = ref(false)
const hasShownFirstSplitModal = ref(false)
const lastSavedTrackId = ref<string | null>(null)

// Toast state
const toast = reactive<{
  visible: boolean
  message: string
  type: 'success' | 'info' | 'warning'
}>({
  visible: false,
  message: '',
  type: 'success'
})

let toastTimeout: ReturnType<typeof setTimeout> | null = null

const showToast = (message: string, type: 'success' | 'info' | 'warning' = 'success') => {
  if (toastTimeout) clearTimeout(toastTimeout)
  toast.message = message
  toast.type = type
  toast.visible = true
  toastTimeout = setTimeout(() => {
    toast.visible = false
  }, 3000)
}

// Known collaborators (in real app, this would come from API based on user's history)
const knownCollaborators = [
  { name: 'Rema', email: 'rema@mavin.com' },
  { name: 'Ayra Starr', email: 'ayra@mavin.com' },
  { name: 'Burna Boy', email: 'burna@spaceship.com' },
  { name: 'Wizkid', email: 'wiz@starboy.com' },
  { name: 'Tems', email: 'tems@leadingvibe.com' },
  { name: 'CKay', email: 'ckay@chocolatecity.com' },
  { name: 'Fireboy DML', email: 'fireboy@ybnl.com' },
  { name: 'Omah Lay', email: 'omah@keystoneagency.com' },
  { name: 'Asake', email: 'asake@ybnl.com' },
  { name: 'Primary Songwriter', email: 'songwriter@ascap.com' },
]

// Copy modal state
const copyModal = reactive<{
  show: boolean
  sourceTrackId: string
  sourceTrackName: string
  sourceUserShare: number
  sourceSplits: Collaborator[]
  targetTracks: TrackSplit[]
}>({
  show: false,
  sourceTrackId: '',
  sourceTrackName: '',
  sourceUserShare: 100,
  sourceSplits: [],
  targetTracks: []
})

// Empty release data
const emptyRelease: Release = {
  id: '1',
  title: 'Midnight Sessions EP',
  artwork: 'https://picsum.photos/seed/album2/400/400',
  accountHolder: 'Oluwafisayo Isa (me)',
  tracks: [
    { trackId: 't1', trackNumber: 1, trackName: 'Intro (Midnight)', splits: [], userShare: 100 },
    { trackId: 't2', trackNumber: 2, trackName: 'City Lights (feat. Rema)', splits: [], userShare: 100 },
    { trackId: 't3', trackNumber: 3, trackName: 'Euphoria', splits: [], userShare: 100 },
    { trackId: 't4', trackNumber: 4, trackName: 'Waiting', splits: [], userShare: 100 },
    { trackId: 't5', trackNumber: 5, trackName: 'Midnight Drive', splits: [], userShare: 100 },
    { trackId: 't6', trackNumber: 6, trackName: 'Lost in Translation', splits: [], userShare: 100 },
    { trackId: 't7', trackNumber: 7, trackName: 'Interlude', splits: [], userShare: 100 },
    { trackId: 't8', trackNumber: 8, trackName: 'Dreams (Remix)', splits: [], userShare: 100 },
    { trackId: 't9', trackNumber: 9, trackName: 'Your Song', splits: [], userShare: 100 },
    { trackId: 't10', trackNumber: 10, trackName: 'Outro (Until Dawn)', splits: [], userShare: 100 }
  ]
}

// Populated release data with diverse use cases
const populatedRelease: Release = {
  id: '1',
  title: 'Midnight Sessions EP',
  artwork: 'https://picsum.photos/seed/album2/400/400',
  accountHolder: 'Oluwafisayo Isa (me)',
  tracks: [
    // Track 1: No splits - 100% user
    {
      trackId: 't1',
      trackNumber: 1,
      trackName: 'Intro (Midnight)',
      splits: [],
      userShare: 100
    },
    // Track 2: Single confirmed collaborator
    {
      trackId: 't2',
      trackNumber: 2,
      trackName: 'City Lights (feat. Rema)',
      splits: [
        {
          id: 's1',
          name: 'Rema',
          email: 'rema@mavin.com',
          share: 25,
          status: 'active',
          activeSince: '17th April 2025'
        }
      ],
      userShare: 75
    },
    // Track 3: Multiple confirmed collaborators (production team)
    {
      trackId: 't3',
      trackNumber: 3,
      trackName: 'Euphoria',
      splits: [
        {
          id: 's2',
          name: 'DJ Tunez',
          email: 'tunez@starboy.com',
          share: 20,
          status: 'active',
          activeSince: '10th March 2025'
        },
        {
          id: 's3',
          name: 'P2J',
          email: 'p2j@production.com',
          share: 15,
          status: 'active',
          activeSince: '10th March 2025'
        }
      ],
      userShare: 65
    },
    // Track 4: Single pending split
    {
      trackId: 't4',
      trackNumber: 4,
      trackName: 'Waiting',
      splits: [
        {
          id: 's4',
          name: 'Ayra Starr',
          email: 'ayra@mavin.com',
          share: 30,
          status: 'pending'
        }
      ],
      userShare: 70
    },
    // Track 5: Mixed - some confirmed, some pending
    {
      trackId: 't5',
      trackNumber: 5,
      trackName: 'Midnight Drive',
      splits: [
        {
          id: 's5',
          name: 'Geri Adams',
          email: 'geri101@gmail.com',
          share: 20,
          status: 'active',
          activeSince: '5th May 2025'
        },
        {
          id: 's6',
          name: 'New Collaborator',
          email: 'newcollab@email.com',
          share: 15,
          status: 'pending'
        }
      ],
      userShare: 65
    },
    // Track 6: Multiple pending splits (new collaborators)
    {
      trackId: 't6',
      trackNumber: 6,
      trackName: 'Lost in Translation',
      splits: [
        {
          id: 's7',
          name: 'Bob Johnson',
          email: 'bob@example.com',
          share: 25,
          status: 'pending'
        },
        {
          id: 's8',
          name: 'Sarah Chen',
          email: 'sarah.chen@music.co',
          share: 25,
          status: 'pending'
        }
      ],
      userShare: 50
    },
    // Track 7: No splits yet
    {
      trackId: 't7',
      trackNumber: 7,
      trackName: 'Interlude',
      splits: [],
      userShare: 100
    },
    // Track 8: Small percentage splits (many collaborators)
    {
      trackId: 't8',
      trackNumber: 8,
      trackName: 'Dreams (Remix)',
      splits: [
        {
          id: 's9',
          name: 'Original Writer',
          email: 'writer@pub.com',
          share: 10,
          status: 'active',
          activeSince: '1st Jan 2025'
        },
        {
          id: 's10',
          name: 'Remix Producer',
          email: 'remixer@beats.io',
          share: 15,
          status: 'active',
          activeSince: '15th Feb 2025'
        },
        {
          id: 's11',
          name: 'Sample Clearance',
          email: 'legal@samples.net',
          share: 5,
          status: 'active',
          activeSince: '1st Jan 2025'
        }
      ],
      userShare: 70
    },
    // Track 9: Large split to collaborator (they're main writer)
    {
      trackId: 't9',
      trackNumber: 9,
      trackName: 'Your Song',
      splits: [
        {
          id: 's12',
          name: 'Primary Songwriter',
          email: 'songwriter@ascap.com',
          share: 60,
          status: 'active',
          activeSince: '20th April 2025'
        }
      ],
      userShare: 40
    },
    // Track 10: Rejected split (collaborator declined)
    {
      trackId: 't10',
      trackNumber: 10,
      trackName: 'Outro (Until Dawn)',
      splits: [
        {
          id: 's13',
          name: 'Former Collaborator',
          email: 'declined@email.com',
          share: 20,
          status: 'rejected'
        }
      ],
      userShare: 80
    }
  ]
}

// Select release based on demo prop
const release = reactive<Release>(props.demo === 'empty' ? emptyRelease : populatedRelease)

// Track grouping computed properties
const tracksWithConfirmedSplits = computed(() =>
  release.tracks.filter(t => 
    t.splits.length > 0 && t.splits.every(s => s.status === 'active')
  )
)

const tracksWithPendingSplits = computed(() =>
  release.tracks.filter(t => 
    t.splits.length > 0 && t.splits.some(s => s.status === 'pending' || s.status === 'rejected')
  )
)

const tracksWithoutSplits = computed(() =>
  release.tracks.filter(t => t.splits.length === 0)
)

const tracksWithSplits = computed(() =>
  release.tracks.filter(t => t.splits.length > 0)
)

const sortedTracks = computed(() =>
  [...release.tracks].sort((a, b) => a.trackNumber - b.trackNumber)
)

// Handlers
const toggleTrack = (trackId: string) => {
  expandedTrackId.value = expandedTrackId.value === trackId ? null : trackId
}

const getOtherTracksWithSplits = (currentTrackId: string): TrackSplit[] => {
  return release.tracks.filter(t => t.trackId !== currentTrackId && t.splits.length > 0)
}

const hasChangesForTrack = (trackId: string): boolean => {
  return pendingChanges[trackId] ?? false
}

const handleSave = (trackId: string) => {
  // Check if this is the first split being saved on the release
  const totalSplitsBeforeSave = release.tracks.reduce((sum, t) => sum + t.splits.length, 0)
  const isFirstSplit = totalSplitsBeforeSave === 1 && !hasShownFirstSplitModal.value
  
  pendingChanges[trackId] = false
  lastSavedTrackId.value = trackId
  
  // Show first split modal if this is the first one, otherwise show toast
  if (isFirstSplit) {
    hasShownFirstSplitModal.value = true
    showFirstSplitModal.value = true
  } else {
    showToast('Splits saved successfully')
  }
}

const handleAddSplit = (trackId: string, split: { name: string; email: string; share: number }) => {
  const track = release.tracks.find(t => t.trackId === trackId)
  if (track) {
    track.splits.push({
      id: `s${Date.now()}`,
      name: split.name,
      email: split.email,
      share: split.share,
      status: 'pending'
    })
    track.userShare = Math.max(0, 100 - track.splits.reduce((sum, s) => sum + s.share, 0))
    pendingChanges[trackId] = true
  }
}

const handleRemoveSplit = (trackId: string, splitId: string) => {
  const track = release.tracks.find(t => t.trackId === trackId)
  if (track) {
    const splitIndex = track.splits.findIndex(s => s.id === splitId)
    if (splitIndex > -1) {
      const removedName = track.splits[splitIndex].name
      track.splits.splice(splitIndex, 1)
      track.userShare = Math.max(0, 100 - track.splits.reduce((sum, s) => sum + s.share, 0))
      pendingChanges[trackId] = true
      showToast(`${removedName} removed from split`)
    }
  }
}

const handleUpdateShare = (trackId: string, splitId: string, newShare: number) => {
  const track = release.tracks.find(t => t.trackId === trackId)
  const split = track?.splits.find(s => s.id === splitId)
  if (track && split) {
    const oldShare = split.share
    split.share = newShare
    // When editing an active or rejected split, it becomes pending again (needs re-confirmation)
    if (split.status === 'active' || split.status === 'rejected') {
      split.status = 'pending'
    }
    track.userShare = Math.max(0, 100 - track.splits.reduce((sum, s) => sum + s.share, 0))
    pendingChanges[trackId] = true
    showToast(`${split.name}'s share updated from ${oldShare}% to ${newShare}%`)
  }
}

const handleResendConfirmation = (trackId: string, splitId: string) => {
  const track = release.tracks.find(t => t.trackId === trackId)
  const split = track?.splits.find(s => s.id === splitId)
  if (split) {
    showToast(`Confirmation email sent to ${split.email}`, 'info')
  }
}

const handleCopyFrom = (targetTrackId: string, sourceTrackId: string) => {
  const sourceTrack = release.tracks.find(t => t.trackId === sourceTrackId)
  const targetTrack = release.tracks.find(t => t.trackId === targetTrackId)
  
  if (sourceTrack && targetTrack) {
    // Check for conflicts
    if (targetTrack.splits.length > 0) {
      copyModal.sourceTrackId = sourceTrackId
      copyModal.sourceTrackName = sourceTrack.trackName
      copyModal.sourceUserShare = sourceTrack.userShare
      copyModal.sourceSplits = sourceTrack.splits
      copyModal.targetTracks = [targetTrack]
      copyModal.show = true
    } else {
      // No conflicts, copy directly
      applyCopyToTracks(sourceTrack, [targetTrack], 'add')
    }
  }
}

// Open copy to specific tracks modal
const openCopyToModal = (sourceTrackId: string) => {
  const sourceTrack = release.tracks.find(t => t.trackId === sourceTrackId)
  if (sourceTrack) {
    const otherTracks = release.tracks.filter(t => t.trackId !== sourceTrackId)
    copyModal.sourceTrackId = sourceTrackId
    copyModal.sourceTrackName = sourceTrack.trackName
    copyModal.sourceUserShare = sourceTrack.userShare
    copyModal.sourceSplits = sourceTrack.splits
    copyModal.targetTracks = otherTracks
    copyModal.show = true
  }
}

// Open copy to all tracks modal
const openCopyToAllModal = () => {
  const sourceTrack = tracksWithSplits.value[0]
  if (sourceTrack) {
    copyModal.sourceTrackId = sourceTrack.trackId
    copyModal.sourceTrackName = sourceTrack.trackName
    copyModal.sourceUserShare = sourceTrack.userShare
    copyModal.sourceSplits = sourceTrack.splits
    copyModal.targetTracks = tracksWithoutSplits.value
    copyModal.show = true
  }
}

// Handle copy from first split modal
const handleCopyFromFirstSplit = () => {
  showFirstSplitModal.value = false
  if (lastSavedTrackId.value) {
    openCopyToModal(lastSavedTrackId.value)
  }
}

// Handle copy confirmation from modal
const handleCopyConfirm = (mode: 'add' | 'replace', selectedTrackIds: string[]) => {
  const sourceTrack = release.tracks.find(t => t.trackId === copyModal.sourceTrackId)
  if (sourceTrack) {
    const selectedTracks = release.tracks.filter(t => selectedTrackIds.includes(t.trackId))
    applyCopyToTracks(sourceTrack, selectedTracks, mode)
    showToast(`Splits copied to ${selectedTrackIds.length} track${selectedTrackIds.length > 1 ? 's' : ''}`)
  }
  copyModal.show = false
}

// Apply copy to multiple tracks
const applyCopyToTracks = (sourceTrack: TrackSplit, targetTracks: TrackSplit[], mode: 'add' | 'replace') => {
  targetTracks.forEach(targetTrack => {
    const track = release.tracks.find(t => t.trackId === targetTrack.trackId)
    if (track) {
      if (mode === 'replace') {
        // Replace mode: just copy all splits
        const copiedSplits: Collaborator[] = sourceTrack.splits.map(s => ({
          id: `s${Date.now()}_${Math.random()}`,
          name: s.name,
          email: s.email,
          share: s.share,
          status: 'pending' as const
        }))
        track.splits = copiedSplits
      } else {
        // Add mode: only add splits that don't already exist (by email)
        const existingEmails = new Set(track.splits.map(s => s.email.toLowerCase()))
        const newSplits: Collaborator[] = sourceTrack.splits
          .filter(s => !existingEmails.has(s.email.toLowerCase()))
          .map(s => ({
            id: `s${Date.now()}_${Math.random()}`,
            name: s.name,
            email: s.email,
            share: s.share,
            status: 'pending' as const
          }))
        track.splits = [...track.splits, ...newSplits]
      }
      
      track.userShare = Math.max(0, 100 - track.splits.reduce((sum, s) => sum + s.share, 0))
      pendingChanges[track.trackId] = true
    }
  })
}
</script>
