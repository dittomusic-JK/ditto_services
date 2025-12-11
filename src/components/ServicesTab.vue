<template>
  <div class="w-full max-w-[820px] px-2 sm:px-4 md:px-0 flex flex-col gap-6 md:gap-8 min-h-screen">
    <h1 class="text-2xl font-bold text-[#0e112c] font-['Poppins']">
      Services
    </h1>

    <!-- Charts Registration Section -->
    <div>
      <SectionHeader
        title="Charts Registration"
        description="Register your release with official music charts to track your chart positions."
      />
      <div class="flex flex-col gap-3">
        <ServiceRow
          title="Charts Registration UK / Ireland"
          price="£15"
          :selected="chartsUKSelected"
          flag-code="gb"
          @toggle="toggleChartsUK"
        >
          <template #icon><ChartsIcon /></template>
        </ServiceRow>
        <ServiceRow
          title="Charts Registration US / Canada"
          price="£15"
          :selected="chartsUSSelected"
          flag-code="us"
          @toggle="toggleChartsUS"
        >
          <template #icon><ChartsIcon /></template>
        </ServiceRow>
        <ServiceRow
          title="Charts Registration Australia"
          price="£15"
          :selected="chartsAUSelected"
          flag-code="au"
          @toggle="toggleChartsAU"
        >
          <template #icon><ChartsIcon /></template>
        </ServiceRow>
        <ServiceRow
          title="Charts Registration Worldwide"
          price="£35"
          :selected="chartsWorldwideSelected"
          @toggle="toggleChartsWorldwide"
        >
          <template #icon><ChartsGlobalIcon /></template>
        </ServiceRow>
      </div>
    </div>

    <!-- Pre-release Downloads Section -->
    <div>
      <SectionHeader
        title="Pre-release Downloads"
        description="Allow fans to download your release before the official release date."
      />
      <ServiceRow
        title="Pre-release Downloads"
        price="£29"
        :selected="preReleaseSelected"
        @toggle="preReleaseSelected = !preReleaseSelected"
      >
        <template #icon><PreReleaseIcon /></template>
      </ServiceRow>
    </div>

    <!-- Distribution Services Section -->
    <div>
      <SectionHeader
        title="Distribution Services"
        description="Expand your release's reach with additional distribution options."
      />
      <div class="flex flex-col gap-4">
        <!-- Auto-release - hidden for Ditto+ RLS (always on) -->
        <FeatureCard
          v-if="!isDittoPlus"
          title="Auto-release to new platforms"
          :badge="includesAutoRelease ? (isPro ? 'Included with Pro' : 'Included with Label') : isStarter ? 'Included in Pro' : undefined"
          :badge-variant="includesAutoRelease ? 'green' : 'grey'"
          description="Automatically send this release to any new platforms we add in the future."
          :checked="includesAutoRelease ? autoReleaseEnabled : autoReleaseSelected"
          :is-free="includesAutoRelease"
          :price="includesAutoRelease ? undefined : '£10'"
          @toggle="includesAutoRelease ? (autoReleaseEnabled = !autoReleaseEnabled) : (autoReleaseSelected = !autoReleaseSelected)"
        >
          <template #icon><AutoReleaseIcon /></template>
        </FeatureCard>

        <!-- Release Protection - hidden for Ditto+ RLS (always on) -->
        <FeatureCard
          v-if="!isDittoPlus"
          title="Release Protection"
          :badge="includesReleaseProtection ? (isPro ? 'Included with Pro' : 'Included with Label') : isStarter ? 'Included in Pro' : undefined"
          :badge-variant="includesReleaseProtection ? 'green' : 'grey'"
          description="Protect your release from unauthorized distribution across all platforms."
          :checked="includesReleaseProtection ? releaseProtectionEnabled : releaseProtectionSelected"
          :is-free="includesReleaseProtection"
          :price="includesReleaseProtection ? undefined : '£10'"
          @toggle="includesReleaseProtection ? (releaseProtectionEnabled = !releaseProtectionEnabled) : (releaseProtectionSelected = !releaseProtectionSelected)"
        >
          <template #icon><ReleaseProtectionIcon /></template>
        </FeatureCard>

        <!-- YouTube Content ID -->
        <FeatureCard
          title="YouTube Content ID & Shorts"
          :badge="includesYouTube ? (isPro ? 'Included with Pro' : isLabel ? 'Included with Label' : undefined) : isStarter ? 'Included in Pro' : undefined"
          :badge-variant="includesYouTube ? 'green' : 'grey'"
          description="Get notified & paid if your music is used in YouTube videos. Ad revenue goes to you."
          :checked="includesYouTube ? youTubeEnabled : youTubeSelected"
          :is-free="includesYouTube"
          :price="includesYouTube ? undefined : '£10'"
          @toggle="includesYouTube ? (youTubeEnabled = !youTubeEnabled) : (youTubeSelected = !youTubeSelected)"
        >
