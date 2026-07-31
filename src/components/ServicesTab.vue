<template>
  <div class="st">
    <h1 class="st__title">Services</h1>

    <!-- Charts Registration Section -->
    <div>
      <SectionHeader
        title="Charts Registration"
        description="Register your release with official music charts to track your chart positions."
      />
      <div class="st__list">
        <ServiceRow title="Charts Registration UK / Ireland" price="£15" :selected="chartsUKSelected" flag-code="gb" @toggle="toggleChartsUK">
          <template #icon><ChartsIcon /></template>
        </ServiceRow>
        <ServiceRow title="Charts Registration US / Canada" price="£15" :selected="chartsUSSelected" flag-code="us" @toggle="toggleChartsUS">
          <template #icon><ChartsIcon /></template>
        </ServiceRow>
        <ServiceRow title="Charts Registration Australia" price="£15" :selected="chartsAUSelected" flag-code="au" @toggle="toggleChartsAU">
          <template #icon><ChartsIcon /></template>
        </ServiceRow>
        <ServiceRow title="Charts Registration Worldwide" price="£35" :selected="chartsWorldwideSelected" @toggle="toggleChartsWorldwide">
          <template #icon><ChartsGlobalIcon /></template>
        </ServiceRow>
      </div>
    </div>

    <!-- Distribution Services Section -->
    <div>
      <SectionHeader
        title="Distribution Services"
        description="Expand your release's reach with additional distribution options."
      />
      <div class="st__cards">
        <!-- Pre-release Downloads -->
        <FeatureCard
          title="Pre-release downloads"
          description="Offer pre-orders of your music on iTunes and Amazon, granting fans early access and instant gratification with select tracks."
          :checked="preReleaseSelected"
          price="+£29"
          @toggle="preReleaseSelected = !preReleaseSelected"
        >
          <template #icon><PreReleaseIcon /></template>
          
          <!-- Pre-release form -->
          <div v-if="preReleaseSelected" class="st__prerel-form" @click.stop>
            <div>
              <label class="st__form-label">Choose a Pre-order date</label>
              <div class="st__date-picker">
                <span class="st__date-val">{{ formattedPreOrderDate }}</span>
                <ChevronIcon class="st__date-chevron" />
              </div>
              <p v-if="preOrderDateWarning" class="st__date-warn">
                We cannot guarantee your pre-release will go live in less than 3 days, but will make sure it is available in stores as soon as possible.
              </p>
            </div>
            
            <!-- Instant Gratification toggle -->
            <div class="st__toggle-row">
              <div class="st__tooltip-wrap">
                <label class="st__toggle-label">Add Instant Gratification?</label>
                <div class="st__tooltip">
                  Unlock selected tracks immediately when fans pre-order, giving them a taste of your release before launch. Great for building hype and incentivizing early purchases.
                  <div class="st__tooltip-arrow"></div>
                </div>
              </div>
              <button
                @click="instantGratification = !instantGratification"
                class="st__toggle" :class="{ 'st__toggle--on': instantGratification }"
              >
                <div class="st__toggle-knob" :class="{ 'st__toggle-knob--on': instantGratification }" />
              </button>
            </div>
            
            <!-- Instant Gratification Track selection -->
            <div v-if="instantGratification">
              <label class="st__ig-label">
                Select up to <span class="st__ig-bold">{{ maxInstantGratTracks }}</span> {{ maxInstantGratTracks > 1 ? 'tracks' : 'track' }}
              </label>
              <div class="st__chip-list">
                <button
                  v-for="track in availableTracks" :key="track"
                  @click="toggleInstantGratTrack(track)"
                  :disabled="!selectedInstantGratTracks.includes(track) && selectedInstantGratTracks.length >= maxInstantGratTracks"
                  class="st__chip"
                  :class="[
                    selectedInstantGratTracks.includes(track) ? 'st__chip--sel' : 'st__chip--idle',
                    !selectedInstantGratTracks.includes(track) && selectedInstantGratTracks.length >= maxInstantGratTracks ? 'st__chip--disabled' : ''
                  ]"
                >
                  <svg v-if="selectedInstantGratTracks.includes(track)" width="12" height="12" viewBox="0 0 24 24" fill="none" class="st__chip-check">
                    <path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                  {{ track }}
                </button>
              </div>
              <p v-if="selectedInstantGratTracks.length === 0" class="st__ig-error">Please select at least one track</p>
            </div>
          </div>
        </FeatureCard>

        <!-- Auto-release -->
        <FeatureCard
          v-if="!isDittoPlus"
          title="Auto-release to new platforms"
          :badge="isStarter ? 'Included in Pro' : undefined"
          badge-variant="green"
          description="Automatically send this release to any new platforms we add in the future."
          :checked="includesAutoRelease ? autoReleaseEnabled : autoReleaseSelected"
          :is-free="includesAutoRelease"
          :price="includesAutoRelease ? undefined : '£10'"
          @toggle="includesAutoRelease ? (autoReleaseEnabled = !autoReleaseEnabled) : (autoReleaseSelected = !autoReleaseSelected)"
        >
          <template #icon><AutoReleaseIcon /></template>
        </FeatureCard>

        <!-- Release Protection -->
        <FeatureCard
          v-if="!isDittoPlus"
          title="Release Protection"
          :badge="isStarter ? 'Included in Pro' : undefined"
          badge-variant="green"
          description="Protect your release from unauthorized distribution across all platforms."
          :checked="includesReleaseProtection ? releaseProtectionEnabled : releaseProtectionSelected"
          :is-free="includesReleaseProtection"
          :price="includesReleaseProtection ? undefined : '£10'"
          @toggle="includesReleaseProtection ? (releaseProtectionEnabled = !releaseProtectionEnabled) : (releaseProtectionSelected = !releaseProtectionSelected)"
        >
          <template #icon><ReleaseProtectionIcon /></template>
        </FeatureCard>
      </div>
    </div>

    <!-- Advanced Stores Section -->
    <div>
      <SectionHeader
        title="Advanced Stores"
        description="Distribute to specialist music platforms."
      />
      <div class="st__cards">
        <!-- YouTube Content ID -->
        <FeatureCard
          title="YouTube Content ID & Shorts"
          :badge="isStarter ? 'Included in Pro' : undefined"
          badge-variant="green"
          description="Get notified & paid if your music is used in YouTube videos. Ad revenue goes to you."
          :checked="includesYouTube ? youTubeEnabled : youTubeSelected"
          :is-free="includesYouTube"
          :price="includesYouTube ? undefined : '£10'"
          @toggle="includesYouTube ? (youTubeEnabled = !youTubeEnabled) : (youTubeSelected = !youTubeSelected)"
        >
          <template #icon><img src="/images/YoutubeShorts.svg" alt="YouTube" class="st__store-icon" /></template>
        </FeatureCard>

        <!-- Audio Fingerprint Services -->
        <FeatureCard
          title="Audio Fingerprint Services"
          :badge="isStarter ? 'Included in Pro' : undefined"
          badge-variant="green"
          description="Register your music with audio fingerprinting services for identification and royalty collection."
          :checked="includesFingerprint ? fingerprintEnabled : false"
          :disabled="!includesFingerprint"
          :disabled-message="!includesFingerprint ? 'Upgrade to Pro to access Audio Fingerprint Services' : undefined"
          :disabled-message-is-link="!includesFingerprint"
          :is-free="includesFingerprint"
          @toggle="includesFingerprint ? (fingerprintEnabled = !fingerprintEnabled) : undefined"
        >
          <template #icon><img src="/images/audiofingerprint.svg" alt="Audio Fingerprint" class="st__store-icon" /></template>
          
          <!-- Fingerprint providers -->
          <div v-if="includesFingerprint && fingerprintEnabled" class="st__fp-providers">
            <div
              v-for="provider in fingerprintProviders" :key="provider.name"
              @click.stop="provider.enabled = !provider.enabled"
              class="st__fp-item" :class="{ 'st__fp-item--on': provider.enabled }"
            >
              <img :src="provider.icon" :alt="provider.name" class="st__fp-icon" />
              <span class="st__fp-name">{{ provider.name }}</span>
              <div class="st__fp-check" :class="{ 'st__fp-check--on': provider.enabled }">
                <svg v-if="provider.enabled" width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <path d="M20 6L9 17L4 12" stroke="#287ef7" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </div>
            </div>
          </div>
        </FeatureCard>

        <!-- Beatport -->
        <FeatureCard
          title="Beatport Distribution"
          description="You need a label set up with Beatport to release your music on this store."
          :checked="includesBeatport ? beatportEnabled : beatportSelected"
          :is-free="includesBeatport"
          :price="includesBeatport ? undefined : '£65'"
          @toggle="includesBeatport ? (beatportEnabled = !beatportEnabled) : (beatportSelected = !beatportSelected)"
        >
          <template #icon><img src="/images/beatport.svg" alt="Beatport" class="st__store-icon" /></template>
          
          <!-- Beatport form fields -->
          <div
            v-if="(includesBeatport && beatportEnabled) || (!includesBeatport && beatportSelected)"
            class="st__bp-form"
            @click.stop
          >
            <div>
              <label class="st__field-label">Beatport Label</label>
              <BeatportLabelDropdown
                v-model="beatportLabel"
                :options="beatportLabelOptions"
                @upgrade-label="handleUpgradeLabel"
                @add-new="openLabelModal"
              />
            </div>
            <div>
              <label class="st__field-label">Primary Genre</label>
              <CustomDropdown v-model="beatportPrimaryGenre" :options="beatportGenres" />
            </div>
            <div>
              <label class="st__field-label">Secondary Genre</label>
              <CustomDropdown v-model="beatportSecondaryGenre" :options="beatportGenres" />
            </div>
          </div>
        </FeatureCard>
      </div>
    </div>

    <!-- Checkout button -->
    <div v-if="selectedItems.length > 0" class="st__checkout">
      <CheckoutButton :item-count="selectedItems.length" :total="`£${totalPrice}`" />
    </div>

    <!-- Beatport Label Modal -->
    <BeatportLabelModal
      v-if="labelModalOpen"
      :step="modalStep"
      :label-to-upgrade="labelToUpgrade"
      :existing-labels="beatportLabelOptions"
      @close="labelModalOpen = false"
      @update:step="modalStep = $event"
      @select-label="handleSelectLabel"
      @add-label="handleAddLabel"
      @upgrade-label="handleConfirmUpgradeLabel"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import type { Plan, LabelOption, ModalStep } from '../types'
