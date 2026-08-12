<template>
  <div class="rsa">
    <p class="rsa__hint">App-native prototype &mdash; tap a track to open its split slate. Changes save as you make them.</p>

    <div class="rsa__demo">
      <span class="rsa__demo-label">Demo:</span>
      <button
        v-for="mode in (['populated', 'empty'] as const)"
        :key="mode"
        class="rsa__demo-tab"
        :class="{ 'rsa__demo-tab--active': demo === mode }"
        @click="setDemo(mode)"
      >{{ mode === 'populated' ? 'Populated' : 'Empty' }}</button>
    </div>

    <!-- Phone -->
    <div class="rsa__phone">
      <!-- App header — mirrors HeaderMain.vue in the mobile app -->
      <div class="rsa__appbar">
        <div class="rsa__appbar-start">
          <img src="https://picsum.photos/seed/goldenboy/72/72" alt="" class="rsa__avatar" />
          <span class="rsa__caret" v-html="dropdownIcon"></span>
        </div>
        <span class="rsa__appbar-title">Royalty Splits</span>
        <div class="rsa__appbar-end"></div>
      </div>

      <!-- Screen -->
      <div class="rsa__screen" ref="screenRef">
        <AppReleaseScreen
          v-if="screen === 'release'"
          :release="release"
          @open-track="openTrack"
        />

        <AppTrackSlate
          v-else-if="screen === 'track'"
          :title="slateTitle"
          :track-number="currentTrack?.trackNumber"
          :splits="slateSplits"
          :has-copy-sources="copySources.length > 0"
          @back="closeSlate"
          @add="screen = 'add'"
          @menu="openMenu"
          @copy-from="screen = 'copyFrom'"
          @copy-to="openCopyTo"
          @unregistered-info="showUnregisteredInfo"
        />

        <!-- Copy splits from another track -->
        <div v-else-if="screen === 'copyFrom'" class="rsa__copy">
          <div class="rsa__copy-titlebar">
            <button class="rsa__copy-back" @click="screen = 'track'" aria-label="Back">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15,18 9,12 15,6"/></svg>
            </button>
            <h2 class="rsa__copy-title">Copy Splits From</h2>
          </div>
          <p class="rsa__copy-hint">Copying replaces this track's current splits. Collaborators are re-invited to confirm.</p>
          <button v-for="source in copySources" :key="source.trackId" class="rsa__copy-row" @click="copyFromTrack(source.trackId)">
            <span class="rsa__copy-num">{{ source.trackNumber }}</span>
            <span class="rsa__copy-body">
              <span class="rsa__copy-name">{{ source.trackName }}</span>
              <span class="rsa__copy-meta">{{ source.splits.map(sp => `${sp.name} ${sp.share}%`).join(' · ') }}</span>
            </span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="rsa__copy-chevron"><polyline points="9,18 15,12 9,6"/></svg>
          </button>
        </div>

        <!-- Copy these splits to other tracks -->
        <div v-else-if="screen === 'copyTo'" class="rsa__copy">
          <div class="rsa__copy-titlebar">
            <button class="rsa__copy-back" @click="screen = 'track'" aria-label="Back">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15,18 9,12 15,6"/></svg>
            </button>
            <h2 class="rsa__copy-title">Copy Splits To</h2>
          </div>
          <p class="rsa__copy-hint">Copying replaces each selected track's splits. Collaborators are invited to confirm.</p>

          <button v-for="target in copyTargets" :key="target.trackId" class="rsa__copy-row" @click="toggleCopyTarget(target.trackId)">
            <span class="rsa__copy-check" :class="{ 'rsa__copy-check--on': copyToSelection.includes(target.trackId) }">
              <svg v-if="copyToSelection.includes(target.trackId)" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20,6 9,17 4,12"/></svg>
            </span>
            <span class="rsa__copy-num">{{ target.trackNumber }}</span>
            <span class="rsa__copy-body">
              <span class="rsa__copy-name">{{ target.trackName }}</span>
              <span class="rsa__copy-meta">{{ target.splits.length > 0 ? `${target.splits.length} split${target.splits.length === 1 ? '' : 's'} — will be replaced` : 'No splits yet' }}</span>
            </span>
          </button>

          <div class="rsa__copy-actions">
            <button class="rsa__copy-all" @click="toggleAllCopyTargets">{{ copyToSelection.length === copyTargets.length ? 'Deselect all' : 'Select all' }}</button>
            <button class="rsa__copy-confirm" :disabled="copyToSelection.length === 0" @click="confirmCopyTo">
              Copy to {{ copyToSelection.length }} track{{ copyToSelection.length === 1 ? '' : 's' }}
            </button>
          </div>
        </div>

        <AppCollaboratorSlate
          v-else-if="screen === 'add'"
          title="Add Collaborator"
          confirm-label="Add"
          :other-share="slateSplits.reduce((sum, s) => sum + s.share, 0)"
          :known-collaborators="availableCollaborators"
          @cancel="screen = 'track'"
          @confirm="addCollaborator"
        />

        <AppCollaboratorSlate
          v-else-if="screen === 'edit' && menuTarget"
          title="Edit Split"
          confirm-label="Update"
          :name="menuTarget.name"
          :email="menuTarget.email"
          :share="menuTarget.share"
          name-locked
          email-locked
          :other-share="slateSplits.filter(s => s.id !== menuTarget!.id).reduce((sum, s) => sum + s.share, 0)"
          @cancel="screen = 'track'"
          @confirm="applyEditSplit"
        />

        <AppCollaboratorSlate
          v-else-if="screen === 'editEmail' && menuTarget"
          title="Edit Email"
          confirm-label="Update"
          :name="menuTarget.name"
          :email="menuTarget.email"
          name-locked
          share-hidden
          require-email-change
          :other-tracks-count="editEmailOtherTracks"
          @cancel="screen = 'track'"
          @confirm="applyEditEmail"
        />

        <!-- Green toast -->
        <transition name="rsa-toast">
          <div v-if="toast" class="rsa__toast" :class="{ 'rsa__toast--info': toastType === 'info' }">
            <span class="rsa__toast-check">
              <svg v-if="toastType === 'info'" width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M8 5V8.5M8 10.5V10.51" stroke-linecap="round"/></svg>
              <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20,6 9,17 4,12"/></svg>
            </span>
            <p class="rsa__toast-text">{{ toast }}</p>
            <button class="rsa__toast-close" @click="toast = ''" aria-label="Dismiss">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>
        </transition>

        <!-- Collaborator action sheet -->
        <AppActionSheet
          v-if="menuOpen && menuTarget"
          :items="menuItems"
          @close="menuOpen = false"
          @select="handleMenuSelect"
        />

        <!-- First split on the release — same explainer as web -->
        <AppFirstSplitModal
          v-if="firstSplitPromptOpen"
          :other-tracks-count="release.tracks.length - 1"
          @close="firstSplitPromptOpen = false"
          @copy-to-all="handleCopyToAllFromFirstSplit"
        />
      </div>

      <!-- Tab bar — real icons and order from the app's DashboardLayout.vue -->
      <div class="rsa__tabbar">
        <span
          v-for="tab in tabs"
          :key="tab.name"
          class="rsa__tab"
          :class="{ 'rsa__tab--active': tab.name === 'releases' }"
          v-html="tab.icon"
        ></span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import type { Release, Collaborator } from '../types'
