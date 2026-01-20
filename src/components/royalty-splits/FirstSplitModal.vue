<template>
  <Teleport to="body">
    <div
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]"
      @click="$emit('close')"
    >
      <div
        class="rounded-2xl p-4 sm:p-6 w-full sm:w-[440px] max-w-[95vw] shadow-xl mx-2 sm:mx-0"
        :class="isRLS ? 'bg-rls-card' : 'bg-white'"
        @click.stop
      >
        <h2 class="text-lg sm:text-xl font-bold font-poppins mb-4" :class="isRLS ? 'text-rls-text' : 'text-ditto-blue'">
          You've set up your first split! 🎉
        </h2>
        
        <p class="text-sm font-medium font-satoshi mb-3" :class="isRLS ? 'text-rls-text' : 'text-ditto-blue'">
          Here's how it works:
        </p>

        <!-- Steps for Subscription mode -->
        <div v-if="!isRLS" class="space-y-4 mb-6">
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

        <!-- Steps for RLS mode -->
        <div v-else class="space-y-4 mb-6">
          <div class="flex gap-3">
            <div class="w-8 h-8 rounded-full bg-rls-success/20 flex items-center justify-center shrink-0">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M14 4L6 12L2 8" stroke="#00ff99" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div>
              <p class="text-sm font-medium text-rls-text font-satoshi">Royalties split immediately</p>
              <p class="text-xs text-rls-text-secondary font-satoshi">We'll start allocating their share right away</p>
            </div>
          </div>

          <div class="flex gap-3">
            <div class="w-8 h-8 rounded-full bg-rls-highlight/20 flex items-center justify-center shrink-0">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <rect x="2" y="4" width="12" height="8" rx="1" stroke="#ffb100" stroke-width="2"/>
                <path d="M5 8H11" stroke="#ffb100" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </div>
            <div>
              <p class="text-sm font-medium text-rls-text font-satoshi">Funds held until they register</p>
              <p class="text-xs text-rls-text-secondary font-satoshi">Their share is safely held in their placeholder account</p>
            </div>
          </div>

          <div class="flex gap-3">
            <div class="w-8 h-8 rounded-full bg-rls-accent/20 flex items-center justify-center shrink-0">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 2L10 6H14L11 9L12 14L8 11L4 14L5 9L2 6H6L8 2Z" stroke="#9e77ff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div>
              <p class="text-sm font-medium text-rls-text font-satoshi">They can withdraw once registered</p>
              <p class="text-xs text-rls-text-secondary font-satoshi">As soon as they create a Ditto account, they can access their earnings</p>
            </div>
          </div>
        </div>

        <p class="text-xs font-satoshi mb-6" :class="isRLS ? 'text-rls-text-secondary' : 'text-ditto-grey'">
          {{ isRLS 
            ? 'We\'ll notify them by email to create their account.' 
            : 'You can resend confirmation emails from this page anytime.' 
          }}
        </p>

        <button
          @click="$emit('close')"
          class="w-full px-6 py-3 text-white rounded-full text-sm font-semibold font-satoshi transition-colors"
          :class="isRLS ? 'bg-rls-accent hover:bg-rls-accent/90' : 'bg-brand-secondary hover:bg-brand-secondary/90'"
        >
          Got it
        </button>

        <!-- Copy to other tracks link -->
        <button
          v-if="otherTracksCount > 0"
          @click="$emit('copy-to-all')"
          class="w-full mt-3 text-sm font-medium font-satoshi hover:underline transition-colors"
          :class="isRLS ? 'text-rls-accent' : 'text-brand-secondary'"
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
  isRLS?: boolean
}>()

defineEmits<{
  close: []
  'copy-to-all': []
}>()
</script>
