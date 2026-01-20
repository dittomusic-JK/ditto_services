<template>
  <div class="w-full max-w-[820px] px-2 sm:px-4 md:px-0 flex flex-col gap-5 min-h-screen">
    <!-- Page header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <button 
          class="flex items-center gap-1 text-sm text-ditto-grey font-satoshi hover:text-ditto-blue transition-colors mb-2"
          @click="handleBackClick"
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
          <span class="text-ditto-grey">{{ isRLS ? 'Active' : 'Collaborators' }}</span>
        </div>
        <template v-if="!isRLS">
          <div class="flex items-center gap-1.5">
            <div class="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span class="text-ditto-grey">Pending</span>
          </div>
        </template>
        <div class="flex items-center gap-1.5">
          <div class="w-2.5 h-2.5 rounded-full" :class="isRLS ? 'bg-warning' : 'bg-orange-500'" />
          <span class="text-ditto-grey">Unclaimed</span>
        </div>
      </div>
    </div>

    <!-- RLS Info Banner -->
    <div v-if="isRLS" class="bg-rls-card rounded-xl p-4 border border-rls-border">
      <p class="text-sm text-rls-text-secondary font-satoshi">
        Manage royalty splits for your artists. Unclaimed shares are held until collaborators create their Ditto account to withdraw.
      </p>
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
      class="rounded-2xl border-2 border-dashed p-8 text-center"
      :class="isRLS ? 'bg-rls-card border-rls-border' : 'bg-white border-faded-grey'"
    >
      <div class="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4" :class="isRLS ? 'bg-rls-accent/10' : 'bg-ditto-purple/10'">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H6C4.93913 15 3.92172 15.4214 3.17157 16.1716C2.42143 16.9217 2 17.9391 2 19V21" :stroke="isRLS ? '#9e77ff' : '#6C5CE7'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <circle cx="9" cy="7" r="4" :stroke="isRLS ? '#9e77ff' : '#6C5CE7'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M19 8V14M16 11H22" :stroke="isRLS ? '#9e77ff' : '#6C5CE7'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <h3 class="text-base font-semibold font-satoshi mb-2" :class="isRLS ? 'text-rls-text' : 'text-ditto-blue'">
        No splits configured yet
      </h3>
      <p class="text-sm font-satoshi mb-4 max-w-sm mx-auto" :class="isRLS ? 'text-rls-text-secondary' : 'text-ditto-grey'">
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
      :is-r-l-s="isRLS"
      @toggle="toggleTrack"
      @save="handleSave"
      @add-split="handleAddSplit"
      @remove-split="handleRemoveSplit"
      @update-share="handleUpdateShare"
      @resend-confirmation="handleResendConfirmation"
      @open-copy-modal="openCopyFromModal"
      @copy-to="openCopyToModal"
      @dirty-change="handleDirtyChange"
    />

    <!-- Copy Splits Modal (unified with source selection) -->
    <CopySplitsModal
      v-if="copyModal.show"
      :mode="copyModal.mode"
      :source-tracks="tracksWithSplits"
      :source-track-name="copyModal.sourceTrackName"
      :source-user-share="copyModal.sourceUserShare"
      :source-splits="copyModal.sourceSplits"
      :target-tracks="copyModal.targetTracks"
      :current-track-id="copyModal.currentTrackId"
      @close="copyModal.show = false"
      @confirm="handleCopyConfirm"
    />

    <!-- First Split Onboarding Modal -->
    <FirstSplitModal
      v-if="showFirstSplitModal"
      :other-tracks-count="tracksWithoutSplits.length"
      :is-r-l-s="isRLS"
      @close="showFirstSplitModal = false"
      @copy-to-all="handleCopyFromFirstSplit"
    />

    <!-- Edit Email Modal -->
    <EditEmailModal
      v-if="editEmailModal.show"
      :collaborator-name="editEmailModal.collaboratorName"
      :collaborator-email="editEmailModal.collaboratorEmail"
      :current-email="editEmailModal.currentEmail"
      :tracks-with-collaborator="editEmailModal.tracksWithCollaborator"
      @close="editEmailModal.show = false"
      @confirm="handleEditEmailConfirm"
    />

    <!-- Unsaved Changes Modal -->
    <UnsavedChangesModal
      v-if="showUnsavedChangesModal"
      @save="handleSaveAllAndLeave"
      @discard="handleDiscardAndLeave"
      @cancel="handleCancelUnsavedChanges"
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
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import type { UserType, Release, TrackSplit, Collaborator } from '../../types'
import ReleaseHeader from './ReleaseHeader.vue'
import TrackGroup from './TrackGroup.vue'
import CopySplitsModal from './CopySplitsModal.vue'
import FirstSplitModal from './FirstSplitModal.vue'
import EditEmailModal from './EditEmailModal.vue'
import UnsavedChangesModal from './UnsavedChangesModal.vue'
import Toast from '../ui/Toast.vue'