import AppReleaseScreen from '../components/royalty-splits-app/AppReleaseScreen.vue'
import AppTrackSlate from '../components/royalty-splits-app/AppTrackSlate.vue'
import AppCollaboratorSlate from '../components/royalty-splits-app/AppCollaboratorSlate.vue'
import AppActionSheet from '../components/royalty-splits-app/AppActionSheet.vue'
import AppFirstSplitModal from '../components/royalty-splits-app/AppFirstSplitModal.vue'
import type { SheetItem } from '../components/royalty-splits-app/AppActionSheet.vue'

// ---- Demo data: identical to the web version's populated release ----
const populatedRelease: Release = ({
  id: '1',
  title: 'Midnight Sessions EP',
  artwork: 'https://picsum.photos/seed/album2/400/400',
  accountHolder: 'Oluwafisayo Isa (me)',
  tracks: [
    { trackId: 't1', trackNumber: 1, trackName: 'Intro (Midnight)', splits: [], userShare: 100 },
    {
      trackId: 't2', trackNumber: 2, trackName: 'City Lights (feat. Rema)', userShare: 75,
      splits: [
        { id: 's1', name: 'Rema', email: 'rema@mavin.com', share: 25, status: 'active', hasAccount: true, activeSince: '17th April 2025' },
      ],
    },
    {
      trackId: 't3', trackNumber: 3, trackName: 'Euphoria', userShare: 65,
      splits: [
        { id: 's2', name: 'DJ Tunez', email: 'tunez@starboy.com', share: 20, status: 'active', activeSince: '10th March 2025' },
        { id: 's3', name: 'P2J', email: 'p2j@production.com', share: 15, status: 'active', activeSince: '10th March 2025' },
      ],
    },
    {
      trackId: 't4', trackNumber: 4, trackName: 'Waiting', userShare: 70,
      splits: [
        { id: 's4', name: 'Ayra Starr', email: 'ayra@mavin.com', share: 30, status: 'pending', hasAccount: true },
      ],
    },
    {
      trackId: 't5', trackNumber: 5, trackName: 'Midnight Drive', userShare: 65,
      splits: [
        { id: 's5', name: 'Geri Adams', email: 'geri101@gmail.com', share: 20, status: 'active', hasAccount: true, activeSince: '5th May 2025' },
        { id: 's6', name: 'New Collaborator', email: 'newcollab@email.com', share: 15, status: 'pending', hasAccount: false },
      ],
    },
    {
      trackId: 't6', trackNumber: 6, trackName: 'Lost in Translation', userShare: 50,
      splits: [
        { id: 's7', name: 'Bob Johnson', email: 'bob@example.com', share: 25, status: 'pending', hasAccount: false },
        { id: 's8', name: 'Sarah Chen', email: 'sarah.chen@music.co', share: 25, status: 'pending', hasAccount: false },
      ],
    },
    { trackId: 't7', trackNumber: 7, trackName: 'Interlude', splits: [], userShare: 100 },
    {
      trackId: 't8', trackNumber: 8, trackName: 'Dreams (Remix)', userShare: 70,
      splits: [
        { id: 's9', name: 'Original Writer', email: 'writer@pub.com', share: 10, status: 'active', activeSince: '1st Jan 2025' },
        { id: 's10', name: 'Remix Producer', email: 'remixer@beats.io', share: 15, status: 'active', activeSince: '15th Feb 2025' },
        { id: 's11', name: 'Sample Clearance', email: 'legal@samples.net', share: 5, status: 'active', activeSince: '1st Jan 2025' },
      ],
    },
    {
      trackId: 't9', trackNumber: 9, trackName: 'Your Song', userShare: 40,
      splits: [
        { id: 's12', name: 'Primary Songwriter', email: 'songwriter@ascap.com', share: 60, status: 'active', activeSince: '20th April 2025' },
      ],
    },
    {
      trackId: 't10', trackNumber: 10, trackName: 'Outro (Until Dawn)', userShare: 100,
      splits: [
        { id: 's13', name: 'Former Collaborator', email: 'declined@email.com', share: 20, status: 'rejected' },
      ],
    },
  ],
})

