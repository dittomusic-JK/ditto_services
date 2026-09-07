<template>
  <!-- Mobile Track Credits: each credit line carries "Created with AI" on a
       partially-AI release; entirely-AI locks every line on; Not AI hides it. -->
  <div class="atc">
    <div class="atc__head">
      <button class="atc__back" @click="$emit('back')" aria-label="Back">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15,18 9,12 15,6"/></svg>
      </button>
      <div>
        <h1 class="atc__title">Track Credits</h1>
        <p class="atc__sub">{{ track.number }}. {{ track.title }}</p>
      </div>
    </div>

    <div v-if="form.aiDisclosure === 'partial'" class="atc__banner">
      <span class="atc__banner-dot"></span>
      <span>Partially AI — tick <b>Created with AI</b> on any credit that was. Leave the rest unticked.</span>
    </div>
    <div v-else-if="form.aiDisclosure === 'full'" class="atc__banner atc__banner--locked">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
      <span>Entirely AI — every credit is marked as created with AI.</span>
    </div>

    <div v-for="credit in track.credits" :key="credit.key" class="atc__credit">
      <div class="atc__field">
        <span class="atc__label">{{ credit.category }}</span>
        <span class="atc__value">{{ credit.name || 'Add name' }}</span>
      </div>
      <div v-if="credit.role !== undefined" class="atc__field atc__field--chev">
        <span class="atc__label">Role</span>
        <span class="atc__value" :class="{ 'atc__value--empty': !credit.role }">{{ credit.role || 'Select role' }}</span>
      </div>

      <!-- Created with AI -->
      <button
        v-if="showAi"
        class="atc__ai"
        :class="{ 'atc__ai--locked': locked }"
        :disabled="locked"
        @click="credit.ai = !credit.ai"
      >
        <span class="atc__box" :class="{ 'atc__box--on': locked || credit.ai }">
          <svg v-if="locked || credit.ai" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        </span>
        Created with AI
        <svg v-if="locked" class="atc__lock" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
      </button>
    </div>

    <button class="atc__add">
      <span class="atc__add-plus">+</span> Add another credit
    </button>

    <div class="atc__actions">
      <button class="atc__back-btn" @click="$emit('back')">Back</button>
      <button class="atc__save" @click="$emit('save')">Save</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { AppBuilderForm, AppBuilderTrack } from '../../views/ReleaseBuilderAppView.vue'

const props = defineProps<{ form: AppBuilderForm; track: AppBuilderTrack }>()
defineEmits<{ back: []; save: [] }>()

const showAi = computed(() => props.form.aiDisclosure === 'partial' || props.form.aiDisclosure === 'full')
const locked = computed(() => props.form.aiDisclosure === 'full')
</script>

<style lang="scss" scoped>
.atc {
  padding-bottom: 1.5rem;
  font-family: $font-satoshi;
  color: var(--blue);

  &__head { display: flex; align-items: center; gap: 0.75rem; padding: 1rem 1.25rem 0.75rem; }
  &__back { width: 36px; height: 36px; border-radius: 50%; background: var(--light-grey); display: inline-flex; align-items: center; justify-content: center; color: var(--blue); flex-shrink: 0; }
  &__title { font-family: $font-poppins; font-weight: 700; font-size: 26px; letter-spacing: -0.02em; line-height: 1.1; }
  &__sub { font-size: 13px; color: var(--ditto-grey); margin-top: 0.15rem; }

  &__banner {
    margin: 0.25rem 1.25rem 0.75rem; padding: 0.7rem 0.9rem; border-radius: 0.8rem;
    background: rgba(108, 92, 231, 0.08); color: var(--blue); font-size: 12.5px; line-height: 1.45;
    display: flex; align-items: flex-start; gap: 0.5rem;
    b { font-weight: 700; }
    &--locked { background: var(--light-grey); color: var(--ditto-grey); align-items: center; }
  }
  &__banner-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--brand-primary); flex-shrink: 0; margin-top: 0.35rem; }

  &__credit { border-top: 1px solid var(--faded-grey); padding: 0.4rem 0 0.9rem; }
  &__field {
    display: flex; flex-direction: column; gap: 0.15rem; padding: 0.6rem 1.25rem; position: relative;
    &--chev::after { content: ''; position: absolute; right: 1.35rem; top: 55%; width: 8px; height: 8px; border-right: 2px solid var(--ditto-grey); border-bottom: 2px solid var(--ditto-grey); transform: translateY(-70%) rotate(45deg); opacity: 0.7; }
  }
  &__label { font-size: 12px; color: var(--ditto-grey); }
  &__value { font-size: 18px; &--empty { color: var(--ditto-grey); opacity: 0.6; } }

  &__ai {
    display: inline-flex; align-items: center; gap: 0.6rem; margin: 0.15rem 1.25rem 0; font-size: 14px; color: var(--blue);
    &--locked { color: var(--ditto-grey); }
  }
  &__box {
    width: 22px; height: 22px; border-radius: 6px; border: 1.5px solid var(--faded-grey); background: #fff;
    display: inline-flex; align-items: center; justify-content: center; color: #fff; transition: all 0.15s;
    &--on { border-color: var(--brand-primary); background: var(--brand-primary); }
  }
  .atc__ai--locked .atc__box--on { opacity: 0.6; }
  &__lock { color: var(--ditto-grey); }

  &__add { display: flex; align-items: center; gap: 0.6rem; margin: 0.25rem 1.25rem 0; padding: 0.85rem 0; font-size: 15px; font-weight: 500; color: var(--blue); border-top: 1px solid var(--faded-grey); width: calc(100% - 2.5rem); }
  &__add-plus { width: 26px; height: 26px; border-radius: 50%; background: var(--blue); color: #fff; display: inline-flex; align-items: center; justify-content: center; font-size: 18px; line-height: 1; }

  &__actions { display: flex; gap: 0.75rem; padding: 1.25rem 1.25rem 0; }
  &__back-btn, &__save { flex: 1; height: 52px; border-radius: 9999px; font-size: 17px; font-weight: 500; }
  &__back-btn { background: var(--light-grey); color: var(--blue); }
  &__save { background: var(--brand-primary); color: #fff; }
}
</style>
