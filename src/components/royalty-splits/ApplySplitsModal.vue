<template>
  <!-- Apply Splits (BA-136): after saving splits on a track that shares its ISRC with
       tracks on other releases, subscription users choose where to apply them.
       Ditto + RLS users never see this — splits are applied automatically. -->
  <Teleport to="body">
    <div class="asm-overlay" @click="$emit('close')">
      <div class="asm" @click.stop>
        <div class="asm__head">
          <h2 class="asm__title">Apply Splits</h2>
          <p class="asm__desc">You have used this track (ISRC) in other releases. Do you want to apply the same splits on them?</p>

          <div class="asm__preview">
            <p class="asm__desc">Copying from <strong class="asm__strong">{{ sourceTrackName }}</strong></p>
            <div class="asm__tags">
              <span class="asm__tag asm__tag--you"><span class="asm__tag-b">You</span> {{ sourceUserShare }}%</span>
              <span v-for="split in sourceSplits" :key="split.id" class="asm__tag asm__tag--collab">
                <span class="asm__tag-b">{{ split.name }}</span> {{ split.share }}%
              </span>
            </div>
          </div>

          <div class="asm__sel-header">
            <p class="asm__sel-label">Releases with this track:</p>
            <button @click="toggleSelectAll" class="asm__sel-toggle">{{ allSelected ? 'Deselect all' : 'Select all' }}</button>
          </div>
        </div>

        <div class="asm__body">
          <div class="asm__chips">
            <button
              v-for="(match, i) in matches"
              :key="match.trackId"
              @click="toggle(match.trackId)"
              class="asm__chip asm__chip--sm" :class="{ 'asm__chip--sel': selected.has(match.trackId) }"
            >
              <span class="asm__check" :class="{ 'asm__check--on': selected.has(match.trackId) }">
                <svg v-if="selected.has(match.trackId)" width="10" height="10" viewBox="0 0 24 24" fill="none">
                  <path d="M20 6L9 17L4 12" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </span>
              <span class="asm__chip-num">{{ i + 1 }}.</span>
              <span class="asm__chip-name asm__chip-name--target">{{ match.releaseTitle }}</span>
              <span v-if="match.existingSplits > 0" class="asm__conflict">
                <svg width="10" height="10" viewBox="0 0 16 16" fill="none" class="asm__conflict-icon">
                  <path d="M8 5V8.5M8 11V11.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
                {{ match.existingSplits }}
                <span class="asm__conflict-tip">Will replace {{ match.existingSplits }} existing split{{ match.existingSplits > 1 ? 's' : '' }}</span>
              </span>
            </button>
          </div>
        </div>

        <div v-if="conflictCount > 0" class="asm__warn-wrap">
          <div class="asm__warn">
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" class="asm__warn-icon">
              <path d="M10 6V10M10 14H10.01M18 10C18 14.4183 14.4183 18 10 18C5.58172 18 2 14.4183 2 10C2 5.58172 5.58172 2 10 2C14.4183 2 18 5.58172 18 10Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <p class="asm__warn-text"><strong>{{ conflictCount }} track{{ conflictCount > 1 ? 's have' : ' has' }} existing splits.</strong> Confirming will replace them with the new splits.</p>
          </div>
        </div>

        <div class="asm__foot">
          <div class="asm__foot-row">
            <button @click="$emit('close')" class="asm__btn-cancel">Cancel</button>
            <button @click="$emit('confirm', [...selected])" :disabled="selected.size === 0" class="asm__btn-confirm">
              Apply to {{ selected.size }} track{{ selected.size !== 1 ? 's' : '' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Collaborator, IsrcMatch } from '../../types'

const props = defineProps<{
  sourceTrackName: string
  sourceUserShare: number
  sourceSplits: Collaborator[]
  matches: IsrcMatch[]
}>()

defineEmits<{
  close: []
  confirm: [trackIds: string[]]
}>()

// Everything is selected by default (spec: "All are selected by default")
const selected = ref(new Set(props.matches.map(m => m.trackId)))
const allSelected = computed(() => selected.value.size === props.matches.length)
const toggle = (id: string) => {
  const next = new Set(selected.value)
  next.has(id) ? next.delete(id) : next.add(id)
  selected.value = next
}
const toggleSelectAll = () => {
  selected.value = allSelected.value ? new Set() : new Set(props.matches.map(m => m.trackId))
}
const conflictCount = computed(() => props.matches.filter(m => selected.value.has(m.trackId) && m.existingSplits > 0).length)
</script>

<style lang="scss" scoped>
@mixin modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

@mixin modal-card($w: 520px) {
  background: #fff;
  border-radius: $radius-card;
  width: 100%;
  max-width: 95vw;
  max-height: 90vh;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  margin: 0 0.5rem;
  display: flex;
  flex-direction: column;

  @include sm {
    width: $w;
    margin: 0;
  }
}

@mixin btn-cancel {
  padding: 0.625rem 1.5rem;
  border: 1px solid var(--faded-grey);
  border-radius: $radius-button;
  font-size: $text-sm;
  font-weight: 600;
  color: var(--ditto-grey);
  font-family: $font-satoshi;
  transition: border-color 0.15s, color 0.15s;

  &:hover {
    border-color: var(--blue);
    color: var(--blue);
  }
}

@mixin btn-primary {
  padding: 0.625rem 1.5rem;
  background: var(--blue);
  color: #fff;
  border-radius: $radius-button;
  font-size: $text-sm;
  font-weight: 600;
  font-family: $font-satoshi;
  transition: background 0.15s;

  &:hover { background: rgba($color-text-fill, 0.9); }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
}

.asm-overlay { @include modal-overlay; }

.asm {
  @include modal-card;

  &__head {
    padding: 1rem;
    padding-bottom: 0;
    flex-shrink: 0;

    @include sm { padding: 1.5rem; padding-bottom: 0; }
  }

  &__title {
    font-size: $text-h4;
    font-weight: 900;
    color: var(--blue);
    font-family: $font-satoshi;
    letter-spacing: -0.03em;
    margin-bottom: 1rem;

    @include sm { font-size: $text-h3; }
  }

  &__desc {
    font-size: $text-sm;
    color: var(--ditto-grey);
    font-family: $font-satoshi;
    margin-bottom: 0.75rem;
  }

  &__strong { color: var(--blue); }

  &__chips {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 1rem;

    &--scroll { max-height: 8rem; overflow-y: auto; }
  }

  &__chip {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.5rem 0.75rem;
    border-radius: $radius-lg;
    font-size: $text-sm;
    font-weight: 500;
    font-family: $font-satoshi;
    cursor: pointer;
    transition: all 0.15s;
    border: 1px solid var(--faded-grey);
    background: var(--light-grey);
    color: var(--blue);

    &:hover { border-color: rgba($color-brand-secondary, 0.5); }

    &--sel {
      border-color: var(--brand-secondary);
      background: rgba($color-brand-secondary, 0.1);
      color: var(--brand-secondary);
    }

    &--sm { padding: 0.375rem 0.75rem; }
  }

  &__chip-num { font-size: $text-xs; opacity: 0.6; }
  &__chip-name {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 160px;

    &--target {
      max-width: 140px;
      @include sm { max-width: 180px; }
    }
  }
  &__chip-meta { font-size: 10px; opacity: 0.6; }

  &__check {
    flex-shrink: 0;
    width: 1rem;
    height: 1rem;
    border-radius: 50%;
    border: 2px solid rgba($color-ditto-purple, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.15s;
    background: transparent;

    &--on {
      border-color: var(--brand-secondary);
      background: var(--brand-secondary);
    }
  }

  &__preview { margin-bottom: 1rem; }

  &__tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.375rem;
  }

  &__tag {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.25rem 0.5rem;
    border-radius: 0.375rem;
    font-size: $text-xs;
    font-family: $font-satoshi;

    &--you {
      background: rgba($color-brand-secondary, 0.1);
      color: var(--split-yours);
    }

    &--collab {
      background: rgba($color-success, 0.1);
      color: var(--split-confirmed);
    }
  }

  &__tag-b { font-weight: 500; }

  &__sel-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.75rem;
  }

  &__sel-label {
    font-size: $text-sm;
    font-weight: 600;
    color: var(--blue);
    font-family: $font-satoshi;
  }

  &__sel-toggle {
    font-size: $text-xs;
    font-weight: 500;
    color: var(--brand-secondary);
    font-family: $font-satoshi;
    &:hover { text-decoration: underline; }
  }

  &__body {
    flex: 1;
    overflow-y: auto;
    padding: 0 1rem;
    min-height: 0;

    @include sm { padding: 0 1.5rem; }
  }

  &__conflict {
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: 0.125rem;
    font-size: 10px;
    font-weight: 700;
    color: var(--error);
    background: rgba($color-error, 0.15);
    padding: 0.125rem 0.375rem;
    border-radius: 0.25rem;
    flex-shrink: 0;
    cursor: help;

    &:hover > .asm__conflict-tip { opacity: 1; }
  }

  &__conflict-icon { flex-shrink: 0; }

  &__conflict-tip {
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    margin-bottom: 0.25rem;
    padding: 0.25rem 0.5rem;
    background: var(--blue);
    color: #fff;
    font-size: 10px;
    font-weight: 400;
    border-radius: 0.25rem;
    white-space: nowrap;
    opacity: 0;
    transition: opacity 0.15s;
    pointer-events: none;
    z-index: 20;
  }

  &__warn-wrap {
    padding: 0 1rem 1rem;
    @include sm { padding: 0 1.5rem 1rem; }
  }

  &__warn {
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
    padding: 0.75rem;
    background: $color-amber-50;
    border: 1px solid $color-amber-100;
    border-radius: $radius-card;
  }

  &__warn-icon {
    flex-shrink: 0;
    color: $color-amber-600;
    margin-top: 0.125rem;
  }

  &__warn-text {
    font-size: $text-xs;
    color: $color-amber-800;
    font-family: $font-satoshi;
  }

  &__foot {
    padding: 0.75rem 1rem 1rem;
    border-top: 1px solid var(--faded-grey);
    flex-shrink: 0;
    background: #fff;
    border-radius: 0 0 $radius-card $radius-card;

    @include sm { padding: 0.75rem 1.5rem 1.5rem; }
  }

  &__foot-row {
    display: flex;
    flex-direction: column-reverse;
    justify-content: flex-end;
    gap: 0.5rem;

    @include sm { flex-direction: row; gap: 0.75rem; }
  }

  &__btn-cancel { @include btn-cancel; }
  &__btn-confirm { @include btn-primary; }
}
</style>
