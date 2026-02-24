<template>
  <Teleport to="body">
    <div class="blm-overlay" @click="$emit('close')">
      <div class="blm" @click.stop>
        <!-- Select Step -->
        <template v-if="step === 'select'">
          <h2 class="blm__h2">Create a Beatport Label</h2>
          <p class="blm__desc">Upgrade one of your existing labels or add a new one. The label you select for Beatport here will overwrite any previously added for this release across all platforms.</p>

          <div class="blm__list">
            <div
              v-for="label in existingLabels" :key="label.name"
              @click="selectedLabel = label.name"
              class="blm__label-row" :class="{ 'blm__label-row--sel': selectedLabel === label.name }"
            >
              <div class="blm__label-left">
                <span class="blm__label-name">{{ label.name }}</span>
                <img v-if="label.isBeatportLabel" src="/images/beatporticon.svg" alt="Beatport" class="blm__label-icon" />
              </div>
              <div class="blm__label-right">
                <svg v-if="selectedLabel === label.name" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M16.6667 5L7.50001 14.1667L3.33334 10" stroke="#2680EB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                <ChevronIcon />
              </div>
            </div>
          </div>

          <div class="blm__create-row" @click="$emit('update:step', 'add')">
            <PlusCircleIcon />
            <span class="blm__create-text">Create a Beatport Label</span>
          </div>
        </template>

        <!-- Add Step -->
        <template v-else-if="step === 'add'">
          <div class="blm__back-row">
            <button @click="$emit('update:step', 'select')" class="blm__back-btn"><BackIcon /></button>
            <h2 class="blm__h2">Add Beatport Label</h2>
          </div>

          <div class="blm__section">
            <div class="blm__field">
              <label class="blm__label-txt">Label Name</label>
              <input v-model="newLabelName" type="text" placeholder="Label Name" class="blm__input" />
            </div>

            <div class="blm__section">
              <h3 class="blm__h3">Label Artwork</h3>
              <p class="blm__desc blm__desc--sm">Your label artwork must be a jpg, jpeg or png file no larger than 5Mb and at least 500x500 pixels in size.</p>
              <div class="blm__dropzone">
                <ImageUploadIcon />
                <p class="blm__dropzone-text">Drag and drop your artwork or<br /><span class="blm__dropzone-link">browse your files</span></p>
              </div>
            </div>
          </div>

          <button @click="$emit('addLabel', newLabelName)" :disabled="!newLabelName" class="blm__submit">Add Label</button>
        </template>

        <!-- Upgrade Step -->
        <template v-else-if="step === 'upgrade'">
          <div class="blm__back-row blm__back-row--tight">
            <button @click="$emit('update:step', 'select')" class="blm__back-btn"><BackIcon /></button>
            <h2 class="blm__h2">Upgrade Label</h2>
          </div>
          <p class="blm__desc">Set up {{ labelToUpgrade }} as a Beatport label.</p>

          <div class="blm__section">
            <div class="blm__field">
              <label class="blm__label-txt">Label Name</label>
              <div class="blm__locked-field">
                <span class="blm__locked-val">{{ labelToUpgrade }}</span>
                <LockIcon />
              </div>
            </div>

            <div class="blm__section">
              <h3 class="blm__h3">Label Artwork</h3>
              <p class="blm__desc blm__desc--sm">Your label artwork must be a jpg, jpeg or png file no larger than 5Mb and at least 500x500 pixels in size.</p>
              <div class="blm__dropzone">
                <ImageUploadIcon />
                <p class="blm__dropzone-text">Drag and drop your artwork or<br /><span class="blm__dropzone-link">browse your files</span></p>
              </div>
            </div>
          </div>

          <button @click="$emit('upgradeLabel', labelToUpgrade)" class="blm__submit">Upgrade Label</button>
        </template>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { BackIcon, PlusCircleIcon, LockIcon, ImageUploadIcon, ChevronIcon } from './icons'
import type { LabelOption, ModalStep } from '../types'

defineProps<{
  step: ModalStep
  labelToUpgrade?: string
  existingLabels: LabelOption[]
}>()

