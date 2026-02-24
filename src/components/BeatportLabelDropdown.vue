<template>
  <div ref="dropdownRef" class="bp-dropdown">
    <div
      @click="isOpen = !isOpen"
      class="bp-dropdown__trigger"
      :class="{ 'bp-dropdown__trigger--open': isOpen }"
    >
      <div class="bp-dropdown__selected">
        <span class="bp-dropdown__label">{{ modelValue || 'Select label...' }}</span>
        <img
          v-if="selectedOption?.isBeatportLabel"
          src="/images/beatporticon.svg"
          alt="Beatport"
          class="bp-dropdown__bp-icon"
        />
      </div>
      <ChevronIcon :rotated="isOpen" />
    </div>
    <div v-if="isOpen" class="bp-dropdown__menu">
      <div
        v-for="option in options"
        :key="option.name"
        @click="handleSelect(option)"
        class="bp-dropdown__option"
        :class="{ 'bp-dropdown__option--selected': option.name === modelValue }"
      >
        <span class="bp-dropdown__option-name">{{ option.name }}</span>
        <img
          v-if="option.isBeatportLabel"
          src="/images/beatporticon.svg"
          alt="Beatport"
          class="bp-dropdown__bp-icon bp-dropdown__bp-icon--option"
        />
      </div>
      <div @click="handleAddNew" class="bp-dropdown__add-new">
        + Add New Beatport Label
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { ChevronIcon } from './icons'
import type { LabelOption } from '../types'

const props = defineProps<{
  modelValue: string
  options: LabelOption[]
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  upgradeLabel: [label: string]
  addNew: []
}>()

const isOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

const selectedOption = computed(() => props.options.find(o => o.name === props.modelValue))

const handleSelect = (option: LabelOption) => {
  if (option.isBeatportLabel) {
    emit('update:modelValue', option.name)
  } else {
    emit('upgradeLabel', option.name)
  }
  isOpen.value = false
}

const handleAddNew = () => {
  emit('addNew')
  isOpen.value = false
}

const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside)
})
</script>

<style lang="scss" scoped>
.bp-dropdown {
  position: relative;

  &__trigger {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.75rem;
    background: #fff;
    border-radius: $radius-lg;
    border: 1px solid var(--faded-grey);
    cursor: pointer;
    transition: all 0.15s ease;

    &:hover {
      border-color: var(--brand-secondary);
    }

    &--open {
      border-color: var(--brand-secondary);
    }
  }

  &__selected {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    overflow: hidden;
    text-overflow: ellipsis;
    padding-right: 0.5rem;
  }

  &__label {
    font-size: $text-sm;
    color: var(--blue);
    font-family: $font-satoshi;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__bp-icon {
    width: 1rem;
    height: 1rem;
    flex-shrink: 0;

    &--option {
      margin-left: 0.5rem;
    }
  }

  &__menu {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    margin-top: 0.25rem;
    background: #fff;
    border-radius: $radius-lg;
    border: 1px solid var(--faded-grey);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
    z-index: 50;
    max-height: 240px;
    overflow-y: auto;
  }

  &__option {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.625rem 0.75rem;
    font-size: $text-sm;
    font-family: $font-satoshi;
    cursor: pointer;
    transition: background-color 0.1s ease, color 0.1s ease;
    color: var(--blue);

    &:hover {
      background: var(--lighter-grey);
    }

    &--selected {
      background: rgba($color-brand-secondary, 0.1);
      color: var(--brand-secondary);
    }
  }

  &__option-name {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__add-new {
    padding: 0.625rem 0.75rem;
    font-size: $text-sm;
    font-weight: 600;
    color: var(--brand-secondary);
    font-family: $font-satoshi;
    cursor: pointer;
    transition: background-color 0.1s ease;
    border-top: 1px solid var(--faded-grey);

    &:hover {
      background: rgba($color-brand-secondary, 0.05);
    }
  }
}
</style>