const props = withDefaults(defineProps<{
  userType?: UserType
  demo?: 'populated' | 'empty' | 'edge-case'
}>(), {
  userType: 'subscription',
  demo: 'populated'
})

const emit = defineEmits<{
  back: []
}>()

const expandedTrackId = ref<string | null>(null)
const pendingChanges = reactive<Record<string, boolean>>({})
const dirtyForms = reactive<Record<string, boolean>>({})
const pendingSplits = reactive<Record<string, { name: string; email: string; share: number } | null>>({})
const showFirstSplitModal = ref(false)

// Check if RLS (Label Services) mode
const isRLS = computed(() => props.userType === 'rls')
const hasShownFirstSplitModal = ref(false)
const lastSavedTrackId = ref<string | null>(null)
const showUnsavedChangesModal = ref(false)
const pendingTrackSwitch = ref<string | null>(null)

// Computed: check if there are any unsaved changes (saved splits or form data being typed)
const hasUnsavedChanges = computed(() => 
  Object.values(pendingChanges).some(hasChanges => hasChanges) ||
  Object.values(dirtyForms).some(isDirty => isDirty)
)

// Browser beforeunload handler
const handleBeforeUnload = (e: BeforeUnloadEvent) => {
  if (hasUnsavedChanges.value) {
    e.preventDefault()
    e.returnValue = ''
    return ''
  }
}

onMounted(() => {
  window.addEventListener('beforeunload', handleBeforeUnload)
})

onUnmounted(() => {
  window.removeEventListener('beforeunload', handleBeforeUnload)
})

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
  mode: 'select-source' | 'copy-to'
  sourceTrackId: string
  sourceTrackName: string
  sourceUserShare: number
  sourceSplits: Collaborator[]
  targetTracks: TrackSplit[]
  currentTrackId?: string
}>({
  show: false,
  mode: 'select-source',
  sourceTrackId: '',
  sourceTrackName: '',
  sourceUserShare: 100,
  sourceSplits: [],
  targetTracks: [],
  currentTrackId: undefined
})

// Edit email modal state
const editEmailModal = reactive<{
  show: boolean
  collaboratorName: string
  collaboratorEmail: string
  currentEmail: string
  tracksWithCollaborator: TrackSplit[]
}>({
  show: false,
  collaboratorName: '',
  collaboratorEmail: '',
  currentEmail: '',
  tracksWithCollaborator: []
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
    // Track 6: Unclaimed split (collaborator needs to create Ditto account)
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
          status: 'unclaimed'
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
    // Track 10: Rejected split (collaborator declined - their share goes back to user)
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
      userShare: 100 // User gets the rejected 20% back
    }
  ]
}

