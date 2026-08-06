<template>
  <div class="app">
    <nav class="app__nav">
      <div class="app__nav-inner">
        <span class="app__logo">Ditto</span>
        <div class="app__links">
          <router-link 
            to="/services" 
            class="app__link" :class="{ 'app__link--active': $route.path === '/services' }"
          >Services</router-link>
          <router-link 
            to="/royalty-splits" 
            class="app__link" :class="{ 'app__link--active': $route.path === '/royalty-splits' }"
          >Splits</router-link>
          <router-link 
            to="/royalty-splits-rls" 
            class="app__link" :class="{ 'app__link--active-rls': $route.path === '/royalty-splits-rls' }"
          >Splits (RLS)</router-link>
          <router-link 
            to="/royalty-splits-app" 
            class="app__link" :class="{ 'app__link--active': $route.path === '/royalty-splits-app' }"
          >Splits (App)</router-link>
        </div>
      </div>
    </nav>
    <router-view />
  </div>
</template>

<script setup lang="ts">
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;
@use '@/styles/mixins' as *;

.app {
  min-height: 100vh;
  background: var(--lighter-grey);

  &__nav {
    background: #fff;
    border-bottom: 1px solid var(--faded-grey);
    padding: 0.75rem 1rem;
  }

  &__nav-inner {
    max-width: 56rem;
    margin: 0 auto;
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  &__logo {
    font-size: 1.125rem;
    font-weight: 900;
    color: var(--brand-primary);
    font-family: $font-satoshi;
    letter-spacing: -0.03em;
  }

  &__links {
    display: flex;
    gap: 0.5rem;
  }

  &__link {
    padding: 0.5rem 1rem;
    border-radius: 9999px;
    font-size: $text-sm;
    font-weight: 500;
    font-family: $font-satoshi;
    transition: color 0.15s, background 0.15s;
    color: var(--ditto-grey);
    text-decoration: none;

    &:hover { background: var(--light-grey); }

    &--active {
      background: var(--brand-primary);
      color: #fff;
      &:hover { background: var(--brand-primary); }
    }

    &--active-rls {
      background: $color-rls-accent;
      color: #fff;
      &:hover { background: $color-rls-accent; }
    }
  }
}
</style>
