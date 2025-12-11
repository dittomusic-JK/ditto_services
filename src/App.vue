<template>
  <div>
    <!-- Plan selector tabs -->
    <div class="fixed top-0 left-0 right-0 bg-white border-b border-medium-grey z-50 flex justify-center gap-1 sm:gap-2 p-2 sm:p-3 overflow-x-auto">
      <button
        v-for="p in tabs"
        :key="p"
        @click="currentTab = p"
        class="px-2 sm:px-4 py-1.5 sm:py-2 rounded-button text-xs sm:text-sm font-medium font-satoshi transition-colors whitespace-nowrap shrink-0"
        :class="currentTab === p ? 'bg-ditto-purple text-white' : 'bg-light-grey text-ditto-blue hover:bg-medium-grey'"
      >
        {{ p === 'DittoPlusRLS' ? '++ Label Services' : p }}
      </button>
    </div>

    <!-- Content with top padding for fixed header -->
    <div class="pt-16">
      <div class="bg-white min-h-screen p-4 sm:p-6 md:p-8 flex justify-center">
        <ServicesPurchasedView v-if="currentTab === 'Purchased'" />
        <ServicesTab v-else :plan="currentTab as Plan" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Plan } from './types'
import ServicesTab from './components/ServicesTab.vue'
import ServicesPurchasedView from './components/ServicesPurchasedView.vue'

type Tab = Plan | 'Purchased'
const tabs: Tab[] = ['Starter', 'Pro', 'Label', 'DittoPlusRLS', 'Purchased']
const currentTab = ref<Tab>('Starter')
</script>