// Edge case release with 50 tracks and long titles
const longTrackNames = [
  "The Long and Winding Road to Nowhere (Extended Deluxe Version)",
  "I Can't Stop Thinking About You Every Single Day of My Life",
  "When the Moon Rises Over the Mountain and the Stars Come Out to Play",
  "Somewhere Between Yesterday and Tomorrow (Acoustic Reimagined)",
  "Dancing Through the Night Until the Morning Light Appears",
  "The Way You Make Me Feel When We're Together Again",
  "Under the Bridge Where We First Met (feat. Special Guest)",
  "Chasing Shadows in the Dark (Director's Cut Extended Mix)",
  "Memories of a Summer Day That We Will Never Forget",
  "Walking Down the Street of Dreams (Remastered 2025)"
]

const edgeCaseRelease: Release = {
  id: '3',
  title: 'The Complete Collection: Greatest Hits and Rare B-Sides (50th Anniversary Super Deluxe Edition)',
  artwork: 'https://picsum.photos/seed/album3/400/400',
  accountHolder: 'Oluwafisayo Isa (me)',
  tracks: Array.from({ length: 50 }, (_, i) => {
    const trackNum = i + 1
    const baseName = longTrackNames[i % longTrackNames.length]
    const hasSplits = [1, 5, 10, 15, 20, 25, 30, 35, 40, 45].includes(trackNum)
    
    return {
      trackId: `t${trackNum}`,
      trackNumber: trackNum,
      trackName: `${baseName}${trackNum > 10 ? ` - Part ${Math.ceil(trackNum / 10)}` : ''}`,
      splits: hasSplits ? [
        {
          id: `s${trackNum}_1`,
          name: `Collaborator ${trackNum}A`,
          email: `collab${trackNum}a@example.com`,
          share: 15,
          status: trackNum % 3 === 0 ? 'pending' as const : 'active' as const,
          activeSince: trackNum % 3 === 0 ? undefined : '1st Jan 2025'
        },
        {
          id: `s${trackNum}_2`,
          name: `Collaborator ${trackNum}B`,
          email: `collab${trackNum}b@example.com`,
          share: 10,
          status: 'active' as const,
          activeSince: '1st Jan 2025'
        }
      ] : [],
      userShare: hasSplits ? 75 : 100
    }
  })
}

// Select release based on demo prop
const getRelease = () => {
  if (props.demo === 'empty') return emptyRelease
  if (props.demo === 'edge-case') return edgeCaseRelease
  return populatedRelease
}
const release = reactive<Release>(getRelease())

// Track grouping computed properties
const tracksWithConfirmedSplits = computed(() =>
  release.tracks.filter(t => 
    t.splits.length > 0 && t.splits.every(s => s.status === 'active')
  )
)

const tracksWithPendingSplits = computed(() =>
  release.tracks.filter(t => 
    t.splits.length > 0 && t.splits.some(s => s.status === 'pending')
  )
)

