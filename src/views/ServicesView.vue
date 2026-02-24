<template>
  <div class="sv">
    <div class="sv__tabs">
      <button
        v-for="p in plans" :key="p.value"
        @click="selectedPlan = p.value"
        class="sv__tab" :class="{ 'sv__tab--active': selectedPlan === p.value }"
      >{{ p.label }}</button>
    </div>
    <ServicesPurchasedView v-if="selectedPlan === 'Purchased'" />
    <ServicesTab v-else :plan="selectedPlan" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Plan } from '../types'
import ServicesTab from '../components/ServicesTab.vue'
import ServicesPurchasedView from '../components/ServicesPurchasedView.vue'

type PlanOption = Plan | 'Purchased'

const plans: { value: PlanOption; label: string }[] = [
  { value: 'Starter', label: 'Starter' },
  { value: 'Pro', label: 'Pro' },
  { value: 'Label', label: 'Label' },
  { value: 'DittoPlusRLS', label: 'Label Services' },
  { value: 'Purchased', label: 'Purchased' },
]
const selectedPlan = ref<PlanOption>('Starter')
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;
@use '@/styles/mixins' as *;

.sv {
  background: #fff;
  min-height: 100vh;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;

  @include sm { padding: 1.5rem; }
  @include md { padding: 2rem; }

  &__tabs {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
  }

  &__tab {
    padding: 0.5rem 1rem;
    border-radius: 9999px;
    font-size: $text-sm;
    font-weight: 600;
    font-family: $font-satoshi;
    transition: color 0.15s, background 0.15s;
    background: var(--light-grey);
    color: var(--ditto-grey);
    cursor: pointer;

    &:hover { background: var(--faded-grey); }

    &--active {
      background: var(--brand-primary);
      color: #fff;
      &:hover { background: var(--brand-primary); }
    }
  }
}
</style>
