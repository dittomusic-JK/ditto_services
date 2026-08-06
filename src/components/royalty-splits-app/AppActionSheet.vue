<template>
  <div class="ash" @click.self="$emit('close')">
    <div class="ash__sheet">
      <button v-for="item in items" :key="item.id" class="ash__item" @click="$emit('select', item.id)">
        <span class="ash__icon" v-html="icons[item.icon]"></span>
        {{ item.label }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
export interface SheetItem {
  id: string
  label: string
  icon: 'edit' | 'trash' | 'send' | 'mail' | 'save' | 'x' | 'copy'
}

defineProps<{ items: SheetItem[] }>()

defineEmits<{
  close: []
  select: [id: string]
}>()

const icons: Record<string, string> = {
  edit: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>',
  trash: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/></svg>',
  send: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22,2 15,22 11,13 2,9"/></svg>',
  mail: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M4 7l7.05 5.16a2 2 0 0 0 2.36 0L20.5 7"/></svg>',
  save: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17,21 17,13 7,13 7,21"/><polyline points="7,3 7,8 15,8"/></svg>',
  x: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>',
  copy: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>',
}
</script>

<style lang="scss" scoped>
.ash {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: flex-end;
  z-index: 40;

  &__sheet {
    width: calc(100% - 2rem);
    margin: 0 1rem 1.25rem;
    background: #fff;
    border-radius: 1.25rem;
    overflow: hidden;
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.25);
  }

  &__item {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 1rem;
    font-size: $text-sm;
    font-weight: 500;
    color: var(--blue);
    font-family: $font-satoshi;
    border-bottom: 1px solid var(--light-grey);
    cursor: pointer;

    &:last-child { border-bottom: none; }
    &:active { background: var(--lighter-grey); }
  }

  &__icon {
    display: inline-flex;
    color: var(--blue);
  }
}
</style>
