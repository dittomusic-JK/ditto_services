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
  min-height: 100vh;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;

  @include sm { padding: 1.5rem; }
  @include md { padding: 2rem; }

  .rsv__label { color: var(--rls-text-secondary); }

  .rsv__tabs {
    margin-bottom: 1rem;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    font-size: $text-sm;
    font-family: $font-satoshi;
  }

  .rsv__tab {
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
    transition: color 0.15s, background 0.15s;
    background: var(--rls-card);
    color: var(--rls-text-secondary);
    cursor: pointer;

    &:hover { background: var(--rls-border-light); }

    &--active {
      background: var(--rls-accent);
      color: #fff;
      &:hover { background: var(--rls-accent); }
    }
  }
}
</style>