import SectionHeader from './SectionHeader.vue'
import ServiceRow from './ServiceRow.vue'
import FeatureCard from './FeatureCard.vue'
import CheckoutButton from './CheckoutButton.vue'
import CustomDropdown from './CustomDropdown.vue'
import BeatportLabelDropdown from './BeatportLabelDropdown.vue'
import BeatportLabelModal from './BeatportLabelModal.vue'
import { ChartsIcon, ChartsGlobalIcon, PreReleaseIcon, AutoReleaseIcon, ReleaseProtectionIcon, ChevronIcon } from './icons'

const props = defineProps<{
  plan: Plan
}>()

// Plan checks
const isPro = computed(() => props.plan === 'Pro')
const isLabel = computed(() => props.plan === 'Label')
const isDittoPlus = computed(() => props.plan === 'DittoPlusRLS')
const isStarter = computed(() => props.plan === 'Starter')

// Feature included with plan
const includesAutoRelease = computed(() => isPro.value || isLabel.value)
const includesReleaseProtection = computed(() => isPro.value || isLabel.value)
const includesYouTube = computed(() => isPro.value || isLabel.value || isDittoPlus.value)
const includesFingerprint = computed(() => isPro.value || isLabel.value || isDittoPlus.value)
const includesBeatport = computed(() => isDittoPlus.value)