<template #icon><img src="/images/YoutubeShorts.svg" alt="YouTube" class="w-8 h-8" /></template>
        </FeatureCard>

        <!-- Audio Fingerprint Services -->
        <FeatureCard
          title="Audio Fingerprint Services"
          :badge="includesFingerprint ? (isPro ? 'Included with Pro' : isLabel ? 'Included with Label' : 'Included with ++ Label Services') : isStarter ? 'Available in Pro' : undefined"
          :badge-variant="includesFingerprint ? 'green' : 'grey'"
          description="Register your music with audio fingerprinting services for identification and royalty collection."
          :checked="includesFingerprint ? fingerprintEnabled : false"
          :disabled="!includesFingerprint"
          :disabled-message="!includesFingerprint ? 'Upgrade to Pro to access Audio Fingerprint Services' : undefined"
          :disabled-message-is-link="!includesFingerprint"
          :is-free="includesFingerprint"
          @toggle="includesFingerprint ? (fingerprintEnabled = !fingerprintEnabled) : undefined"
        >
          <template #icon><img src="/images/audiofingerprint.svg" alt="Audio Fingerprint" class="w-8 h-8" /></template>
          
          <!-- Fingerprint providers -->
          <div v-if="includesFingerprint && fingerprintEnabled" class="flex flex-wrap gap-2 sm:gap-3 mt-2">
            <div
              v-for="provider in fingerprintProviders"
              :key="provider.name"
              @click.stop="provider.enabled = !provider.enabled"
              class="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 bg-white rounded-xl border cursor-pointer transition-all"
              :class="provider.enabled ? 'border-[#2680EB]' : 'border-[#e5e5e5] hover:border-[#2680EB]'"
            >
              <img :src="provider.icon" :alt="provider.name" class="w-5 h-5 sm:w-6 sm:h-6" />
              <span class="text-xs sm:text-sm font-medium text-[#101F3C] font-['Satoshi-Regular']">{{ provider.name }}</span>
              <div
                class="w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center transition-all bg-white"
                :class="provider.enabled ? 'border-[#2680EB]' : 'border-[#D2D2E3]'"
              >
                <svg v-if="provider.enabled" width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <path d="M20 6L9 17L4 12" stroke="#2680EB" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </div>
            </div>
          </div>
        </FeatureCard>

        <!-- Beatport -->
        <FeatureCard
          title="Beatport Distribution"
          :badge="includesBeatport ? 'Included with ++ Label Services' : undefined"
          badge-variant="green"
          description="You need a label set up with Beatport to release your music on this store."
          :checked="includesBeatport ? beatportEnabled : beatportSelected"
          :is-free="includesBeatport"
          :price="includesBeatport ? undefined : '£65'"
          @toggle="includesBeatport ? (beatportEnabled = !beatportEnabled) : (beatportSelected = !beatportSelected)"
        >
          <template #icon><img src="/images/beatport.svg" alt="Beatport" class="w-8 h-8" /></template>
          
          <!-- Beatport form fields -->
          <div
            v-if="(includesBeatport && beatportEnabled) || (!includesBeatport && beatportSelected)"
            class="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr] gap-3 md:gap-4 mt-2"
            @click.stop
          >
            <div>
              <label class="block text-xs text-[#626984] mb-1 font-['Satoshi-Regular']">
                Beatport Label
              </label>
              <BeatportLabelDropdown
                v-model="beatportLabel"
                :options="beatportLabelOptions"
                @upgrade-label="handleUpgradeLabel"
                @add-new="openLabelModal"
              />
            </div>
            <div>
              <label class="block text-xs text-[#626984] mb-1 font-['Satoshi-Regular']">
                Primary Genre
              </label>
              <CustomDropdown v-model="beatportPrimaryGenre" :options="beatportGenres" />
            </div>
            <div>
              <label class="block text-xs text-[#626984] mb-1 font-['Satoshi-Regular']">
                Secondary Genre
              </label>
              <CustomDropdown v-model="beatportSecondaryGenre" :options="beatportGenres" />
            </div>
          </div>
        </FeatureCard>
      </div>
    </div>

    <!-- Checkout button -->
    <div v-if="selectedItems.length > 0" class="mt-4 sticky bottom-4">
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
import { ChartsIcon, ChartsGlobalIcon, PreReleaseIcon, AutoReleaseIcon, ReleaseProtectionIcon } from './icons'

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

// Calculate checkout total
const selectedItems = computed(() => {
  const items: { name: string; price: number }[] = []
  
  if (chartsUKSelected.value) items.push({ name: 'Charts UK/Ireland', price: 15 })
  if (chartsUSSelected.value) items.push({ name: 'Charts US/Canada', price: 15 })
  if (chartsAUSelected.value) items.push({ name: 'Charts Australia', price: 15 })
  if (chartsWorldwideSelected.value) items.push({ name: 'Charts Worldwide', price: 35 })
  if (preReleaseSelected.value) items.push({ name: 'Pre-release Downloads', price: 29 })
  if (!includesAutoRelease.value && autoReleaseSelected.value) items.push({ name: 'Auto-release', price: 10 })
  if (!includesReleaseProtection.value && releaseProtectionSelected.value) items.push({ name: 'Release Protection', price: 10 })
  if (!includesYouTube.value && youTubeSelected.value) items.push({ name: 'YouTube Content ID', price: 10 })
  if (!includesBeatport.value && beatportSelected.value) items.push({ name: 'Beatport', price: 65 })
  
  return items
})

const totalPrice = computed(() => selectedItems.value.reduce((sum, item) => sum + item.price, 0))
</script>