const tracksWithRejectedSplits = computed(() =>
  release.tracks.filter(t => 
    t.splits.length > 0 && 
    t.splits.some(s => s.status === 'rejected') && 
    !t.splits.some(s => s.status === 'pending') // Only rejected, no pending
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
  // If collapsing the current track, no unsaved check needed
  if (expandedTrackId.value === trackId) {
    expandedTrackId.value = null
    return
  }
  
  // If expanding a different track while current one has unsaved changes or dirty form, show modal
  if (expandedTrackId.value && (pendingChanges[expandedTrackId.value] || dirtyForms[expandedTrackId.value])) {
    pendingTrackSwitch.value = trackId
    showUnsavedChangesModal.value = true
    return
  }
  
  // No unsaved changes, switch directly
  expandedTrackId.value = trackId
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
    // For RLS: check if collaborator has a Ditto account (simulated via knownCollaborators)
    // Active if they have an account, unclaimed if they don't
    // For subscription: always pending until they confirm
    let status: 'pending' | 'active' | 'unclaimed' = 'pending'
    if (isRLS.value) {
      const hasAccount = knownCollaborators.some(
        c => c.email.toLowerCase() === split.email.toLowerCase()
      )
      status = hasAccount ? 'active' : 'unclaimed'
    }
    
    track.splits.push({
      id: `s${Date.now()}`,
      name: split.name,
      email: split.email,
      share: split.share,
      status,
      activeSince: status === 'active' ? new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : undefined
    })
    // Recalculate user share (rejected splits don't reduce user share)
    track.userShare = Math.max(0, 100 - track.splits.filter(s => s.status !== 'rejected').reduce((sum, s) => sum + s.share, 0))
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
      // Recalculate user share (rejected splits don't reduce user share)
      track.userShare = Math.max(0, 100 - track.splits.filter(s => s.status !== 'rejected').reduce((sum, s) => sum + s.share, 0))
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
    // For subscription mode: Store original share if this was an active split (for showing pending change indicator)
    if (!isRLS.value && split.status === 'active' && split.originalShare === undefined) {
      split.originalShare = oldShare
    }
    split.share = newShare
    // When editing an active or rejected split, it becomes pending again (needs re-confirmation)
    // For RLS: no pending status, keep as active or unclaimed
    if (!isRLS.value && (split.status === 'active' || split.status === 'rejected')) {
      split.status = 'pending'
    }
    // Recalculate user share (rejected splits don't reduce user share)
    track.userShare = Math.max(0, 100 - track.splits.filter(s => s.status !== 'rejected').reduce((sum, s) => sum + s.share, 0))
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

// Track when form has unsaved data being typed
const handleDirtyChange = (trackId: string, isDirty: boolean, pendingSplit: { name: string; email: string; share: number } | null) => {
  dirtyForms[trackId] = isDirty
  pendingSplits[trackId] = pendingSplit
}

// Open copy from modal (unified flow with source selection inside modal)
const openCopyFromModal = (currentTrackId: string) => {
  copyModal.mode = 'select-source'
  copyModal.currentTrackId = currentTrackId
  copyModal.targetTracks = release.tracks
  copyModal.sourceTrackId = ''
  copyModal.sourceTrackName = ''
  copyModal.sourceUserShare = 100
  copyModal.sourceSplits = []
  copyModal.show = true
}

// Open copy to specific tracks modal
// Open copy to specific tracks modal (pre-selected source)
const openCopyToModal = (sourceTrackId: string) => {
  const sourceTrack = release.tracks.find(t => t.trackId === sourceTrackId)
  if (sourceTrack) {
    const otherTracks = release.tracks.filter(t => t.trackId !== sourceTrackId)
    copyModal.mode = 'copy-to'
    copyModal.sourceTrackId = sourceTrackId
    copyModal.sourceTrackName = sourceTrack.trackName
    copyModal.sourceUserShare = sourceTrack.userShare
    copyModal.sourceSplits = sourceTrack.splits
    copyModal.targetTracks = otherTracks
    copyModal.currentTrackId = undefined
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
const handleCopyConfirm = (_mode: 'replace', selectedTrackIds: string[], sourceTrackId?: string) => {
  // Use sourceTrackId from modal if provided (select-source mode), otherwise use stored one
  const effectiveSourceId = sourceTrackId || copyModal.sourceTrackId
  const sourceTrack = release.tracks.find(t => t.trackId === effectiveSourceId)
  if (sourceTrack) {
    const selectedTracks = release.tracks.filter(t => selectedTrackIds.includes(t.trackId))
    applyCopyToTracks(sourceTrack, selectedTracks)
    showToast(`Splits copied to ${selectedTrackIds.length} track${selectedTrackIds.length > 1 ? 's' : ''}`)
  }
  copyModal.show = false
}

// Apply copy to multiple tracks (always replace mode)
const applyCopyToTracks = (sourceTrack: TrackSplit, targetTracks: TrackSplit[]) => {
  targetTracks.forEach(targetTrack => {
    const track = release.tracks.find(t => t.trackId === targetTrack.trackId)
    if (track) {
      // Replace all splits with copied ones
      const copiedSplits: Collaborator[] = sourceTrack.splits.map(s => ({
        id: `s${Date.now()}_${Math.random()}`,
        name: s.name,
        email: s.email,
        share: s.share,
        status: 'pending' as const
      }))
      track.splits = copiedSplits
      track.userShare = Math.max(0, 100 - track.splits.reduce((sum, s) => sum + s.share, 0))
      pendingChanges[track.trackId] = true
    }
  })
}

// Open edit email modal for a collaborator
const openEditEmailModal = (collaboratorEmail: string) => {
  // Find all tracks with this collaborator
  const tracksWithCollaborator = release.tracks.filter(t => 
    t.splits.some(s => s.email.toLowerCase() === collaboratorEmail.toLowerCase())
  )
  
  // Get collaborator name from first track
  const firstSplit = tracksWithCollaborator[0]?.splits.find(
    s => s.email.toLowerCase() === collaboratorEmail.toLowerCase()
  )
  
  if (firstSplit && tracksWithCollaborator.length > 0) {
    editEmailModal.collaboratorName = firstSplit.name
    editEmailModal.collaboratorEmail = firstSplit.email
    editEmailModal.currentEmail = firstSplit.email
    editEmailModal.tracksWithCollaborator = tracksWithCollaborator
    editEmailModal.show = true
  }
}

// Handle edit email confirmation
const handleEditEmailConfirm = (newEmail: string, selectedTrackIds: string[]) => {
  const oldEmail = editEmailModal.currentEmail.toLowerCase()
  let updatedCount = 0
  
  selectedTrackIds.forEach(trackId => {
    const track = release.tracks.find(t => t.trackId === trackId)
    if (track) {
      const split = track.splits.find(s => s.email.toLowerCase() === oldEmail)
      if (split) {
        split.email = newEmail
        // Mark as pending since email changed
        if (split.status === 'active') {
          split.status = 'pending'
        }
        pendingChanges[trackId] = true
        updatedCount++
      }
    }
  })
  
  editEmailModal.show = false
  showToast(`Email updated on ${updatedCount} track${updatedCount !== 1 ? 's' : ''}`)
}

// Handle back button click - check for unsaved changes
const handleBackClick = () => {
  if (hasUnsavedChanges.value) {
    showUnsavedChangesModal.value = true
  } else {
    emit('back')
  }
}

// Save all changes and then leave (or switch tracks)
const handleSaveAllAndLeave = () => {
  // First, add any pending splits that were being typed
  Object.keys(pendingSplits).forEach(trackId => {
    const split = pendingSplits[trackId]
    if (split) {
      handleAddSplit(trackId, split)
      pendingSplits[trackId] = null
    }
  })
  
  // Save all tracks with pending changes
  Object.keys(pendingChanges).forEach(trackId => {
    if (pendingChanges[trackId]) {
      pendingChanges[trackId] = false
    }
  })
  // Clear dirty form states
  Object.keys(dirtyForms).forEach(trackId => {
    dirtyForms[trackId] = false
  })
  showUnsavedChangesModal.value = false
  showToast('All changes saved')
  
  // If we were switching tracks, do that now
  if (pendingTrackSwitch.value) {
    expandedTrackId.value = pendingTrackSwitch.value
    pendingTrackSwitch.value = null
  } else {
    emit('back')
  }
}

// Discard all changes and leave (or switch tracks)
const handleDiscardAndLeave = () => {
  // Clear all pending changes
  Object.keys(pendingChanges).forEach(trackId => {
    pendingChanges[trackId] = false
  })
  // Clear dirty form states
  Object.keys(dirtyForms).forEach(trackId => {
    dirtyForms[trackId] = false
  })
  showUnsavedChangesModal.value = false
  
  // If we were switching tracks, do that now
  if (pendingTrackSwitch.value) {
    expandedTrackId.value = pendingTrackSwitch.value
    pendingTrackSwitch.value = null
  } else {
    emit('back')
  }
}

// Cancel unsaved changes modal (stay on current track)
const handleCancelUnsavedChanges = () => {
  showUnsavedChangesModal.value = false
  pendingTrackSwitch.value = null
}
</script>
