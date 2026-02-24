<template>
  <div ref="dropdownRef" class="dropdown">
    <div
      @click="options.length > 0 ? (isOpen = !isOpen) : undefined"
      class="dropdown__trigger"
      :class="triggerModifier"
    >
      <span class="dropdown__value" :class="{ 'dropdown__value--placeholder': !modelValue }">
        {{ modelValue || placeholder }}
      </span>
      <div class="dropdown__indicators">
        <div v-if="hasWarning" class="dropdown__badge dropdown__badge--warning">!</div>
        <div v-if="hasError" class="dropdown__badge dropdown__badge--error">!</div>
        <ChevronIcon v-if="options.length > 0" :rotated="isOpen" />
      </div>
    </div>
    <div v-if="isOpen" class="dropdown__menu">
      <div
        v-for="option in options"
        :key="option"
        @click="selectOption(option)"
        class="dropdown__option"
        :class="{ 'dropdown__option--selected': option === modelValue }"
      >
        {{ option }}
      </div>
      <div v-if="addNewLabel" @click="handleAddNew" class="dropdown__add-new">
        + {{ addNewLabel }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { ChevronIcon } from './icons'

const props = withDefaults(defineProps<{
  modelValue: string
  options: string[]
  placeholder?: string
  addNewLabel?: string
  hasWarning?: boolean
  hasError?: boolean
}>(), {
  placeholder: 'Select...'
})

const triggerModifier = computed(() => {
  if (props.hasError) return 'dropdown__trigger--error'
  if (props.hasWarning) return 'dropdown__trigger--warning'
  if (isOpen.value) return 'dropdown__trigger--open'
  return ''
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  addNew: []
}>()

const isOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

const selectOption = (option: string) => {
  emit('update:modelValue', option)
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
.dropdown {
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

    &--error {
      border-color: var(--error);
    }

    &--warning {
      border-color: var(--warning);
    }
  }

  &__value {
    font-size: $text-sm;
    font-family: $font-satoshi;
    color: var(--blue);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding-right: 0.5rem;

    &--placeholder {
      color: var(--ditto-grey);
    }
  }

  &__indicators {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  &__badge {
    width: 1.25rem;
    height: 1.25rem;
    border-radius: 50%;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: $text-xs;
    font-weight: 700;

    &--warning {
      background: var(--brand-secondary);
    }

    &--error {
      background: var(--error);
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
