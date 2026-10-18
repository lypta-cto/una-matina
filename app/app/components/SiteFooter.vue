<script setup lang="ts">
import { contact, eventsNav } from '~/data/site'
import { credits, heroVideo } from '~/data/credits'
// one credit per source picture (two crops of the same photograph share one line)
const found = Object.values(credits).filter((c, i, all) => all.findIndex(x => x.page === c.page) === i)
const year = new Date().getFullYear()
</script>

<template>
  <!-- Events v2 (the /crepes footer): brown field, sign-off + one action left, columns right, then the horizontal
       wordmark across the full width rising letter by letter with its sun coming up last (WordmarkRise). -->
  <footer class="foot">
    <div class="wrap">
      <div class="foot__top">
        <div class="foot__lead">
          <p class="signoff foot__sign">Good Food, Brighter Days</p>
          <NuxtLink to="/inquire" class="pill pill--sun foot__cta">Start an inquiry <span class="pill__arrow" aria-hidden="true">→</span></NuxtLink>
        </div>
        <div class="foot__grid">
          <div>
            <p class="foot__h">Events &amp; Catering</p>
            <ul class="foot__list foot__nav">
              <li v-for="l in eventsNav" :key="l.to"><NuxtLink :to="l.to" class="link link-draw">{{ l.label }}</NuxtLink></li>
              <li><NuxtLink to="/about" class="link link-draw">About</NuxtLink></li>
              <li><NuxtLink to="/inquire" class="link link-draw">Inquire</NuxtLink></li>
            </ul>
          </div>
          <div>
            <p class="foot__h">Get in touch</p>
            <ul class="foot__list">
              <li><NuxtLink to="/inquire" class="link link-draw foot__more">Send us an inquiry</NuxtLink></li>
              <li v-if="contact.email.confirmed"><a :href="`mailto:${contact.email.value}`" class="link">{{ contact.email.value }}</a></li>
              <li v-if="contact.phone.confirmed && contact.phone.value"><a :href="`tel:${contact.phone.value.replace(/[^\d+]/g, '')}`" class="link">{{ contact.phone.value }}</a></li>
              <li v-if="contact.instagram.confirmed && contact.instagram.url"><a :href="contact.instagram.url" class="link" rel="noopener" target="_blank">Instagram {{ contact.instagram.handle }}<span class="sr-only"> (opens in a new tab)</span></a></li>
              <li>{{ contact.area }}</li>
            </ul>
          </div>
          <div>
            <p class="foot__h">At the market</p>
            <p class="foot__p">Find our crêpe stand at the Naples farmers markets.</p>
            <NuxtLink to="/crepes" class="link link-draw foot__more">Menu and market days</NuxtLink>
          </div>
        </div>
      </div>
      <div class="foot__mark"><WordmarkRise /></div>
      <div class="foot__fine">
        <!-- full attribution (title, creator, licence, changes) one click away; every photo also carries its own
             "Photo: creator, licence" line where it is shown -->
        <details class="foot__credits">
          <summary class="foot__sum">Photo and video credits</summary>
          <p class="foot__list-credits"><template v-for="(c, i) in found" :key="c.src"><a :href="c.page" class="foot__a" rel="noopener" target="_blank">{{ c.title }}<span class="sr-only"> (opens in a new tab)</span></a> by {{ c.creator }}, {{ c.license }}{{ i < found.length - 1 ? '; ' : '' }}</template>; <a :href="heroVideo.credit.page" class="foot__a" rel="noopener" target="_blank">{{ heroVideo.credit.title }}<span class="sr-only"> (opens in a new tab)</span></a> by {{ heroVideo.credit.creator }}, {{ heroVideo.credit.license }}. Via Wikimedia Commons; cropped and colour-graded, the video trimmed and looped.</p>
        </details>
        <p>© {{ year }} Una Mattina · Naples, Florida</p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.foot { background: var(--field-dark); color: var(--on-field-dark); padding-top: clamp(64px, 8vw, 120px); padding-bottom: calc(28px + env(safe-area-inset-bottom)); --logo-sun: var(--accent); --focus-ring: var(--on-field-dark); }
.foot :focus-visible { outline-color: var(--on-field-dark); }
.foot__top { display: grid; gap: 44px; }
.foot__lead { display: grid; gap: 22px; justify-items: start; align-content: start; }
.foot__sign { line-height: 1.05; }
.foot__grid { display: grid; gap: 32px; }
.foot__h { font-weight: 700; margin-bottom: 10px; }
.foot__list { list-style: none; margin: 0; padding: 0; display: grid; gap: 6px; }
/* nav links: 44 px tap targets without changing the list rhythm */
.foot__nav { gap: 0; }
.foot__nav .link { display: inline-block; padding-block: 9px; }
.foot__more { display: inline-block; padding-block: 9px; }
.foot__p { margin-bottom: 8px; max-width: 30ch; }
.foot__mark { margin-top: clamp(56px, 7vw, 104px); color: var(--on-field-dark); overflow: hidden; }
.foot__fine { margin-top: 24px; display: grid; gap: 10px; max-width: 72ch; font-size: 0.875rem; }
.foot__credits { font-size: 0.875rem; line-height: 1.5; }
.foot__sum { display: inline-flex; align-items: center; min-height: 44px; cursor: pointer; font-weight: 600; list-style: none; text-decoration: underline; text-decoration-thickness: 1px; text-underline-offset: 4px; text-decoration-color: color-mix(in srgb, currentColor 45%, transparent); }
.foot__sum::-webkit-details-marker { display: none; }
.foot__sum::after { content: "+"; margin-left: 8px; font-weight: 400; }
.foot__credits[open] .foot__sum::after { content: "−"; }
.foot__list-credits { max-width: 60ch; padding-bottom: 8px; font-size: 1rem; line-height: 1.55; }
.foot__a { color: inherit; text-decoration: underline 1px; text-underline-offset: 3px; text-decoration-color: color-mix(in srgb, currentColor 45%, transparent); transition: text-decoration-color var(--dur-fast) var(--ease-out); }
.foot__a:focus-visible { text-decoration-color: currentColor; }
@media (hover: hover) and (pointer: fine) { .foot__a:hover { text-decoration-color: var(--accent); } }
@media (min-width: 768px) { .foot__grid { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
@media (min-width: 1100px) { .foot__top { grid-template-columns: minmax(0, 4fr) minmax(0, 8fr); align-items: start; } }
</style>