// Empty variant so the first-split flow is reviewable (web has the same toggle)
const emptyRelease: Release = {
  ...populatedRelease,
  tracks: populatedRelease.tracks.map(t => ({ ...t, splits: [] })),
}

const demo = ref<'populated' | 'empty'>('populated')
const buildRelease = (mode: 'populated' | 'empty'): Release =>
  JSON.parse(JSON.stringify(mode === 'empty' ? emptyRelease : populatedRelease))

const release = reactive<Release>(buildRelease('populated'))

const setDemo = (mode: 'populated' | 'empty') => {
  demo.value = mode
  Object.assign(release, buildRelease(mode))
  screen.value = 'release'
  currentTrackId.value = null
  menuOpen.value = false
  firstSplitPromptOpen.value = false
  toast.value = ''
}

// ---- Screen state ----
type Screen = 'release' | 'track' | 'add' | 'edit' | 'editEmail' | 'copyFrom' | 'copyTo'
const screen = ref<Screen>('release')
const currentTrackId = ref<string | null>(null)
const screenRef = ref<HTMLElement | null>(null)

const currentTrack = computed(() => release.tracks.find(t => t.trackId === currentTrackId.value))
const slateTitle = computed(() => currentTrack.value?.trackName ?? '')
const slateSplits = computed<Collaborator[]>(() => currentTrack.value?.splits ?? [])

const scrollTop = () => screenRef.value?.scrollTo({ top: 0 })

// Saved collaborators — identical to the web version's list
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

// Suggestions exclude collaborators already on this track
const availableCollaborators = computed(() => {
  const existing = new Set(slateSplits.value.map(sp => sp.email.toLowerCase()))
  return knownCollaborators.filter(c => !existing.has(c.email.toLowerCase()))
})

// Other tracks with splits (sources for copy-from)
const copySources = computed(() => release.tracks.filter(t => t.trackId !== currentTrackId.value && t.splits.length > 0))

// Other tracks sharing the edit-email target's email
const editEmailOtherTracks = computed(() => {
  const email = menuTarget.value?.email.toLowerCase()
  if (!email) return 0
  return release.tracks.filter(t => t.trackId !== currentTrackId.value && t.splits.some(sp => sp.email.toLowerCase() === email)).length
})

const openTrack = (trackId: string) => {
  currentTrackId.value = trackId
  screen.value = 'track'
  scrollTop()
}

const closeSlate = () => {
  screen.value = 'release'
  menuOpen.value = false
  scrollTop()
}

// ---- Add collaborator ----
let nextId = 100
const addCollaborator = (payload: { name: string; email: string; share: number; applyToAll: boolean }) => {
  const split: Collaborator = {
    id: `new_${nextId++}`,
    name: payload.name,
    email: payload.email,
    share: payload.share,
    status: 'pending',
    hasAccount: true,
  }
  // Saved on the spot — there is no separate save step
  const wasFirstOnRelease = release.tracks.every(t => t.splits.length === 0)
  currentTrack.value?.splits.push(split)
  screen.value = 'track'
  scrollTop()

  if (wasFirstOnRelease && release.tracks.length > 1) {
    firstSplitPromptOpen.value = true
  } else {
    showToast("Split saved! We've sent an email to your collaborators. When they accept the offer, the split will be confirmed.")
  }
}

