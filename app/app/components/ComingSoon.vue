<script setup lang="ts">
// Holding page while site.config `comingSoon` is on: app.vue renders only this, on every URL.

// Link previews (WhatsApp, iMessage, socials) show this page too, not the events site: own title, text and image.
const desc = 'Una Mattina Events & Catering · Crêpes. Coming soon.'
const ogImage = `${useRequestURL().origin}/og-soon.png`
useSeoMeta({
  title: 'Coming soon',
  description: desc,
  ogTitle: 'Una Mattina · Coming soon',
  ogDescription: desc,
  ogImage,
  ogImageWidth: 1200,
  ogImageHeight: 630,
  ogImageAlt: 'Una Mattina: Coming soon',
  twitterImage: ogImage,
  robots: 'noindex',
})
useHead({ meta: [{ name: 'theme-color', content: '#FFF7EA' }] })
</script>

<template>
  <main id="main" class="soon">
    <div class="soon__in">
      <Wordmark variant="stacked" class="soon__mark" />
      <h1 class="soon__t">Coming soon</h1>
      <p class="soon__d">Events &amp; Catering · Crêpes</p>
    </div>
  </main>
</template>

<style scoped>
.soon {
  min-height: 100dvh; display: grid; place-items: center;
  padding: max(32px, env(safe-area-inset-top)) var(--gutter) max(32px, env(safe-area-inset-bottom));
  background: var(--ground); color: var(--ink); text-align: center;
}
.soon__in { display: grid; justify-items: center; gap: clamp(20px, 3vw, 32px); }
.soon__mark { width: clamp(180px, 42vw, 320px); }
.soon__t { margin: 0; font: italic 400 var(--step-3)/1.05 var(--font-accent); letter-spacing: 0.01em; }
.soon__d { margin: 0; font: 500 var(--step--1)/1.4 var(--font-text); letter-spacing: 0.16em; text-transform: uppercase; color: var(--ink-muted); }
@media (prefers-reduced-motion: no-preference) {
  .soon__in > * { opacity: 0; transform: translateY(12px); animation: soon-rise 700ms var(--ease-out) forwards; }
  .soon__t { animation-delay: 120ms; }
  .soon__d { animation-delay: 220ms; }
}
@keyframes soon-rise { to { opacity: 1; transform: none; } }
</style>
