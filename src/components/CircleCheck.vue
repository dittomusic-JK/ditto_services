<template>
  <div
    @click.stop="onClick"
    class="circle-check"
    :class="{
      'circle-check--checked': checked,
      'circle-check--disabled': disabled
    }"
  >
    <svg v-if="checked" width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M20 6L9 17L4 12"
        stroke="#2680EB"
        stroke-width="3.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  checked: boolean
  disabled?: boolean
}>()

const emit = defineEmits<{
  click: []
}>()

const onClick = () => {
  if (!props.disabled) {
    emit('click')
  }
}
</script>

<style lang="scss" scoped>
.circle-check {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  border: 3px solid var(--faded-grey);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
  background: #fff;
  cursor: pointer;

  @include sm {
    width: 2.25rem;
    height: 2.25rem;
  }

  &:hover:not(.circle-check--disabled):not(.circle-check--checked) {
    border-color: #2680EB;
  }

  &--checked {
    border-color: #2680EB;
  }

  &--disabled {
    opacity: 0.5;
    cursor: default;
  }
}
</style>