// ---- Copy splits TO other tracks (web TrackGroup copy-to parity) ----
const copyToSelection = ref<string[]>([])
const copyTargets = computed(() => release.tracks.filter(t => t.trackId !== currentTrackId.value))

const openCopyTo = () => {
  copyToSelection.value = []
  screen.value = 'copyTo'
  scrollTop()
}

const toggleCopyTarget = (trackId: string) => {
  const i = copyToSelection.value.indexOf(trackId)
  i > -1 ? copyToSelection.value.splice(i, 1) : copyToSelection.value.push(trackId)
}

const toggleAllCopyTargets = () => {
  copyToSelection.value = copyToSelection.value.length === copyTargets.value.length
    ? []
    : copyTargets.value.map(t => t.trackId)
}

const confirmCopyTo = () => {
  const source = currentTrack.value
  if (!source || copyToSelection.value.length === 0) return
  const count = copyToSelection.value.length
  release.tracks.forEach(track => {
    if (!copyToSelection.value.includes(track.trackId)) return
    track.splits = source.splits.map(sp => ({
      ...sp,
      id: `new_${nextId++}`,
      status: 'pending' as const,
      activeSince: undefined,
      originalShare: undefined,
    }))
  })
  screen.value = 'track'
  scrollTop()
  showToast(`Splits copied to ${count} track${count === 1 ? '' : 's'}.`)
}

// ---- Copy splits from another track (web parity) ----
const copyFromTrack = (sourceId: string) => {
  const source = release.tracks.find(t => t.trackId === sourceId)
  const target = currentTrack.value
  if (!source || !target) return
  target.splits = source.splits.map(sp => ({
    ...sp,
    id: `new_${nextId++}`,
    status: 'pending' as const,
    activeSince: undefined,
    originalShare: undefined,
  }))
  screen.value = 'track'
  scrollTop()
  showToast(`Splits copied from ${source.trackName}.`)
}

// ---- First split on the release ----
const firstSplitPromptOpen = ref(false)

const handleCopyToAllFromFirstSplit = () => {
  firstSplitPromptOpen.value = false
  const source = currentTrack.value
  if (!source) return
  release.tracks.forEach(track => {
    if (track.trackId === source.trackId) return
    track.splits = source.splits.map(sp => ({
      ...sp,
      id: `new_${nextId++}`,
      status: 'pending' as const,
      activeSince: undefined,
      originalShare: undefined,
    }))
  })
  showToast(`Splits copied to ${release.tracks.length - 1} other tracks.`)
}

// ---- Collaborator menu ----
const menuOpen = ref(false)
const menuTarget = ref<Collaborator | null>(null)

const openMenu = (split: Collaborator) => {
  menuTarget.value = split
  menuOpen.value = true
}

const menuItems = computed<SheetItem[]>(() => {
  const items: SheetItem[] = [{ id: 'edit', label: 'Edit Split', icon: 'edit' }]
  if (menuTarget.value?.status === 'unclaimed') {
    items.push({ id: 'editEmail', label: 'Edit Email', icon: 'mail' })
    items.push({ id: 'resend', label: 'Resend Invitation', icon: 'send' })
  } else if (menuTarget.value?.status === 'pending') {
    items.push({ id: 'resend', label: 'Resend Confirmation Email', icon: 'send' })
  }
  items.push({ id: 'remove', label: 'Remove Collaborator', icon: 'trash' })
  return items
})

const handleMenuSelect = (id: string) => {
  menuOpen.value = false
  const target = menuTarget.value
  if (!target) return
  if (id === 'edit') {
    screen.value = 'edit'
  } else if (id === 'editEmail') {
    screen.value = 'editEmail'
  } else if (id === 'resend') {
    showToast(target.status === 'unclaimed'
      ? `Invitation resent to ${target.email}.`
      : `Confirmation email resent to ${target.email}.`)
  } else if (id === 'remove') {
    const list = currentTrack.value?.splits
    const idx = list?.findIndex(s => s.id === target.id) ?? -1
    if (idx > -1) list?.splice(idx, 1)
    showToast('Collaborator removed from this split.')
  }
}

// ---- Edit split / edit email ----
const applyEditSplit = (payload: { name: string; email: string; share: number; applyToAll: boolean }) => {
  const target = menuTarget.value
  if (target) {
    // Web parity: remember the confirmed share so the row can show "15% → 30%"
    if (target.status === 'active' && target.originalShare === undefined) {
      target.originalShare = target.share
    }
    target.share = payload.share
    // Editing an active or rejected split sends a new offer
    if (target.status === 'active' || target.status === 'rejected') target.status = 'pending'
    showToast("Split updated! We've sent an email to your collaborators. When they accept the revised offer, the split will be confirmed.")
  }
  screen.value = 'track'
}

