<template>
  <div class="rsa">
    <p class="rsa__hint">App-native prototype &mdash; tap a track to open its split slate. Save returns you to the release.</p>

    <!-- Phone -->
    <div class="rsa__phone">
      <!-- App header -->
      <div class="rsa__appbar">
        <img src="https://picsum.photos/seed/goldenboy/72/72" alt="" class="rsa__avatar" />
        <span class="rsa__appbar-title">Royalty Splits</span>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="rsa__bell"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
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
          :dirty="slateDirty"
          :has-copy-sources="copySources.length > 0"
          @back="requestLeave"
          @add="screen = 'add'"
          @save="saveSlate"
          @menu="openMenu"
          @copy-from="screen = 'copyFrom'"
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
          <div v-if="toast" class="rsa__toast">
            <span class="rsa__toast-check">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20,6 9,17 4,12"/></svg>
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

        <!-- Unsaved changes guard -->
        <AppActionSheet
          v-if="leaveGuardOpen"
          :items="leaveGuardItems"
          @close="leaveGuardOpen = false"
          @select="handleLeaveGuard"
        />

        <!-- First split: offer to copy to the other tracks -->
        <AppActionSheet
          v-if="firstSplitPromptOpen"
          :items="firstSplitItems"
          @close="firstSplitPromptOpen = false"
          @select="handleFirstSplitPrompt"
        />
      </div>

      <!-- Tab bar -->
      <div class="rsa__tabbar">
        <span v-for="(icon, i) in tabIcons" :key="i" class="rsa__tab" :class="{ 'rsa__tab--active': i === 4 }" v-html="icon"></span>
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
import type { SheetItem } from '../components/royalty-splits-app/AppActionSheet.vue'

// ---- Demo data: identical to the web version's populated release ----
const release = reactive<Release>({
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

// ---- Screen state ----
type Screen = 'release' | 'track' | 'add' | 'edit' | 'editEmail' | 'copyFrom'
const screen = ref<Screen>('release')
const currentTrackId = ref<string | null>(null)
const slateDirty = ref(false)
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
  slateDirty.value = false
  screen.value = 'track'
  scrollTop()
}

const closeSlate = () => {
  screen.value = 'release'
  menuOpen.value = false
  scrollTop()
}

// Back from the slate: confirm when there are unsaved changes (web parity)
const leaveGuardOpen = ref(false)
const leaveGuardItems: SheetItem[] = [
  { id: 'saveLeave', label: 'Save & leave', icon: 'save' },
  { id: 'discard', label: 'Discard changes', icon: 'trash' },
  { id: 'stay', label: 'Keep editing', icon: 'x' },
]

const requestLeave = () => {
  if (slateDirty.value) {
    leaveGuardOpen.value = true
  } else {
    closeSlate()
  }
}

const handleLeaveGuard = (id: string) => {
  leaveGuardOpen.value = false
  if (id === 'saveLeave') {
    saveSlate()
  } else if (id === 'discard') {
    // Drop unsaved (new_*) additions from this track
    const track = currentTrack.value
    if (track) track.splits = track.splits.filter(sp => !sp.id.startsWith('new_'))
    slateDirty.value = false
    closeSlate()
  }
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
  currentTrack.value?.splits.push(split)
  slateDirty.value = true
  screen.value = 'track'
  scrollTop()
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
  }))
  slateDirty.value = true
  screen.value = 'track'
  scrollTop()
}

// ---- Save ----
const firstSplitPromptOpen = ref(false)
const firstSplitItems = computed<SheetItem[]>(() => [
  { id: 'copyAll', label: `Copy this split to all ${release.tracks.length - 1} other tracks`, icon: 'copy' },
  { id: 'done', label: 'Got it', icon: 'x' },
])

const saveSlate = () => {
  const savedTrack = currentTrack.value
  // First split on the release? Offer to copy it everywhere (web FirstSplitModal parity)
  const othersHaveSplits = release.tracks.some(t => t.trackId !== savedTrack?.trackId && t.splits.length > 0)
  const isFirstSplit = !othersHaveSplits && (savedTrack?.splits.length ?? 0) > 0 && release.tracks.length > 1
  slateDirty.value = false
  closeSlate()
  showToast("Split saved! We've sent an email to your collaborators. When they accept the offer, the split will be confirmed.")
  if (isFirstSplit) {
    firstSplitPromptOpen.value = true
  }
}

const handleFirstSplitPrompt = (id: string) => {
  firstSplitPromptOpen.value = false
  const source = release.tracks.find(t => t.splits.length > 0)
  if (id === 'copyAll' && source) {
    release.tracks.forEach(track => {
      if (track.trackId === source.trackId) return
      track.splits = source.splits.map(sp => ({
        ...sp,
        id: `new_${nextId++}`,
        status: 'pending' as const,
        activeSince: undefined,
      }))
    })
    showToast(`Splits copied to ${release.tracks.length - 1} other tracks.`)
  }
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
    target.share = payload.share
    // Web parity: editing an active or rejected split sends a new offer
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
let toastTimer: ReturnType<typeof setTimeout> | undefined
const showToast = (msg: string) => {
  toast.value = msg
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => { toast.value = '' }, 4200)
}

// ---- Tab bar icons (decorative, from the app design) ----
const tabIcons = [
  '<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3l9 8h-3v9h-4v-6H10v6H6v-9H3z"/></svg>',
  '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3" fill="currentColor"/></svg>',
  '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="6" width="18" height="13" rx="2"/><path d="M3 10h18"/></svg>',
  '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M8 14v3M12 11v6M16 9v8"/></svg>',
  '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>',
]
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

  &__appbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.125rem 1.25rem 0.875rem;
    flex-shrink: 0;
  }

  &__avatar {
    width: 2.25rem;
    height: 2.25rem;
    border-radius: 9999px;
    object-fit: cover;
  }

  &__appbar-title {
    font-size: $text-body;
    color: var(--blue);
    font-family: $font-satoshi;
  }

  &__bell { color: var(--blue); }

  &__screen {
    flex: 1;
    overflow-y: auto;
    position: relative;
    scrollbar-width: none;
    &::-webkit-scrollbar { display: none; }
  }

  &__tabbar {
    display: flex;
    align-items: center;
    justify-content: space-around;
    padding: 0.875rem 1rem 1.25rem;
    border-top: 1px solid var(--light-grey);
    flex-shrink: 0;
  }

  &__tab {
    display: inline-flex;
    color: var(--darkening-grey);

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
