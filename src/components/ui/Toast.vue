<template>
  <Teleport to="body">
    <Transition name="toast">
      <div
        v-if="visible"
        class="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-3 px-4 py-3 bg-white border border-faded-grey rounded-xl shadow-lg max-w-[90vw]"
      >
        <!-- Icon based on type -->
        <div
          class="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
          :class="iconBgClass"
        >
          <svg v-if="type === 'success'" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M13.333 4L6 11.333 2.667 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <svg v-else-if="type === 'info'" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="2"/>
            <path d="M8 5.5V5.51M8 7.5V10.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          <svg v-else-if="type === 'warning'" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 6V8.5M8 10.5V10.51" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <path d="M6.856 2.487L1.213 12.5C1.074 12.74 1 13.012 1 13.29C1 14.232 1.768 15 2.71 15H13.29C14.232 15 15 14.232 15 13.29C15 13.012 14.926 12.74 14.787 12.5L9.144 2.487C8.64 1.613 7.36 1.613 6.856 2.487Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>

        <!-- Message -->
        <p class="text-sm font-medium text-ditto-blue font-satoshi">{{ message }}</p>

        <!-- Close button -->
        <button
          @click="$emit('close')"
          class="p-1 text-ditto-grey hover:text-ditto-blue transition-colors shrink-0"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  visible: boolean
  message: string
  type?: 'success' | 'info' | 'warning'
}>(), {
  type: 'success'
})

defineEmits<{
  close: []
}>()

const iconBgClass = computed(() => {
  switch (props.type) {
    case 'success': return 'bg-success/10 text-success'
    case 'warning': return 'bg-amber-100 text-amber-600'
    case 'info': 
    default: return 'bg-brand-secondary/10 text-brand-secondary'
  }
})
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translate(-50%, 20px);
}
</style>