const applyEditEmail = (payload: { name: string; email: string; share: number; applyToAll: boolean }) => {
  const target = menuTarget.value
  if (target) {
    const oldEmail = target.email.toLowerCase()
    let count = 1
    target.email = payload.email
    if (payload.applyToAll) {
      release.tracks.forEach(track => {
        if (track.trackId === currentTrackId.value) return
        track.splits.forEach(sp => {
          if (sp.email.toLowerCase() === oldEmail) {
            sp.email = payload.email
            count++
          }
        })
      })
    }
    showToast(count > 1
      ? `Email updated across ${count} splits! We've sent a new invitation to ${payload.email}.`
      : `Email updated! We've sent a new invitation to ${payload.email}.`)
  }
  screen.value = 'track'
}

// ---- Toast ----
const toast = ref('')
const toastType = ref<'success' | 'info'>('success')
let toastTimer: ReturnType<typeof setTimeout> | undefined
const showToast = (msg: string, type: 'success' | 'info' = 'success') => {
  toast.value = msg
  toastType.value = type
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => { toast.value = '' }, 4200)
}

// Tapping the ⓘ beside an unregistered collaborator's email — web shows this
// as a hover tooltip, which mobile has no equivalent for.
const showUnregisteredInfo = () =>
  showToast("Not registered yet. They'll need to create a Ditto account to approve.", 'info')

// ---- App chrome assets (copied from the mobile app's src/assets) ----
const dropdownIcon = `<svg viewBox="0 0 10 6" xmlns="http://www.w3.org/2000/svg"><path stroke="none" d="M 5.000504 5.150012 C 4.877594 5.150012 4.761719 5.105334 4.674255 5.024219 L 0.99086 1.611194 C 0.90007 1.527087 0.850052 1.414355 0.850021 1.29375 C 0.849976 1.173083 0.899979 1.060229 0.990814 0.976001 C 1.078552 0.894702 1.194321 0.849963 1.316849 0.849963 C 1.439392 0.849963 1.555161 0.894702 1.642838 0.97594 L 5.000015 4.086719 L 8.357178 0.97594 C 8.44487 0.894702 8.560623 0.849963 8.683151 0.849963 C 8.805679 0.849963 8.921448 0.894702 9.009109 0.97594 C 9.100006 1.060229 9.15004 1.173083 9.150009 1.29375 C 9.149979 1.414355 9.099915 1.527087 9.009064 1.611194 L 5.325714 5.02428 C 5.240021 5.105029 5.124191 5.150012 5.000504 5.150012 Z"/></svg>`;

