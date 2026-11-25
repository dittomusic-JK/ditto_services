<template>
  <!-- Mock-up: the mobile app's release sheet (ReleaseViewButtons.vue).
       Today three full-width buttons push Royalty Splits below the fold.
       Three options that fit every action on one screen. -->
  <div class="rs">
    <h1 class="rs__title">Release sheet actions <span>(App)</span></h1>
    <p class="rs__intro">
      On the release sheet, Filter in analytics, Get Your Smartlink and Share Smartlink each take a full-width button, so
      Royalty Splits lands off screen. Three ways to fit it. Every phone below is the same height as the screenshot.
    </p>

    <div class="rs__row">
      <div v-for="opt in options" :key="opt.id" class="rs__col">
        <div class="rs__label">
          <span class="rs__tag" :class="{ 'rs__tag--now': opt.id === 'now' }">{{ opt.tag }}</span>
          <h2>{{ opt.name }}</h2>
          <p>{{ opt.note }}</p>
        </div>

        <div class="phone">
          <div class="phone__status"><span>16:43</span><span class="phone__status-right">5G ▮ 83</span></div>
          <div class="phone__appbar">
            <span class="phone__avatar"></span>
            <span class="phone__appbar-title">Music</span>
          </div>

          <div class="sheet">
            <span class="sheet__grab"></span>

            <!-- Hero -->
            <div class="hero" :class="{ 'hero--compact': opt.id !== 'now' }">
              <div class="hero__art">
                <span class="hero__status">Sent To Stores</span>
                <span class="hero__art-text">QA</span>
              </div>
              <p class="hero__name">Release with Very Long Title That Does Not Fit One Line I…</p>
              <p class="hero__meta">Single by: New &amp; Unicorn</p>
              <p class="hero__meta">Release Date: 13 November, 2026</p>
            </div>

            <!-- Metadata -->
            <div class="meta">
              <p class="meta__head">METADATA</p>
              <p><span>Genre:</span> Axé</p>
              <p><span>Language:</span> English</p>
              <p><span>Label:</span> new</p>
              <p><span>Copyright:</span> © 2026, test</p>
              <p><span>UPC/EAN:</span> 5059033747005</p>
            </div>

            <!-- ── Current: three stacked buttons, splits off screen ── -->
            <div v-if="opt.id === 'now'" class="actions">
              <button class="btn btn--primary"><span v-html="icons.filter"></span>Filter in analytics</button>
              <button class="btn btn--dark">Get Your Smartlink</button>
              <button class="btn btn--dark"><span v-html="icons.share"></span>Share Smartlink</button>
              <button class="btn btn--dark"><span v-html="icons.splits"></span>Royalty Splits</button>
            </div>

            <!-- ── A: smartlink row (link box with copy, small share) ── -->
            <div v-else-if="opt.id === 'a'" class="actions">
              <p class="actions__label">Smartlink</p>
              <div class="linkrow">
                <button class="linkbox" @click="copy(opt.id)">
                  <span class="linkbox__url">ditto.fm/release-with-very-long-title</span>
                  <span class="linkbox__copy" v-html="copied === opt.id ? icons.check : icons.copy"></span>
                </button>
                <button class="btn btn--dark btn--share"><span v-html="icons.share"></span>Share</button>
              </div>
              <p class="actions__hint">{{ copied === opt.id ? 'Link copied' : 'Tap the link to copy it' }}</p>
              <button class="btn btn--primary"><span v-html="icons.filter"></span>Filter in analytics</button>
              <button class="btn btn--dark"><span v-html="icons.splits"></span>Royalty Splits</button>
            </div>

            <!-- ── B: 2 x 2 action tiles ── -->
            <div v-else-if="opt.id === 'b'" class="actions">
              <div class="tiles">
                <button class="tile tile--primary"><span v-html="icons.filter"></span><b>Analytics</b><small>Filter by this release</small></button>
                <button class="tile"><span v-html="icons.splits"></span><b>Royalty Splits</b><small>0 of 1 tracks split</small></button>
                <button class="tile" @click="copy(opt.id)"><span v-html="copied === opt.id ? icons.check : icons.copy"></span><b>{{ copied === opt.id ? 'Copied' : 'Copy Smartlink' }}</b><small>ditto.fm/release-wi…</small></button>
                <button class="tile"><span v-html="icons.share"></span><b>Share Smartlink</b><small>Send to fans</small></button>
              </div>
            </div>

            <!-- ── C: action list ── -->
            <div v-else class="actions">
              <div class="list">
                <button class="list__row">
                  <span class="list__icon list__icon--primary" v-html="icons.filter"></span>
                  <span class="list__text"><b>Filter in analytics</b><small>See this release's streams</small></span>
                  <span class="list__chev" v-html="icons.chev"></span>
                </button>
                <button class="list__row">
                  <span class="list__icon" v-html="icons.splits"></span>
                  <span class="list__text"><b>Royalty Splits</b><small>0 of 1 tracks split</small></span>
                  <span class="list__chev" v-html="icons.chev"></span>
                </button>
                <div class="list__row list__row--static">
                  <span class="list__icon" v-html="icons.link"></span>
                  <span class="list__text"><b>Smartlink</b><small>ditto.fm/release-with-very-lo…</small></span>
                  <button class="list__mini" @click="copy(opt.id)" :aria-label="'Copy smartlink'" v-html="copied === opt.id ? icons.check : icons.copy"></button>
                  <button class="list__mini" aria-label="Share smartlink" v-html="icons.share"></button>
                </div>
              </div>
            </div>
          </div>

          <span class="phone__home"></span>
          <!-- Fold marker on the current layout -->
          <span v-if="opt.id === 'now'" class="phone__fold">Royalty Splits is below here</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const options = [
  { id: 'now', tag: 'Current', name: 'Three stacked buttons', note: 'Royalty Splits is the fourth button and sits off screen.' },
  { id: 'a', tag: 'Option A', name: 'Smartlink row', note: 'Link in a box with tap to copy, small Share beside it. Two actions become one row.' },
  { id: 'b', tag: 'Option B', name: 'Action tiles', note: 'Four equal tiles. Room for a status line on each, and a 2 x 3 grid later.' },
  { id: 'c', tag: 'Option C', name: 'Action list', note: 'Settings-style rows. Scales to any number of actions, shows split status inline.' },
]