// State for toggling included features (user must opt-in even if free)
const autoReleaseEnabled = ref(false)
const releaseProtectionEnabled = ref(false)
const youTubeEnabled = ref(false)
const fingerprintEnabled = ref(false)
const beatportEnabled = ref(false)

// Fingerprint providers
const fingerprintProviders = reactive([
  { name: 'Jaxsta', icon: '/images/Jaxsta.svg', enabled: true },
  { name: 'ACRCloud', icon: '/images/ACRCloud.svg', enabled: true },
  { name: 'SoundCloud', icon: '/images/Soundcloud.svg', enabled: true },
  { name: 'Gracenote', icon: '/images/Gracenote.svg', enabled: true },
  { name: 'SoundMouse', icon: '/images/SoundMouse.svg', enabled: true },
])

// State for selecting purchasable add-ons
const chartsUKSelected = ref(false)
const chartsUSSelected = ref(false)
const chartsAUSelected = ref(false)
const chartsWorldwideSelected = ref(false)
const preReleaseSelected = ref(false)
const autoReleaseSelected = ref(false)
const releaseProtectionSelected = ref(false)
const youTubeSelected = ref(false)
const beatportSelected = ref(false)

// Pre-release state
const showDatePicker = ref(false)
const preOrderDate = ref(new Date('2024-09-30'))
const instantGratification = ref(false)
const selectedInstantGratTracks = ref<string[]>([])
const availableTracks = ['My Big Day', 'Summer Nights', 'Into the Light', 'Dreamscape', 'Final Hour']