const tabs = [
  {
    name: 'dashboard',
    icon: `<svg viewBox="0 0 25 24" xmlns="http://www.w3.org/2000/svg"><path d="M22.5 5.7285V2.0045C22.5 1.4525 22.053 1.0045 21.5 1.0045C20.947 1.0045 20.5 1.4525 20.5 2.0045V4.3705L15.297 0.8595C13.598 -0.2865 11.402 -0.2865 9.703 0.8595L2.703 5.5835C1.324 6.5145 0.5 8.0635 0.5 9.7285V19.0045C0.5 21.7615 2.743 24.0045 5.5 24.0045H7.5C8.053 24.0045 8.5 23.5565 8.5 23.0045V14.0045C8.5 13.4535 8.948 13.0045 9.5 13.0045H15.5C16.052 13.0045 16.5 13.4535 16.5 14.0045V23.0045C16.5 23.5565 16.947 24.0045 17.5 24.0045H19.5C22.257 24.0045 24.5 21.7615 24.5 19.0045V9.7285C24.5 8.1475 23.756 6.6705 22.5 5.7285Z"/></svg>`,
  },
  {
    name: 'analytics',
    icon: `<svg viewBox="0 0 25 24" xmlns="http://www.w3.org/2000/svg"><path d="M23 21H6C5.33696 21 4.70107 20.7366 4.23223 20.2678C3.76339 19.7989 3.5 19.163 3.5 18.5V1.5C3.5 1.10218 3.34196 0.720644 3.06066 0.43934C2.77936 0.158035 2.39782 0 2 0C1.60218 0 1.22064 0.158035 0.93934 0.43934C0.658035 0.720644 0.5 1.10218 0.5 1.5L0.5 18.5C0.501588 19.9582 1.08156 21.3562 2.11267 22.3873C3.14377 23.4184 4.5418 23.9984 6 24H23C23.3978 24 23.7794 23.842 24.0607 23.5607C24.342 23.2794 24.5 22.8978 24.5 22.5C24.5 22.1022 24.342 21.7206 24.0607 21.4393C23.7794 21.158 23.3978 21 23 21Z"/><path d="M10 9C9.60218 9 9.22064 9.15804 8.93934 9.43934C8.65804 9.72064 8.5 10.1022 8.5 10.5V17.5C8.5 17.8978 8.65804 18.2794 8.93934 18.5607C9.22064 18.842 9.60218 19 10 19C10.3978 19 10.7794 18.842 11.0607 18.5607C11.342 18.2794 11.5 17.8978 11.5 17.5V10.5C11.5 10.1022 11.342 9.72064 11.0607 9.43934C10.7794 9.15804 10.3978 9 10 9Z"/><path d="M14.5 13.5V17.5C14.5 17.8978 14.658 18.2794 14.9393 18.5607C15.2206 18.842 15.6022 19 16 19C16.3978 19 16.7794 18.842 17.0607 18.5607C17.342 18.2794 17.5 17.8978 17.5 17.5V13.5C17.5 13.1022 17.342 12.7206 17.0607 12.4393C16.7794 12.158 16.3978 12 16 12C15.6022 12 15.2206 12.158 14.9393 12.4393C14.658 12.7206 14.5 13.1022 14.5 13.5Z"/><path d="M20.5 9.5V17.5C20.5 17.8978 20.658 18.2794 20.9393 18.5607C21.2206 18.842 21.6022 19 22 19C22.3978 19 22.7794 18.842 23.0607 18.5607C23.342 18.2794 23.5 17.8978 23.5 17.5V9.5C23.5 9.10218 23.342 8.72064 23.0607 8.43934C22.7794 8.15804 22.3978 8 22 8C21.6022 8 21.2206 8.15804 20.9393 8.43934C20.658 8.72064 20.5 9.10218 20.5 9.5Z"/><path d="M6.50007 7.49997C6.84053 7.5007 7.17093 7.38456 7.43607 7.17097L9.71407 5.34997C10.1741 4.98069 10.7543 4.79439 11.3433 4.82687C11.9323 4.85936 12.4885 5.10834 12.9051 5.52597C13.8665 6.47516 15.1472 7.03186 16.4971 7.08733C17.8469 7.14281 19.169 6.69307 20.2051 5.82597L23.9691 2.64097C24.1294 2.51702 24.263 2.36185 24.3617 2.18484C24.4605 2.00783 24.5223 1.81264 24.5435 1.61106C24.5647 1.40949 24.5448 1.20571 24.4851 1.01202C24.4254 0.818343 24.327 0.638778 24.1959 0.484173C24.0648 0.329568 23.9038 0.203129 23.7225 0.112493C23.5412 0.0218564 23.3434 -0.0310981 23.1411 -0.0431731C22.9388 -0.0552481 22.7361 -0.026193 22.5453 0.0422376C22.3545 0.110668 22.1796 0.217055 22.0311 0.354974L18.2681 3.53997C17.8072 3.92429 17.2195 4.12292 16.62 4.09703C16.0204 4.07114 15.4521 3.82259 15.0261 3.39997C14.0881 2.45941 12.8359 1.89837 11.5096 1.82455C10.1834 1.75072 8.87659 2.16931 7.84007 2.99997L5.56307 4.82897C5.32048 5.02317 5.14419 5.28792 5.05856 5.58664C4.97293 5.88535 4.98219 6.20329 5.08506 6.49652C5.18792 6.78974 5.37932 7.04378 5.63279 7.22354C5.88627 7.40329 6.18932 7.49989 6.50007 7.49997Z"/></svg>`,
  },
  {
    name: 'wallet',
    icon: `<svg viewBox="0 0 25 20" xmlns="http://www.w3.org/2000/svg"><path d="M21.5 4H5.5C4.641 4 3.828 3.628 3.265 3.001C3.815 2.387 4.614 2 5.5 2H23.5C24.808 1.994 24.807 0.005 23.5 0H5.5C2.739 0 0.5 2.239 0.5 5V15C0.5 17.761 2.739 20 5.5 20H21.5C23.157 20 24.5 18.657 24.5 17V7C24.5 5.343 23.157 4 21.5 4ZM20.5 13C19.192 12.994 19.192 11.006 20.5 11C21.808 11.006 21.808 12.994 20.5 13Z"/></svg>`,
  },
  {
    name: 'releases',
    icon: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M19 0H5C2.24 0 0 2.24 0 5V19C0 21.76 2.24 24 5 24H19C21.76 24 24 21.76 24 19V5C24 2.24 21.76 0 19 0ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM12 6C8.69 6 6 8.69 6 12C6 15.31 8.69 18 12 18C15.31 18 18 15.31 18 12C18 8.69 15.31 6 12 6ZM12 13.5C11.17 13.5 10.5 12.83 10.5 12C10.5 11.17 11.17 10.5 12 10.5C12.83 10.5 13.5 11.17 13.5 12C13.5 12.83 12.83 13.5 12 13.5Z"/></svg>`,
  },
  {
    name: 'builder',
    icon: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M17.147 1.17656C18.3048 1.17656 19.4392 1.51875 20.4048 2.16563C21.3704 2.80781 22.1204 3.72656 22.5657 4.79531C23.011 5.86406 23.1235 7.04531 22.8985 8.18438C22.6735 9.32344 22.1157 10.3641 21.2954 11.1844C20.4751 12.0047 19.4298 12.5625 18.2954 12.7875C17.1563 13.0125 15.9798 12.8953 14.9063 12.4547C13.8376 12.0094 12.9188 11.2594 12.2767 10.2938C11.6345 9.32812 11.2876 8.19844 11.2876 7.03594C11.2876 5.47969 11.9063 3.99375 13.0079 2.89219C14.1048 1.79531 15.5954 1.17656 17.1517 1.17188L17.147 1.17656ZM15.1923 7.52344H16.6595V8.99063C16.6595 9.12188 16.711 9.24375 16.8048 9.3375C16.8985 9.43125 17.0204 9.48281 17.1517 9.48281C17.2829 9.48281 17.4048 9.43125 17.4985 9.3375C17.5923 9.24375 17.6438 9.12188 17.6438 8.99063V7.52344H19.111C19.2423 7.52344 19.3642 7.47187 19.4579 7.37812C19.5517 7.28437 19.6032 7.1625 19.6032 7.03125C19.6032 6.9 19.5517 6.77813 19.4579 6.68438C19.3642 6.59063 19.2423 6.53906 19.111 6.53906H17.6438V5.07187C17.6438 4.94062 17.5923 4.81875 17.4985 4.725C17.4048 4.63125 17.2829 4.57969 17.1517 4.57969C17.0204 4.57969 16.8985 4.63125 16.8048 4.725C16.711 4.81875 16.6595 4.94062 16.6595 5.07187V6.53906H15.1923C15.061 6.53906 14.9392 6.59063 14.8454 6.68438C14.7517 6.77813 14.7001 6.9 14.7001 7.03125C14.7001 7.1625 14.7517 7.28437 14.8454 7.37812C14.9392 7.47187 15.061 7.52344 15.1923 7.52344Z"/><path d="M10.4953 7.03591C10.4953 6.67966 10.5234 6.3281 10.5797 5.9906L8.88281 6.30935C7.07344 6.64685 5.76094 8.22654 5.76094 10.0687V17.6062C5.29687 17.3297 4.77187 17.1844 4.23281 17.1797C2.54063 17.1797 1.17188 18.5484 1.17188 20.2406C1.17188 21.9328 2.54063 23.3015 4.23281 23.3015C5.925 23.3015 7.29375 21.9328 7.29375 20.2406V13.2609C7.29375 12.525 7.81875 11.8922 8.54062 11.7562L11.9016 11.1234C11.0203 9.99373 10.5 8.5781 10.5 7.03591H10.4953Z"/><path d="M18.0002 13.6359V15.314C17.5361 15.0375 17.0111 14.8875 16.4721 14.8875C14.7799 14.8875 13.4111 16.2562 13.4111 17.9484C13.4111 19.6406 14.7799 21.0093 16.4721 21.0093C18.1643 21.0093 19.533 19.6406 19.533 17.9484V13.2515C19.0455 13.439 18.5346 13.5703 18.0049 13.6359H18.0002Z"/></svg>`,
  },
];
</script>

