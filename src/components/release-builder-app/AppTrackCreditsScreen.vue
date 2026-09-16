<template>
  <!-- Mobile Track Credits: each credit carries an AI level (No / Partly / Fully AI) on a
       partially-AI release; entirely-AI locks every credit to Fully AI; Not AI hides it. -->
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
      <span>Partially AI — set the <b>AI level</b> on each credit. They start as No AI.</span>
    </div>
    <div v-else-if="form.aiDisclosure === 'full'" class="atc__banner atc__banner--locked">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
      <span>Entirely AI — every credit is set to Fully AI.</span>
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

      <!-- AI level (replaces the checkbox): a list row that opens an inline picker -->
      <template v-if="showAi">
        <button
          class="atc__field atc__field--chev atc__field--btn"
          :class="{ 'atc__field--locked': locked }"
          :disabled="locked"
          @click="openPicker = openPicker === credit.key ? null : credit.key"
        >
          <span class="atc__label">AI</span>
          <span class="atc__value" :class="{ 'atc__value--ai': !locked && credit.ai !== 'none' }">{{ locked ? 'Fully AI' : levelLabel(credit.ai) }}</span>
          <svg v-if="locked" class="atc__lock" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
        </button>
        <div v-if="openPicker === credit.key && !locked" class="atc__picker">
          <button
            v-for="opt in aiLevels"
            :key="opt.value"
            class="atc__opt"
            :class="{ 'atc__opt--on': credit.ai === opt.value }"
            @click="credit.ai = opt.value; openPicker = null"
          >
            <span class="atc__radio" :class="{ 'atc__radio--on': credit.ai === opt.value }">
              <svg v-if="credit.ai === opt.value" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20,6 9,17 4,12"/></svg>
            </span>
            {{ opt.label }}
          </button>
        </div>
      </template>
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
import { computed, ref } from 'vue'
import type { AppBuilderForm, AppBuilderTrack, CreditAiLevel } from '../../views/ReleaseBuilderAppView.vue'

const props = defineProps<{ form: AppBuilderForm; track: AppBuilderTrack }>()
defineEmits<{ back: []; save: [] }>()

const aiLevels: { value: CreditAiLevel; label: string }[] = [
  { value: 'none', label: 'No AI' },
  { value: 'partial', label: 'Partly AI' },
  { value: 'full', label: 'Fully AI' },
]
const levelLabel = (v: CreditAiLevel) => aiLevels.find(o => o.value === v)?.label ?? 'No AI'
const openPicker = ref<string | null>(null)

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

  &__field--btn {
    width: 100%;
    text-align: left;
    background: none;
    font: inherit;
    color: inherit;
  }

  &__field--locked { opacity: 0.7; }

  &__value--ai { color: var(--brand-secondary); }

  &__lock { color: var(--ditto-grey); margin-left: 0.25rem; }

  &__picker {
    margin: 0.25rem 1.25rem 0.75rem;
    border: 1px solid var(--faded-grey);
    border-radius: 0.75rem;
    overflow: hidden;
  }

  &__opt {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 0.625rem;
    padding: 0.75rem 0.875rem;
    font-size: $text-sm;
    text-align: left;
    color: var(--blue);
    border-bottom: 1px solid var(--faded-grey);
    &:last-child { border-bottom: 0; }
    &--on { color: var(--brand-secondary); font-weight: 600; }
  }

  &__radio {
    width: 1.125rem;
    height: 1.125rem;
    border-radius: 9999px;
    border: 2px solid var(--faded-grey);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    flex-shrink: 0;
    &--on { background: var(--brand-secondary); border-color: var(--brand-secondary); }
  }
}
</style>
