<template>
  <div data-ditto-theme="rls" class="rsv rsv--rls">
    <div class="rsv__tabs">
      <span class="rsv__label">Demo:</span>
      <button @click="demo = 'populated'" class="rsv__tab" :class="{ 'rsv__tab--active': demo === 'populated' }">Populated</button>
      <button @click="demo = 'empty'" class="rsv__tab" :class="{ 'rsv__tab--active': demo === 'empty' }">Empty</button>
      <button @click="demo = 'edge-case'" class="rsv__tab" :class="{ 'rsv__tab--active': demo === 'edge-case' }">Edge Case (50 tracks)</button>
    </div>
    <RoyaltySplitsPage :key="demo" user-type="rls" :demo="demo" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { RoyaltySplitsPage } from '../components/royalty-splits'

const demo = ref<'populated' | 'empty' | 'edge-case'>('populated')
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;
@use '@/styles/mixins' as *;

.rsv--rls {
  background: var(--rls-bg);

  .rsv__label { color: var(--rls-text-secondary); }

  .rsv__tab {
    background: var(--rls-card);
    color: var(--rls-text-secondary);

    &:hover { background: var(--rls-border-light); }

    &--active {
      background: var(--rls-accent);
      color: #fff;
      &:hover { background: var(--rls-accent); }
    }
  }
}
</style>
