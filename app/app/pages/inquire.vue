<script setup lang="ts">
import { contact } from '~/data/site'
definePageMeta({ awning: 'yellow', field: 'apricot' })
usePageSeo({ title: 'Inquire', description: 'Tell Una Mattina about your event in Naples or Southwest Florida: the date, the place, the guests and what you have in mind. No packages, no price list.' })
const next = [
  'We read it and reply with questions.',
  'We talk it through, by call or over coffee.',
  "You get a written proposal built on your event's real scope.",
]
const faq = [{ q: 'Why is there no price list?', a: "Every event is quoted on its real scope: the date, the place, the guests and the parts you want us to handle. There are no packages, so a price list would only be a guess." }]
</script>

<template>
  <div>
    <!-- I1: compact split hero, so the first fields show in the first screen -->
    <PageHero id="inq-title" class="inq-hero" title="Tell us about your day">
      <template #side>
        <p class="statement inq-hero__statement">No packages and no price list: we read every inquiry and reply with questions.</p>
        <p v-if="contact.replyTime.confirmed" class="inq-hero__reply">We reply {{ contact.replyTime.value }}.</p>
      </template>
    </PageHero>

    <!-- I2: form + sticky read-back -->
    <section class="wrap body" aria-label="Inquiry form">
      <InquiryForm />
    </section>

    <!-- I3: what happens next, yellow band -->
    <section class="next" aria-labelledby="next-title">
      <div class="wrap next__grid">
        <h2 id="next-title" v-lines class="sign-m">What happens next</h2>
        <div class="next__main">
          <ol v-reveal="80" class="next__list">
            <li v-for="(n, i) in next" :key="n" class="next__item">
              <p class="statement">{{ n }}</p>
              <p v-if="i === 0 && contact.replyTime.confirmed" class="next__when">Usually {{ contact.replyTime.value }}.</p>
            </li>
          </ol>
          <Faq class="next__faq" :items="faq" />
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.inq-hero.ph { padding-bottom: clamp(48px, 5vw, 72px); }
@media (min-width: 900px) and (max-width: 1279px) { .inq-hero.ph :deep(.ph__title) { font-size: 5.2vw; } }
@media (max-width: 599px) { .inq-hero.ph :deep(.ph__title) { font-size: clamp(2rem, 9.4vw, 2.4rem); } }
.inq-hero__statement { color: var(--ink-deep); }
.inq-hero__reply { margin-top: 14px; color: var(--ink-deep); font-weight: 500; }

.body { padding-block: clamp(40px, 5vw, 72px) var(--section); }

.next { background: var(--field); padding-block: var(--section); }
.next__grid { display: grid; gap: clamp(28px, 4vw, 48px); }
.next__list { list-style: none; margin: 0; padding: 0; display: grid; gap: clamp(20px, 2.4vw, 32px); }
.next__item { max-width: 34rem; }
.next__when { margin-top: 6px; font-weight: 500; }
.next__faq { margin-top: clamp(40px, 5vw, 64px); max-width: 640px; }
@media (min-width: 1100px) { .next__grid { grid-template-columns: minmax(0, 5fr) minmax(0, 7fr); gap: 48px; align-items: start; } }
</style>
