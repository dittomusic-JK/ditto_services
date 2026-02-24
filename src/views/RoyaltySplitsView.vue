<template>
  <div class="rsv">
    <div class="rsv__tabs">
      <span class="rsv__label">Demo:</span>
      <button @click="demo = 'populated'" class="rsv__tab" :class="{ 'rsv__tab--active': demo === 'populated' }">Populated</button>
      <button @click="demo = 'empty'" class="rsv__tab" :class="{ 'rsv__tab--active': demo === 'empty' }">Empty</button>
      <button @click="demo = 'edge-case'" class="rsv__tab" :class="{ 'rsv__tab--active': demo === 'edge-case' }">Edge Case (50 tracks)</button>
    </div>
    <RoyaltySplitsPage :key="demo" :user-type="userType" :demo="demo" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { UserType } from '../types'
import { RoyaltySplitsPage } from '../components/royalty-splits'

const userType = ref<UserType>('subscription')
const demo = ref<'populated' | 'empty' | 'edge-case'>('populated')
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;
@use '@/styles/mixins' as *;

.rsv {
  background: #fff;
  min-height: 100vh;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;

  @include sm { padding: 1.5rem; }
  @include md { padding: 2rem; }

  &__tabs {
    margin-bottom: 1rem;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    font-size: $text-sm;
    font-family: $font-satoshi;
  }

  &__label { color: var(--ditto-grey); }

  &__tab {
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
    transition: color 0.15s, background 0.15s;
    background: var(--light-grey);
    color: var(--ditto-grey);
    cursor: pointer;

    &:hover { background: var(--faded-grey); }

    &--active {
      background: var(--brand-secondary);
      color: #fff;
      &:hover { background: var(--brand-secondary); }
    }
  }
}
</style>
