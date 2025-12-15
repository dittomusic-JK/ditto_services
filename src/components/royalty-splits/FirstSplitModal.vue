<template>
  <Teleport to="body">
    <div
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]"
      @click="$emit('close')"
    >
      <div
        class="bg-white rounded-2xl p-4 sm:p-6 w-full sm:w-[440px] max-w-[95vw] shadow-xl mx-2 sm:mx-0"
        @click.stop
      >
        <h2 class="text-lg sm:text-xl font-bold text-ditto-blue font-poppins mb-4">
          You've set up your first split! 🎉
        </h2>
        
        <p class="text-sm font-medium text-ditto-blue font-satoshi mb-3">
          Here's how it works:
        </p>

        <!-- Steps -->
        <div class="space-y-4 mb-6">
          <div class="flex gap-3">
            <div class="w-8 h-8 rounded-full bg-brand-secondary/10 flex items-center justify-center shrink-0">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M14 4L6 12L2 8" stroke="#287EF7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div>
              <p class="text-sm font-medium text-ditto-blue font-satoshi">We'll email your collaborator</p>
              <p class="text-xs text-ditto-grey font-satoshi">They'll receive an invite to confirm their share</p>
            </div>
          </div>

          <div class="flex gap-3">
            <div class="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="6" stroke="#F59E0B" stroke-width="2"/>
                <path d="M8 5V8.5L10 10" stroke="#F59E0B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div>
              <p class="text-sm font-medium text-ditto-blue font-satoshi">They can accept or decline</p>
              <p class="text-xs text-ditto-grey font-satoshi">The split is pending until they respond</p>
            </div>
          </div>

          <div class="flex gap-3">
            <div class="w-8 h-8 rounded-full bg-ditto-purple/10 flex items-center justify-center shrink-0">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 1V15M1 8H15" stroke="#6C5CE7" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </div>
            <div>
              <p class="text-sm font-medium text-ditto-blue font-satoshi">Royalties stay yours until confirmed</p>
              <p class="text-xs text-ditto-grey font-satoshi">Splits only apply from the confirmation date</p>
            </div>
          </div>
        </div>

        <p class="text-xs text-ditto-grey font-satoshi mb-6">
          You can resend confirmation emails from this page anytime.
        </p>

        <button
          @click="$emit('close')"
          class="w-full px-6 py-3 bg-brand-secondary text-white rounded-full text-sm font-semibold font-satoshi hover:bg-brand-secondary/90 transition-colors"
        >
          Got it
        </button>

        <!-- Copy to other tracks link -->
        <button
          v-if="otherTracksCount > 0"
          @click="$emit('copy-to-all')"
          class="w-full mt-3 text-sm font-medium text-brand-secondary font-satoshi hover:underline transition-colors"
        >
          or Copy this split to {{ otherTracksCount === 1 ? '1 other track' : `all ${otherTracksCount} other tracks` }} →
        </button>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
defineProps<{
  otherTracksCount?: number
}>()

defineEmits<{
  close: []
  'copy-to-all': []
}>()
</script>