const copied = ref('')
let timer: ReturnType<typeof setTimeout> | undefined
const copy = (id: string) => {
  copied.value = id
  if (timer) clearTimeout(timer)
  timer = setTimeout(() => { copied.value = '' }, 1800)
}

const svg = (d: string) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`
const icons = {
  filter: svg('<line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><circle cx="4" cy="12" r="2"/><circle cx="12" cy="10" r="2"/><circle cx="20" cy="14" r="2"/>'),
  share: svg('<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>'),
  splits: svg('<path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/>'),
  copy: svg('<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>'),
  check: svg('<polyline points="20 6 9 17 4 12"/>'),
  link: svg('<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>'),
  chev: svg('<polyline points="9 18 15 12 9 6"/>'),
}
</script>

<style scoped lang="scss">
$ink: #101f3c;
$primary: #5f1fff;
$grey: #626984;
$border: #d2d2e3;
$tint: #f9f9ff;

.rs {
  max-width: 1500px;
  margin: 0 auto;
  padding: 32px 24px 64px;
  font-family: 'Satoshi', Helvetica, Arial, sans-serif;
  color: $ink;

  &__title { font-size: 28px; font-weight: 900; letter-spacing: -0.03em; span { color: $grey; font-weight: 500; } }
  &__intro { max-width: 760px; margin: 8px 0 28px; font-size: 14px; line-height: 1.5; color: $grey; }
  &__row { display: flex; gap: 28px; overflow-x: auto; padding-bottom: 12px; align-items: flex-start; }
  &__col { flex: 0 0 322px; }
  &__label {
    min-height: 104px; margin-bottom: 12px;
    h2 { font-size: 16px; font-weight: 900; letter-spacing: -0.02em; margin: 6px 0 2px; }
    p { font-size: 12px; line-height: 1.45; color: $grey; }
  }
  &__tag {
    display: inline-block; padding: 3px 10px; border-radius: 999px;
    font-size: 11px; font-weight: 700; background: #efe9ff; color: $primary;
    &--now { background: #efeffc; color: $grey; }
  }
}

/* Phone: 322 x 698 keeps the screenshot's 923:2000 ratio */
.phone {
  position: relative; width: 322px; height: 698px;
  border-radius: 34px; border: 6px solid #111; background: #b4b4b8;
  overflow: hidden; box-shadow: 0 18px 40px rgba(16, 31, 60, 0.18);

  &__status { display: flex; justify-content: space-between; padding: 8px 20px 4px; font-size: 11px; font-weight: 600; background: #fff; }
  &__status-right { color: $grey; }
  &__appbar { position: relative; height: 40px; display: flex; align-items: center; justify-content: center; }
  &__avatar { position: absolute; left: 16px; width: 28px; height: 28px; border-radius: 50%; background: linear-gradient(135deg, #7a6a58, #2c2a28); }
  &__appbar-title { font-size: 17px; font-weight: 700; }
  &__home { position: absolute; bottom: 6px; left: 50%; width: 110px; height: 4px; margin-left: -55px; border-radius: 4px; background: #9a9aa2; z-index: 3; }
  &__fold {
    position: absolute; left: 0; right: 0; bottom: 14px; z-index: 2; text-align: center;
    font-size: 10px; font-weight: 700; color: #92400e; background: #fdf1cc; border-top: 1px dashed #f5c451; padding: 4px 0;
  }
}

.sheet {
  position: absolute; top: 66px; left: 0; right: 0; bottom: 0;
  background: #fff; border-radius: 18px 18px 0 0; overflow: hidden;
  &__grab { position: absolute; top: 9px; left: 50%; width: 30px; height: 4px; margin-left: -15px; border-radius: 4px; background: rgba(255, 255, 255, 0.75); z-index: 2; }
}

.hero {
  padding: 40px 18px 18px; text-align: center; color: #fff;
  background: linear-gradient(180deg, #9db9b2 0%, #7f9f99 55%, #54726d 100%);
  &__art {
    position: relative; width: 144px; height: 144px; margin: 0 auto 14px;
    background: #a5ccc4; display: flex; align-items: center; justify-content: center;
  }
  &__art-text { font-size: 54px; font-weight: 900; color: #c2536b; letter-spacing: -0.04em; -webkit-text-stroke: 2px #1c1c1c; }
  &__status { position: absolute; top: 5px; right: 5px; padding: 3px 7px; border-radius: 3px; background: #7dff8a; color: #111; font-size: 9px; font-weight: 600; }
  &__name { font-size: 18px; font-weight: 500; line-height: 1.3; margin-bottom: 8px; }
  &__meta { font-size: 11.5px; line-height: 1.45; }

  /* Options trim the hero slightly: same content, tighter padding */
  &--compact { padding-top: 30px; padding-bottom: 14px; }
  &--compact &__art { width: 112px; height: 112px; margin-bottom: 10px; }
  &--compact &__art-text { font-size: 42px; }
  &--compact &__name { font-size: 16px; margin-bottom: 5px; }
}

.meta {
  padding: 14px 18px 4px; text-align: center; font-size: 12.5px; line-height: 1.6;
  &__head { font-size: 11px; font-weight: 700; letter-spacing: 0.02em; margin-bottom: 4px; }
  span { color: $grey; }
}

.actions {
  padding: 8px 13px 0;
  &__label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: $grey; margin: 2px 2px 5px; }
  &__hint { font-size: 10px; color: $grey; margin: 4px 2px 8px; }
}

.btn {
  width: 100%; height: 50px; margin-top: 9px; border: 0; border-radius: 999px;
  display: flex; align-items: center; justify-content: center; gap: 8px;
  font-family: inherit; font-size: 14.5px; font-weight: 600; color: #fff; cursor: pointer;
  :deep(svg) { width: 16px; height: 16px; }
  &--primary { background: $primary; }
  &--dark { background: $ink; }
  &--share { flex: 0 0 34%; width: auto; height: 44px; margin-top: 0; font-size: 13px; }
}

/* A: smartlink row */
.linkrow { display: flex; gap: 8px; }
.linkbox {
  flex: 1; min-width: 0; height: 44px; padding: 0 6px 0 14px;
  display: flex; align-items: center; gap: 6px;
  border: 1px solid $border; border-radius: 999px; background: $tint;
  font-family: inherit; cursor: pointer; text-align: left;
  &__url { flex: 1; min-width: 0; font-size: 12px; font-weight: 500; color: $ink; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  &__copy { flex: 0 0 32px; height: 32px; border-radius: 50%; background: #fff; border: 1px solid $border; color: $primary; display: flex; align-items: center; justify-content: center; :deep(svg) { width: 14px; height: 14px; } }
}

/* B: tiles */
.tiles { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 6px; }
.tile {
  padding: 12px 12px 11px; border-radius: 16px; border: 1px solid $border; background: #fff;
  display: flex; flex-direction: column; align-items: flex-start; gap: 2px;
  font-family: inherit; text-align: left; color: $ink; cursor: pointer;
  :deep(svg) { width: 18px; height: 18px; margin-bottom: 6px; color: $primary; }
  b { font-size: 13px; font-weight: 700; }
  small { font-size: 10.5px; color: $grey; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100%; }
  &--primary { background: $primary; border-color: $primary; color: #fff; :deep(svg) { color: #fff; } small { color: rgba(255, 255, 255, 0.8); } }
}

/* C: list */
.list { margin-top: 6px; border: 1px solid $border; border-radius: 16px; overflow: hidden; }
.list__row {
  width: 100%; display: flex; align-items: center; gap: 10px; padding: 11px 12px;
  background: #fff; border: 0; border-top: 1px solid #ececf5; font-family: inherit; text-align: left; color: $ink; cursor: pointer;
  &:first-child { border-top: 0; }
  &--static { cursor: default; }
}
.list__icon {
  flex: 0 0 34px; height: 34px; border-radius: 10px; background: #efeffc; color: $ink; display: flex; align-items: center; justify-content: center;
  :deep(svg) { width: 16px; height: 16px; }
  &--primary { background: $primary; color: #fff; }
}
.list__text { flex: 1; min-width: 0; display: flex; flex-direction: column; b { font-size: 13.5px; font-weight: 700; } small { font-size: 10.5px; color: $grey; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; } }
.list__chev { color: #9595a7; :deep(svg) { width: 16px; height: 16px; display: block; } }
.list__mini {
  flex: 0 0 34px; height: 34px; border-radius: 50%; border: 1px solid $border; background: #fff; color: $primary; cursor: pointer;
  display: flex; align-items: center; justify-content: center; :deep(svg) { width: 15px; height: 15px; }
}
</style>