defineEmits<{
  close: []
  'update:step': [step: ModalStep]
  selectLabel: [label: string]
  addLabel: [label: string]
  upgradeLabel: [label: string]
}>()

const newLabelName = ref('')
const selectedLabel = ref('')
</script>

<style lang="scss" scoped>
.blm-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.blm {
  background: #fff;
  border-radius: $radius-card;
  padding: 1.5rem;
  width: 480px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);

  &__h2 {
    font-size: $text-h2;
    font-weight: 700;
    color: var(--text-fill);
    font-family: $font-poppins;
    margin-bottom: 0.5rem;
  }

  &__h3 {
    font-size: $text-body;
    font-weight: 700;
    color: var(--text-fill);
    font-family: $font-satoshi;
    margin-bottom: 0.5rem;
  }

  &__desc {
    font-size: $text-sm;
    color: var(--ditto-grey);
    font-family: $font-satoshi;
    margin-bottom: 1.5rem;

    &--sm { margin-bottom: 1rem; }
  }

  &__list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    margin-bottom: 1.5rem;
  }

  &__label-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem;
    border-radius: $radius-card;
    border: 1px solid $color-border-grey;
    cursor: pointer;
    transition: all 0.15s;

    &:hover { border-color: var(--brand-secondary); }

    &--sel {
      border-color: var(--brand-secondary);
      background: rgba($color-brand-secondary, 0.05);
    }
  }

  &__label-left {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  &__label-name {
    font-size: $text-sm;
    font-weight: 500;
    color: var(--text-fill);
    font-family: $font-satoshi;
  }

  &__label-icon { width: 1rem; height: 1rem; }

  &__label-right {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  &__create-row {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 1rem;
    border-radius: $radius-card;
    border: 1px solid $color-border-grey;
    cursor: pointer;
    transition: border-color 0.15s;

    &:hover { border-color: var(--brand-secondary); }
  }

  &__create-text {
    font-size: $text-sm;
    font-weight: 600;
    color: var(--text-fill);
    font-family: $font-satoshi;
  }

  &__back-row {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 1.5rem;

    &--tight { margin-bottom: 0.5rem; }
  }

  &__back-btn {
    padding: 0.25rem;
    border-radius: $radius-lg;
    transition: background 0.15s;

    &:hover { background: var(--lighter-grey); }
  }

  &__section {
    border-top: 1px solid $color-border-grey;
    padding-top: 1rem;
  }

  &__field { margin-bottom: 1rem; }

  &__label-txt {
    display: block;
    font-size: $text-xs;
    color: var(--ditto-grey);
    margin-bottom: 0.25rem;
    font-family: $font-satoshi;
  }

  &__input {
    width: 100%;
    padding: 0.75rem;
    border-bottom: 2px solid $color-border-grey;
    font-size: $text-sm;
    color: var(--text-fill);
    font-family: $font-satoshi;
    background: transparent;

    &:focus {
      border-color: var(--brand-secondary);
      outline: none;
    }
  }

  &__locked-field {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.75rem;
    border-bottom: 2px solid $color-border-grey;
  }

  &__locked-val {
    font-size: $text-sm;
    color: var(--text-fill);
    font-family: $font-satoshi;
  }

  &__dropzone {
    border: 2px dashed $color-border-grey;
    border-radius: $radius-card;
    padding: 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  &__dropzone-text {
    font-size: $text-sm;
    color: var(--ditto-grey);
    font-family: $font-satoshi;
    text-align: center;
  }

  &__dropzone-link {
    color: var(--text-fill);
    text-decoration: underline;
    cursor: pointer;
  }

  &__submit {
    width: 100%;
    margin-top: 1.5rem;
    padding: 1rem;
    border-radius: $radius-button;
    background: var(--text-fill);
    color: #fff;
    font-weight: 600;
    font-size: $text-body;
    transition: background 0.15s;

    &:hover { background: #1a2d4d; }
    &:disabled { opacity: 0.5; cursor: not-allowed; }
  }
}
</style>
