<template>
  <div class="spv">
    <h1 class="spv__title">Services</h1>

    <!-- Charts Registration Section -->
    <div>
      <SectionHeader
        title="Charts Registration"
        description="Register your release with official music charts to track your chart positions."
      />
      <div class="spv__list">
        <ServiceRow title="Charts Registration UK / Ireland" price="£15" :selected="false" flag-code="gb" status="unavailable" unavailable-tooltip="You've already purchased worldwide chart registration" @toggle="() => {}">
          <template #icon><ChartsIcon /></template>
        </ServiceRow>
        <ServiceRow title="Charts Registration US / Canada" price="£15" :selected="false" flag-code="us" status="unavailable" unavailable-tooltip="You've already purchased worldwide chart registration" @toggle="() => {}">
          <template #icon><ChartsIcon /></template>
        </ServiceRow>
        <ServiceRow title="Charts Registration Australia" price="£15" :selected="false" flag-code="au" status="unavailable" unavailable-tooltip="You've already purchased worldwide chart registration" @toggle="() => {}">
          <template #icon><ChartsIcon /></template>
        </ServiceRow>
        <ServiceRow title="Charts Registration Worldwide" price="£35" :selected="false" status="active" @toggle="() => {}">
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
      <div class="spv__cards">
        <FeatureCard
          title="Pre-release downloads"
          description="Offer pre-orders of your music on iTunes and Amazon, granting fans early access and instant gratification with select tracks."
          :checked="false" :disabled="true"
          disabled-message="This release is already live and no longer eligible for a pre-release campaign"
        >
          <template #icon><PreReleaseIcon /></template>
        </FeatureCard>

        <FeatureCard
          title="Auto-release to new platforms"
          badge="Purchased" badge-variant="green"
          description="Automatically send this release to any new platforms we add in the future."
          :checked="true" :disabled="true" @toggle="() => {}"
        >
          <template #icon><AutoReleaseIcon /></template>
        </FeatureCard>

        <FeatureCard
          title="Release Protection"
          description="Protect your release from unauthorized distribution across all platforms."
          :checked="releaseProtectionSelected" price="£10"
          @toggle="releaseProtectionSelected = !releaseProtectionSelected"
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
      <div class="spv__cards">
        <FeatureCard
          title="YouTube Content ID & Shorts"
          description="Get notified & paid if your music is used in YouTube videos. Ad revenue goes to you."
          :checked="youTubeSelected" price="£10"
          @toggle="youTubeSelected = !youTubeSelected"
        >
          <template #icon><img src="/images/YoutubeShorts.svg" alt="YouTube" class="spv__store-icon" /></template>
        </FeatureCard>

        <FeatureCard
          title="Audio Fingerprint Services"
          description="Register your music with audio fingerprinting services for identification and royalty collection."
          :checked="fingerprintSelected" price="£15"
          @toggle="fingerprintSelected = !fingerprintSelected"
        >
          <template #icon><img src="/images/audiofingerprint.svg" alt="Audio Fingerprint" class="spv__store-icon" /></template>
          
          <div v-if="fingerprintSelected" class="spv__fp-providers">
            <div
              v-for="provider in fingerprintProviders" :key="provider.name"
              @click.stop="provider.enabled = !provider.enabled"
              class="spv__fp-item" :class="{ 'spv__fp-item--on': provider.enabled }"
            >
              <img :src="provider.icon" :alt="provider.name" class="spv__fp-icon" />
              <span class="spv__fp-name">{{ provider.name }}</span>
              <div class="spv__fp-check" :class="{ 'spv__fp-check--on': provider.enabled }">
                <svg v-if="provider.enabled" width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <path d="M20 6L9 17L4 12" stroke="#287ef7" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </div>
            </div>
          </div>
        </FeatureCard>

        <FeatureCard
          title="Beatport Distribution"
          description="You need a label set up with Beatport to release your music on this store."
          :checked="beatportSelected" price="£65"
          @toggle="beatportSelected = !beatportSelected"
        >
          <template #icon><img src="/images/beatport.svg" alt="Beatport" class="spv__store-icon" /></template>
          
          <div v-if="beatportSelected" class="spv__bp-form" @click.stop>
            <div>
              <label class="spv__field-label">Beatport Label</label>
              <BeatportLabelDropdown
                v-model="beatportLabel"
                :options="beatportLabelOptions"
                @upgrade-label="handleUpgradeLabel"
                @add-new="openLabelModal"
              />
            </div>
            <div>
              <label class="spv__field-label">Primary Genre</label>
              <CustomDropdown v-model="beatportPrimaryGenre" :options="beatportGenres" />
            </div>
            <div>
              <label class="spv__field-label">Secondary Genre</label>
              <CustomDropdown v-model="beatportSecondaryGenre" :options="beatportGenres" />
            </div>
          </div>
        </FeatureCard>
      </div>
    </div>

    <!-- Checkout button -->
    <div v-if="selectedItems.length > 0" class="spv__checkout">
      <CheckoutButton :item-count="selectedItems.length" :total="`£${totalPrice}`" />
    </div>

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
import type { LabelOption, ModalStep } from '../types'
import SectionHeader from './SectionHeader.vue'
import ServiceRow from './ServiceRow.vue'
import FeatureCard from './FeatureCard.vue'
import CheckoutButton from './CheckoutButton.vue'
import CustomDropdown from './CustomDropdown.vue'
import BeatportLabelDropdown from './BeatportLabelDropdown.vue'
import BeatportLabelModal from './BeatportLabelModal.vue'
import { ChartsIcon, ChartsGlobalIcon, PreReleaseIcon, AutoReleaseIcon, ReleaseProtectionIcon } from './icons'

// Purchasable items state
const releaseProtectionSelected = ref(false)
const youTubeSelected = ref(false)
const fingerprintSelected = ref(false)
const beatportSelected = ref(false)

// Fingerprint providers
const fingerprintProviders = reactive([
  { name: 'Jaxsta', icon: '/images/Jaxsta.svg', enabled: true },
  { name: 'ACRCloud', icon: '/images/ACRCloud.svg', enabled: true },
  { name: 'SoundCloud', icon: '/images/Soundcloud.svg', enabled: true },
  { name: 'Gracenote', icon: '/images/Gracenote.svg', enabled: true },
  { name: 'SoundMouse', icon: '/images/SoundMouse.svg', enabled: true },
])

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
  if (releaseProtectionSelected.value) items.push({ name: 'Release Protection', price: 10 })
  if (youTubeSelected.value) items.push({ name: 'YouTube Content ID', price: 10 })
  if (fingerprintSelected.value) items.push({ name: 'Audio Fingerprint', price: 15 })
  if (beatportSelected.value) items.push({ name: 'Beatport', price: 65 })
  return items
})

const totalPrice = computed(() => selectedItems.value.reduce((sum, item) => sum + item.price, 0))
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;
@use '@/styles/mixins' as *;

.spv {
  width: 100%;
  max-width: 820px;
  padding: 0 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  @include sm { padding: 0 1rem; }
  @include md { padding: 0; gap: 2rem; }

  &__title {
    font-size: $text-h2;
    font-weight: 700;
    color: var(--blue);
    font-family: $font-poppins;
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

  &__checkout {
    margin-top: 1rem;
    position: sticky;
    bottom: 1rem;
  }
}
</style>
