<template>
  <Teleport to="body">
    <div
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]"
      @click.self="$emit('cancel')"
    >
      <div
        class="bg-white rounded-2xl w-full sm:w-[400px] max-w-[95vw] shadow-xl mx-2 sm:mx-0"
        @click.stop
      >
        <!-- Header -->
        <div class="p-4 sm:p-6">
          <div class="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" class="text-amber-600">
              <path d="M12 9V13M12 17H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          
          <h2 class="text-lg font-bold text-ditto-blue font-poppins text-center mb-2">
            Unsaved Changes
          </h2>
          
          <p class="text-sm text-ditto-grey font-satoshi text-center">
            You have unsaved changes to your royalty splits. Do you want to save before leaving?
          </p>
        </div>

        <!-- Actions -->
        <div class="p-4 sm:p-6 pt-0 flex flex-col gap-2">
          <button
            @click="$emit('save')"
            class="w-full px-6 py-2.5 bg-brand-secondary text-white rounded-full text-sm font-semibold font-satoshi hover:bg-brand-secondary/90 transition-colors"
          >
            Save Changes
          </button>
          <button
            @click="$emit('discard')"
            class="w-full px-6 py-2.5 border border-faded-grey rounded-full text-sm font-semibold text-ditto-grey font-satoshi hover:border-error hover:text-error transition-colors"
          >
            Discard Changes
          </button>
          <button
            @click="$emit('cancel')"
            class="w-full px-6 py-2.5 text-sm font-medium text-ditto-grey font-satoshi hover:text-ditto-blue transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
defineEmits<{
  save: []
  discard: []
  cancel: []
}>()
</script>