<style lang="scss" scoped>
.rsa {
  min-height: 100vh;
  background: var(--light-grey);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.5rem 1rem 3rem;

  &__hint {
    font-size: $text-xs;
    color: var(--ditto-grey);
    font-family: $font-satoshi;
    margin-bottom: 1.25rem;
    text-align: center;
  }

  &__demo {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 1rem;
    font-size: $text-sm;
    font-family: $font-satoshi;
  }

  &__demo-label { color: var(--ditto-grey); }

  &__demo-tab {
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
    background: #fff;
    color: var(--ditto-grey);
    cursor: pointer;
    transition: background 0.15s, color 0.15s;

    &:hover { background: var(--light-grey); }

    &--active {
      background: $color-brand-primary;
      color: #fff;
      &:hover { background: $color-brand-primary; }
    }
  }

  &__phone {
    width: 393px;
    max-width: 100%;
    height: 820px;
    background: #fff;
    border-radius: 3rem;
    border: 10px solid var(--blue);
    box-shadow: 0 24px 64px rgba(16, 31, 60, 0.28);
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  /* Header — HeaderMain.vue: 36px avatar + 10px caret, centred bold title */
  &__appbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 44px;
    padding: 0 1.25rem 0 1rem;
    flex-shrink: 0;
  }

  &__appbar-start,
  &__appbar-end {
    display: flex;
    align-items: center;
    flex: 1 0 0;
  }

  &__appbar-end { justify-content: flex-end; }

  &__avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    object-fit: cover;
  }

  &__caret {
    display: inline-flex;
    margin-left: 6px;
    color: var(--blue);

    :deep(svg) {
      width: 10px;
      fill: currentColor;
    }
  }

  &__appbar-title {
    font-size: 18px;
    line-height: 24px;
    font-weight: 700;
    text-transform: capitalize;
    color: var(--blue);
    font-family: $font-satoshi;
    white-space: nowrap;
  }

  &__screen {
    flex: 1;
    overflow-y: auto;
    position: relative;
    scrollbar-width: none;
    &::-webkit-scrollbar { display: none; }
  }

  /* Tab bar — DashboardLayout.vue: 60px bar, 25px icons */
  &__tabbar {
    display: flex;
    align-items: center;
    justify-content: space-around;
    height: 60px;
    padding: 0 0.5rem;
    border-top: 1px solid var(--light-grey);
    flex-shrink: 0;
  }

  &__tab {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: var(--darkening-grey);

    :deep(svg) {
      width: 25px;
      height: 25px;
      fill: currentColor;
    }

    &--active { color: var(--blue); }
  }

  /* Toast */
  &__toast {
    position: absolute;
    top: 0.75rem;
    left: 0.75rem;
    right: 0.75rem;
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    padding: 1rem;
    background: #e7f9f2;
    border: 1px solid rgba(0, 182, 122, 0.35);
    border-radius: 0.75rem;
    z-index: 50;
    box-shadow: 0 8px 24px rgba(16, 31, 60, 0.12);
  }

  &__toast-check {
    width: 1.375rem;
    height: 1.375rem;
    border-radius: 9999px;
    background: #00b67a;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  /* Informational rather than success — amber, matching the ⓘ indicator */
  &__toast--info {
    background: #fff8e8;
    border-color: rgba($color-amber-500, 0.4);

    .rsa__toast-check { background: $color-amber-500; }
    .rsa__toast-text { color: $color-amber-800; }
    .rsa__toast-close { color: $color-amber-600; }
  }

  &__toast-text {
    flex: 1;
    font-size: $text-xs;
    color: #009565;
    font-family: $font-satoshi;
    line-height: 1.55;
  }

  &__toast-close {
    color: #00b67a;
    cursor: pointer;
    flex-shrink: 0;
    padding: 0.125rem;
  }
}

