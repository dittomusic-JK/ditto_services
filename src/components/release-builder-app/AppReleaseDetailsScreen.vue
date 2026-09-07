<template>
  <!-- Mobile app Release Details — list-row idiom from the live app, with the
       new Spotify/Apple AI declaration folded in after Language. -->
  <div class="ard">
    <h1 class="ard__title">Release Details</h1>

    <div class="ard__radios">
      <button class="ard__radio" :class="{ 'ard__radio--on': form.artistType === 'artist' }" @click="form.artistType = 'artist'">
        <span class="ard__circle" :class="{ 'ard__circle--on': form.artistType === 'artist' }"><CheckMark v-if="form.artistType === 'artist'" /></span>Artist/Band
      </button>
      <button class="ard__radio" :class="{ 'ard__radio--on': form.artistType === 'compilation' }" @click="form.artistType = 'compilation'">
        <span class="ard__circle" :class="{ 'ard__circle--on': form.artistType === 'compilation' }"><CheckMark v-if="form.artistType === 'compilation'" /></span>Compilation/Various Artists
      </button>
    </div>

    <div class="ard__row"><span class="ard__label">Release Title</span><span class="ard__value">{{ form.title }}</span></div>
    <div class="ard__row ard__row--chev"><span class="ard__label">Copyright Holder</span><span class="ard__value">{{ form.copyrightHolder }}</span></div>
    <div class="ard__row ard__row--chev"><span class="ard__label">Record Label</span><span class="ard__value">{{ form.label }}</span></div>
    <div class="ard__row ard__row--chev"><span class="ard__label">Primary Genre</span><span class="ard__value">{{ form.genre }}</span></div>
    <div class="ard__row ard__row--chev"><span class="ard__label">Language</span><span class="ard__value">{{ form.language }}</span></div>

    <!-- ── AI disclosure ── -->
    <div class="ard__ai">
      <div class="ard__ai-head">
        <p class="ard__ai-title">Does this release use AI?</p>
        <span class="ard__req">Required</span>
      </div>
      <p class="ard__ai-sub">Spotify and Apple Music now require every release to declare whether it contains AI-generated content.</p>

      <button
        v-for="opt in aiOptions"
        :key="opt.id"
        class="ard__ai-opt"
        :class="{ 'ard__ai-opt--on': form.aiDisclosure === opt.id }"
        @click="form.aiDisclosure = opt.id"
      >
        <span class="ard__circle" :class="{ 'ard__circle--on': form.aiDisclosure === opt.id }"><CheckMark v-if="form.aiDisclosure === opt.id" /></span>
        <span class="ard__ai-opt-body">
          <span class="ard__ai-opt-label">{{ opt.label }}</span>
          <span class="ard__ai-opt-blurb">{{ opt.blurb }}</span>
        </span>
      </button>

      <p v-if="form.aiDisclosure === 'partial'" class="ard__ai-hint">Tick "Created with AI" on any credit in each track's credits — a track with none ticked has no AI content.</p>
      <p v-else-if="form.aiDisclosure === 'full'" class="ard__ai-hint">Every credit on this release will be marked as created with AI automatically.</p>
      <p v-else-if="visited && !form.aiDisclosure" class="ard__ai-error">Please declare whether this release uses AI.</p>
    </div>

    <div class="ard__actions">
      <button class="ard__back" @click="$emit('back')">Back</button>
      <button class="ard__next" @click="$emit('next')">Next</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { h, defineComponent } from 'vue'
import type { AppBuilderForm } from '../../views/ReleaseBuilderAppView.vue'

defineProps<{ form: AppBuilderForm; visited?: boolean }>()
defineEmits<{ back: []; next: [] }>()

const aiOptions = [
  { id: 'none', label: 'Not AI', blurb: 'No AI-generated content on this release.' },
  { id: 'partial', label: 'Partially AI', blurb: 'AI was used for part of this release.' },
  { id: 'full', label: 'Entirely AI', blurb: 'This release is fully AI-generated.' },
] as const

const CheckMark = defineComponent(() => () =>
  h('svg', { width: 14, height: 14, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 3.2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [h('polyline', { points: '20 6 9 17 4 12' })]),
)
</script>

<style lang="scss" scoped>
.ard {
  padding-bottom: 1.5rem;
  font-family: $font-satoshi;
  color: var(--blue);

  &__title {
    font-family: $font-poppins;
    font-weight: 700;
    font-size: 30px;
    letter-spacing: -0.02em;
    padding: 1.25rem 1.25rem 0.75rem;
  }

  &__radios { padding: 0 1.25rem 1rem; display: flex; flex-direction: column; gap: 0.75rem; }
  &__radio { display: flex; align-items: center; gap: 0.75rem; font-size: 17px; text-align: left; }

  &__circle {
    width: 26px; height: 26px; border-radius: 50%; border: 2px solid var(--faded-grey);
    display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; color: #fff; transition: all 0.15s;
    &--on { border-color: var(--brand-secondary); background: var(--brand-secondary); }
  }

  &__row {
    display: flex; flex-direction: column; gap: 0.2rem;
    padding: 0.9rem 1.25rem; border-top: 1px solid var(--faded-grey); position: relative;
    &--chev::after { content: ''; position: absolute; right: 1.35rem; top: 50%; width: 8px; height: 8px; border-right: 2px solid var(--ditto-grey); border-bottom: 2px solid var(--ditto-grey); transform: translateY(-70%) rotate(45deg); opacity: 0.7; }
  }
  &__label { font-size: 12px; color: var(--ditto-grey); }
  &__value { font-size: 19px; }

  /* AI declaration */
  &__ai { border-top: 1px solid var(--faded-grey); padding: 1.1rem 1.25rem 0.5rem; }
  &__ai-head { display: flex; align-items: center; gap: 0.5rem; }
  &__ai-title { font-size: 17px; font-weight: 700; }
  &__req { font-size: 9px; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase; color: #fff; background: var(--brand-primary); border-radius: 9999px; padding: 0.15rem 0.5rem; }
  &__ai-sub { font-size: 13px; color: var(--ditto-grey); line-height: 1.45; margin: 0.35rem 0 0.9rem; }
  &__ai-opt {
    width: 100%; display: flex; align-items: flex-start; gap: 0.75rem; text-align: left;
    padding: 0.85rem 0.9rem; border-radius: 0.9rem; border: 1.5px solid var(--faded-grey); margin-bottom: 0.6rem; background: #fff; transition: border-color 0.15s, background 0.15s;
    &--on { border-color: var(--brand-secondary); background: rgba(40, 126, 247, 0.05); }
  }
  &__ai-opt-body { display: flex; flex-direction: column; gap: 0.1rem; }
  &__ai-opt-label { font-size: 16px; font-weight: 700; }
  &__ai-opt-blurb { font-size: 12.5px; color: var(--ditto-grey); }
  &__ai-hint { font-size: 12.5px; color: var(--ditto-grey); line-height: 1.45; margin-top: 0.4rem; }
  &__ai-error { font-size: 12.5px; color: var(--error); margin-top: 0.4rem; }

  &__actions { display: flex; gap: 0.75rem; padding: 1.25rem 1.25rem 0; }
  &__back, &__next { flex: 1; height: 52px; border-radius: 9999px; font-size: 17px; font-weight: 500; }
  &__back { background: var(--light-grey); color: var(--blue); }
  &__next { background: var(--brand-primary); color: #fff; }
}
</style>
