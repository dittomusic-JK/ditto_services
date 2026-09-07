<template>
  <div class="rba">
    <p class="rba__hint">App-native prototype &mdash; the AI disclosure in the mobile release builder. Declare on Release Details; mark credits per track.</p>

    <!-- Phone (same frame as the splits app prototype) -->
    <div class="rba__phone">
      <div class="rba__appbar">
        <div class="rba__appbar-start">
          <img src="https://picsum.photos/seed/goldenboy/72/72" alt="" class="rba__avatar" />
        </div>
        <span class="rba__appbar-title">{{ form.title }}</span>
        <div class="rba__appbar-end">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
        </div>
      </div>

      <!-- Stage progress (live app: 5 purple/grey pills) -->
      <div class="rba__progress">
        <span v-for="n in 5" :key="n" class="rba__seg" :class="{ 'rba__seg--on': n <= stage }"></span>
      </div>

      <div class="rba__screen" ref="screenRef">
        <AppReleaseDetailsScreen
          v-if="screen === 'details'"
          :form="form"
          :visited="detailsVisited"
          @back="noop"
          @next="goCredits"
        />
        <AppTrackCreditsScreen
          v-else
          :form="form"
          :track="form.tracks[0]"
          @back="goDetails"
          @save="goDetails"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import AppReleaseDetailsScreen from '../components/release-builder-app/AppReleaseDetailsScreen.vue'
import AppTrackCreditsScreen from '../components/release-builder-app/AppTrackCreditsScreen.vue'

export interface AppBuilderCredit {
  key: string
  category: string
  name: string
  role?: string
  ai: boolean
}
export interface AppBuilderTrack {
  number: number
  title: string
  credits: AppBuilderCredit[]
}
export interface AppBuilderForm {
  title: string
  artistType: 'artist' | 'compilation'
  copyrightHolder: string
  label: string
  genre: string
  language: string
  aiDisclosure: '' | 'none' | 'partial' | 'full'
  tracks: AppBuilderTrack[]
}

const form = reactive<AppBuilderForm>({
  title: 'My Big Day',
  artistType: 'artist',
  copyrightHolder: 'Earn First',
  label: 'Independent',
  genre: 'Alternative',
  language: 'English (British)',
  aiDisclosure: '',
  tracks: [
    {
      number: 1,
      title: 'My Big Day',
      credits: [
        { key: 'composer', category: 'Composer', name: 'James Keane', ai: false },
        { key: 'songwriter', category: 'Songwriter', name: 'James Keane', role: 'Lyricist', ai: false },
        { key: 'production', category: 'Production/Engineer', name: 'James Keane', role: 'Producer', ai: false },
        { key: 'performer', category: 'Performer', name: 'James Keane', role: 'Lead Vocals', ai: false },
      ],
    },
  ],
})

const screen = ref<'details' | 'credits'>('details')
const stage = ref(2)
const detailsVisited = ref(false)
const screenRef = ref<HTMLElement | null>(null)

const scrollTop = () => { if (screenRef.value) screenRef.value.scrollTop = 0 }
const goCredits = () => { detailsVisited.value = true; if (!form.aiDisclosure) { scrollToAi(); return } screen.value = 'credits'; scrollTop() }
const goDetails = () => { screen.value = 'details'; scrollTop() }
const scrollToAi = () => { screenRef.value?.querySelector('.ard__ai')?.scrollIntoView({ behavior: 'smooth', block: 'center' }) }
const noop = () => {}
</script>

<style lang="scss" scoped>
.rba {
  padding: 2rem 1rem 3rem;
  display: flex;
  flex-direction: column;
  align-items: center;

  &__hint { font-size: $text-xs; color: var(--ditto-grey); font-family: $font-satoshi; margin-bottom: 1.25rem; text-align: center; max-width: 30rem; }

  &__phone {
    width: 393px; max-width: 100%; height: 820px; background: var(--lighter-grey);
    border-radius: 3rem; border: 10px solid var(--blue); box-shadow: 0 24px 64px rgba(16, 31, 60, 0.28);
    display: flex; flex-direction: column; overflow: hidden;
  }
  &__appbar { display: flex; align-items: center; justify-content: space-between; height: 52px; padding: 0 1.25rem 0 1rem; flex-shrink: 0; color: var(--blue); }
  &__appbar-start, &__appbar-end { display: flex; align-items: center; flex: 1 0 0; }
  &__appbar-end { justify-content: flex-end; }
  &__avatar { width: 36px; height: 36px; border-radius: 50%; object-fit: cover; }
  &__appbar-title { font-size: 18px; font-weight: 500; color: var(--blue); font-family: $font-satoshi; white-space: nowrap; }

  &__progress { display: flex; gap: 0.5rem; padding: 0.4rem 1.25rem 0.75rem; flex-shrink: 0; }
  &__seg { flex: 1; height: 8px; border-radius: 9999px; background: var(--faded-grey); &--on { background: var(--brand-primary); } }

  &__screen { flex: 1; overflow-y: auto; position: relative; scrollbar-width: none; &::-webkit-scrollbar { display: none; } }
}
</style>