.rsa {
  &__copy-titlebar {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem 1.25rem;
  }

  &__copy-back {
    display: inline-flex;
    color: var(--blue);
    cursor: pointer;
    padding: 0.125rem;
  }

  &__copy-title {
    font-size: $text-h4;
    font-weight: 700;
    color: var(--blue);
    font-family: $font-satoshi;
    letter-spacing: -0.03em;
  }

  &__copy-hint {
    padding: 0 1.25rem 1rem;
    font-size: $text-xs;
    color: var(--ditto-grey);
    font-family: $font-satoshi;
    line-height: 1.5;
  }

  &__copy-row {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 0.875rem;
    text-align: left;
    padding: 1rem 1.25rem;
    border-top: 1px solid var(--faded-grey);
    cursor: pointer;

    &:active { background: var(--lighter-grey); }
    &:last-child { border-bottom: 1px solid var(--faded-grey); }
  }

  &__copy-num {
    font-size: $text-h4;
    font-weight: 500;
    color: var(--blue);
    font-family: $font-satoshi;
    width: 1.25rem;
    flex-shrink: 0;
  }

  &__copy-body {
    flex: 1;
    min-width: 0;
  }

  &__copy-name {
    display: block;
    font-size: $text-body;
    font-weight: 500;
    color: var(--blue);
    font-family: $font-satoshi;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__copy-meta {
    display: block;
    font-size: $text-xs;
    color: var(--ditto-grey);
    font-family: $font-satoshi;
    margin-top: 0.25rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__copy-chevron {
    color: var(--darkening-grey);
    flex-shrink: 0;
  }

  &__copy-check {
    width: 1.125rem;
    height: 1.125rem;
    border-radius: 0.3125rem;
    border: 2px solid var(--faded-grey);
    background: #fff;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: background 0.15s, border-color 0.15s;

    &--on {
      background: $color-brand-primary;
      border-color: $color-brand-primary;
    }
  }

  &__copy-actions {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1.25rem;
  }

  &__copy-all {
    font-size: $text-sm;
    color: var(--ditto-grey);
    font-family: $font-satoshi;
    text-decoration: underline;
    text-underline-offset: 3px;
    cursor: pointer;
    flex-shrink: 0;

    &:hover { color: $color-brand-primary; }
  }

  &__copy-confirm {
    flex: 1;
    padding: 0.875rem 1rem;
    border-radius: 9999px;
    background: $color-brand-primary;
    color: #fff;
    font-size: $text-sm;
    font-weight: 500;
    font-family: $font-satoshi;
    cursor: pointer;
    transition: opacity 0.15s;

    &:hover { opacity: 0.92; }
    &:disabled { opacity: 0.4; cursor: not-allowed; }
  }
}

.rsa-toast-enter-active,
.rsa-toast-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.rsa-toast-enter-from,
.rsa-toast-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