const toggleInstantGratTrack = (track: string) => {
  const index = selectedInstantGratTracks.value.indexOf(track)
  if (index > -1) {
    selectedInstantGratTracks.value.splice(index, 1)
  } else if (selectedInstantGratTracks.value.length < maxInstantGratTracks.value) {
    selectedInstantGratTracks.value.push(track)
  }
}

const formattedPreOrderDate = computed(() => {
  const options: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }
  return preOrderDate.value.toLocaleDateString('en-GB', options)
})

const preOrderDateWarning = computed(() => {
  const now = new Date()
  const diffDays = Math.ceil((preOrderDate.value.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  return diffDays < 3
})

// Max instant grat tracks based on release length: 1-3 tracks = 1, 4-7 = 2, 8-12 = 3
const releaseTrackCount = computed(() => availableTracks.length)
const maxInstantGratTracks = computed(() => {
  if (releaseTrackCount.value <= 3) return 1
  if (releaseTrackCount.value <= 7) return 2
  return 3
})

// Charts toggle handlers (mutual exclusivity with worldwide)
const toggleChartsUK = () => {
  chartsUKSelected.value = !chartsUKSelected.value
  if (chartsUKSelected.value) chartsWorldwideSelected.value = false
}
const toggleChartsUS = () => {
  chartsUSSelected.value = !chartsUSSelected.value
  if (chartsUSSelected.value) chartsWorldwideSelected.value = false
}
const toggleChartsAU = () => {
  chartsAUSelected.value = !chartsAUSelected.value
  if (chartsAUSelected.value) chartsWorldwideSelected.value = false
}
const toggleChartsWorldwide = () => {
  chartsWorldwideSelected.value = !chartsWorldwideSelected.value
  if (chartsWorldwideSelected.value) {
    chartsUKSelected.value = false
    chartsUSSelected.value = false
    chartsAUSelected.value = false
  }
}

// Beatport form state
const beatportLabel = ref('The Esoteric Order of Dagon Records')
const beatportPrimaryGenre = ref('Trance (Main Floor)')
const beatportSecondaryGenre = ref('Hard Techno')

// Beatport Label Modal state
const labelModalOpen = ref(false)
const modalStep = ref<ModalStep>('select')
const labelToUpgrade = ref<string | undefined>()

// Beatport label options
const beatportLabelOptions = ref<LabelOption[]>([
  { name: 'The Esoteric Order of Dagon Records', isBeatportLabel: true },
  { name: 'Anjunabeats', isBeatportLabel: true },
  { name: 'Drumcode', isBeatportLabel: false },
  { name: 'Defected Records', isBeatportLabel: false },
  { name: "Spinnin' Records", isBeatportLabel: true },
  { name: 'Armada Music', isBeatportLabel: false },
])

const beatportGenres = [
  'Afro House', 'Bass House', 'Breaks / Breakbeat / UK Bass', 'Dance / Pop', 'Deep House',
  'Drum & Bass', 'Dubstep', 'Electro House', 'Electronica', 'Hard Dance / Hardcore',
  'Hard Techno', 'House', 'Indie Dance', 'Melodic House & Techno', 'Minimal / Deep Tech',
  'Nu Disco / Disco', 'Organic House / Downtempo', 'Progressive House', 'Progressive Trance',
  'Psy-Trance', 'Tech House', 'Techno (Peak Time / Driving)', 'Techno (Raw / Deep / Hypnotic)',
  'Trance (Main Floor)', 'Trance (Raw / Deep / Hypnotic)', 'UK Garage / Bassline'
]

// Modal handlers
const openLabelModal = () => {
  modalStep.value = 'select'
  labelModalOpen.value = true
}

const handleUpgradeLabel = (labelName: string) => {
  labelToUpgrade.value = labelName
  modalStep.value = 'upgrade'
  labelModalOpen.value = true
}

const handleSelectLabel = (labelName: string) => {
  beatportLabel.value = labelName
  labelModalOpen.value = false
}

const handleAddLabel = (labelName: string) => {
  beatportLabelOptions.value.push({ name: labelName, isBeatportLabel: true })
  beatportLabel.value = labelName
  labelModalOpen.value = false
}

const handleConfirmUpgradeLabel = (labelName: string) => {
  const label = beatportLabelOptions.value.find(l => l.name === labelName)
  if (label) label.isBeatportLabel = true
  beatportLabel.value = labelName
  labelModalOpen.value = false
}

// Calculate checkout total (includes both paid and free selections)
const selectedItems = computed(() => {
  const items: { name: string; price: number }[] = []
  
  // Paid items
  if (chartsUKSelected.value) items.push({ name: 'Charts UK/Ireland', price: 15 })
  if (chartsUSSelected.value) items.push({ name: 'Charts US/Canada', price: 15 })
  if (chartsAUSelected.value) items.push({ name: 'Charts Australia', price: 15 })
  if (chartsWorldwideSelected.value) items.push({ name: 'Charts Worldwide', price: 35 })
  if (preReleaseSelected.value) items.push({ name: 'Pre-release Downloads', price: 29 })
  if (!includesAutoRelease.value && autoReleaseSelected.value) items.push({ name: 'Auto-release', price: 10 })
  if (!includesReleaseProtection.value && releaseProtectionSelected.value) items.push({ name: 'Release Protection', price: 10 })
  if (!includesYouTube.value && youTubeSelected.value) items.push({ name: 'YouTube Content ID', price: 10 })
  if (!includesBeatport.value && beatportSelected.value) items.push({ name: 'Beatport', price: 65 })
  
  // Free items (included with plan but user opted in)
  if (includesAutoRelease.value && autoReleaseEnabled.value) items.push({ name: 'Auto-release', price: 0 })
  if (includesReleaseProtection.value && releaseProtectionEnabled.value) items.push({ name: 'Release Protection', price: 0 })
  if (includesYouTube.value && youTubeEnabled.value) items.push({ name: 'YouTube Content ID', price: 0 })
  if (includesFingerprint.value && fingerprintEnabled.value) items.push({ name: 'Audio Fingerprint', price: 0 })
  if (includesBeatport.value && beatportEnabled.value) items.push({ name: 'Beatport', price: 0 })
  
  return items
})

const totalPrice = computed(() => selectedItems.value.reduce((sum, item) => sum + item.price, 0))
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;
@use '@/styles/mixins' as *;

.st {
  width: 100%;
  max-width: 820px;
  padding: 0 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  min-height: 100vh;

  @include sm { padding: 0 1rem; }
  @include md { padding: 0; gap: 2rem; }

  &__title {
    font-size: $text-h2;
    font-weight: 900;
    color: var(--blue);
    font-family: $font-satoshi;
    letter-spacing: -0.03em;
  }

  &__list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  &__cards {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  /* Pre-release form */
  &__prerel-form {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    padding-top: 0.75rem;
    padding-right: 5rem;
  }

  &__form-label {
    display: block;
    font-size: $text-sm;
    color: var(--blue);
    font-family: $font-satoshi;
    font-weight: 500;
    margin-bottom: 0.5rem;
  }

  &__date-picker {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: #fff;
    border-radius: $radius-card;
    padding: 0.75rem;
    cursor: pointer;
    transition: background 0.15s;

    &:hover { background: var(--lighter-grey); }
  }

  &__date-val {
    flex: 1;
    font-size: $text-body;
    color: var(--brand-secondary);
    font-family: $font-satoshi;
  }

  &__date-chevron {
    width: 1.25rem;
    height: 1.25rem;
    color: var(--ditto-grey);
  }

  &__date-warn {
    margin-top: 0.5rem;
    font-size: $text-xs;
    color: var(--brand-secondary);
    font-family: $font-satoshi;
  }

  /* Toggle */
  &__toggle-row {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  &__tooltip-wrap {
    position: relative;

    &:hover .st__tooltip { opacity: 1; }
  }

  &__toggle-label {
    font-size: $text-sm;
    color: var(--blue);
    font-family: $font-satoshi;
    font-weight: 500;
    cursor: help;
  }

  &__tooltip {
    position: absolute;
    bottom: 100%;
    left: 0;
    margin-bottom: 0.5rem;
    padding: 0.5rem 0.75rem;
    background: var(--blue);
    color: #fff;
    font-size: $text-xs;
    border-radius: $radius-lg;
    width: 18rem;
    opacity: 0;
    transition: opacity 0.15s;
    pointer-events: none;
    z-index: 10;
  }

  &__tooltip-arrow {
    position: absolute;
    top: 100%;
    left: 1rem;
    border: 4px solid transparent;
    border-top-color: var(--blue);
  }

  &__toggle {
    position: relative;
    width: 3rem;
    height: 1.75rem;
    border-radius: 9999px;
    background: var(--faded-grey);
    transition: background 0.15s;
    cursor: pointer;

    &--on { background: var(--success); }
  }

  &__toggle-knob {
    position: absolute;
    top: 2px;
    left: 2px;
    width: 1.5rem;
    height: 1.5rem;
    background: #fff;
    border-radius: 9999px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
    transition: transform 0.15s;

    &--on { transform: translateX(22px); }
  }

  /* IG track chips */
  &__ig-label {
    display: block;
    font-size: $text-xs;
    color: var(--ditto-grey);
    font-family: $font-satoshi;
    margin-bottom: 0.5rem;
  }

  &__ig-bold { font-weight: 600; }

  &__ig-error {
    margin-top: 0.5rem;
    font-size: $text-xs;
    color: var(--error);
    font-family: $font-satoshi;
  }

  &__chip-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  &__chip {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.375rem 0.75rem;
    border-radius: $radius-lg;
    font-size: $text-sm;
    font-weight: 500;
    font-family: $font-satoshi;
    cursor: pointer;
    transition: all 0.15s;
    border: 1px solid;

    &--sel {
      border-color: var(--brand-secondary);
      background: #fff;
      color: var(--brand-secondary);
    }

    &--idle {
      border-color: var(--faded-grey);
      background: var(--light-grey);
      color: var(--ditto-grey);

      &:hover { border-color: rgba($color-brand-secondary, 0.5); }
    }

    &--disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  &__chip-check { flex-shrink: 0; }

  /* Store icons */
  &__store-icon { width: 2rem; height: 2rem; }

  /* Fingerprint providers */
  &__fp-providers {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-top: 0.5rem;

    @include sm { gap: 0.75rem; }
  }

  &__fp-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0.75rem;
    background: #fff;
    border-radius: $radius-card;
    cursor: pointer;
    transition: background 0.15s;

    &:hover { background: var(--lighter-grey); }
    &--on { background: rgba($color-brand-secondary, 0.05); }

    @include sm {
      gap: 0.75rem;
      padding: 0.75rem 1rem;
    }
  }

  &__fp-icon {
    width: 1.25rem;
    height: 1.25rem;

    @include sm { width: 1.5rem; height: 1.5rem; }
  }

  &__fp-name {
    font-size: $text-xs;
    font-weight: 500;
    color: var(--blue);
    font-family: $font-satoshi;

    @include sm { font-size: $text-sm; }
  }

  &__fp-check {
    width: 1.25rem;
    height: 1.25rem;
    border-radius: 9999px;
    border: 2px solid var(--faded-grey);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: border-color 0.15s;
    background: #fff;

    &--on { border-color: var(--brand-secondary); }

    @include sm { width: 1.5rem; height: 1.5rem; }
  }

  /* Beatport form */
  &__bp-form {
    display: grid;
    grid-template-columns: 1fr;
    gap: 0.75rem;
    margin-top: 0.5rem;

    @include md {
      grid-template-columns: 2fr 1fr 1fr;
      gap: 1rem;
    }
  }

  &__field-label {
    display: block;
    font-size: $text-xs;
    color: var(--ditto-grey);
    margin-bottom: 0.25rem;
    font-family: $font-satoshi;
  }

  /* Checkout */
  &__checkout {
    margin-top: 1rem;
    position: sticky;
    bottom: 1rem;
  }
}
</style>
