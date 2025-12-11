<template>
  <div
    @click="!disabled ? $emit('toggle') : undefined"
    class="rounded-2xl border border-faded-grey bg-lighter-grey p-3 sm:p-4 overflow-visible"
    :class="disabled ? 'opacity-70' : 'cursor-pointer hover:border-brand-secondary'"
  >
    <div class="flex items-start sm:items-center justify-between gap-3 sm:gap-4">
      <div class="flex items-start sm:items-center gap-2 sm:gap-3 flex-1 min-w-0">
        <div class="w-8 h-8 sm:w-10 sm:h-10 shrink-0 flex items-center justify-center mt-0.5 sm:mt-0">
          <slot name="icon" />
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 flex-wrap">
            <h3 class="text-sm sm:text-base font-semibold text-ditto-blue font-satoshi">
              {{ title }}
            </h3>
            <PlanBadge v-if="badge" :text="badge" :variant="badgeVariant" />
          </div>
          <p class="mt-1 text-[13px] sm:text-sm text-ditto-grey font-satoshi leading-relaxed">
            {{ description }}
          </p>
          <a
            v-if="disabled && disabledMessage && disabledMessageIsLink"
            href="#"
            class="mt-1 block text-xs text-ditto-starter font-satoshi underline hover:opacity-80"
          >
            {{ disabledMessage }}
          </a>
          <p
            v-else-if="disabled && disabledMessage"
            class="mt-1 text-xs text-ditto-grey font-satoshi italic"
          >
            {{ disabledMessage }}
          </p>
        </div>
      </div>
      <div class="flex items-center gap-2 sm:gap-3 shrink-0">
        <span v-if="isFree" class="text-[13px] sm:text-sm font-bold text-ditto-pro font-satoshi">
          Free
        </span>
        <span v-else-if="price" class="text-[13px] sm:text-sm font-bold text-ditto-blue font-satoshi">
          {{ price }}
        </span>
        <CircleCheck :checked="checked" :disabled="disabled" @click="$emit('toggle')" />
      </div>
    </div>
    <div v-if="$slots.default" class="mt-5 overflow-visible ml-10 sm:ml-[52px]">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import PlanBadge from './PlanBadge.vue'
import CircleCheck from './CircleCheck.vue'

withDefaults(defineProps<{
  title: string
  badge?: string
  badgeVariant?: 'green' | 'grey'
  description: string
  checked: boolean
  disabled?: boolean
  disabledMessage?: string
  disabledMessageIsLink?: boolean
  price?: string
  isFree?: boolean
}>(), {
  badgeVariant: 'green'
})

defineEmits<{
  toggle: []
}>()
</script>
