<script setup lang="ts">
import { contact } from '~/data/site'
definePageMeta({ awning: 'yellow', field: 'apricot' })
usePageSeo({ title: 'Inquire', description: 'Tell Una Mattina about your event in Naples or Southwest Florida: the date, the place, the guests and what you have in mind. No packages, no price list.' })
// Events v2 (events-v2-system.md §8 Inquire): a short heavy hero so the form starts in the first screen at 1440, then
// the form beside its signature, the sticky brown summary board that fills in as people answer (InquiryForm). "What
// happens next" is the board's foot; "Why no price list?" stays under the form. No CloseCta: the form is the close.
const faq = [{ q: 'Why is there no price list?', a: "Every event is quoted on its real scope: the date, the place, the guests and the parts you want us to handle. There are no packages, so a price list would only be a guess." }]
</script>

<template>
  <div>
    <div class="inq-hero">
      <PageHero id="inq-title" layout="heavy" title="Tell us about your day" :lines="['Tell us about', 'your day']">
        <template #side>
          <p class="statement inq-hero__s">No packages and no price list: we read every inquiry and reply with questions.</p>
          <p v-if="contact.replyTime.confirmed" class="inq-hero__reply">We reply {{ contact.replyTime.value }}.</p>
        </template>
      </PageHero>
    </div>

    <section class="wrap inq-body" aria-label="Inquiry form">
      <InquiryForm>
        <Faq class="inq-faq" :items="faq" />
      </InquiryForm>
    </section>
  </div>
</template>

<style scoped>
/* short hero: the title and the statement share one row from 900 px, so the first questions are in the first screen */
.inq-hero.inq-hero :deep(.phx--heavy) { padding-bottom: clamp(36px, 4vw, 64px); }
.inq-hero.inq-hero :deep(.phx--heavy .phx__body) { padding-top: clamp(20px, 3vw, 48px); }
/* the statement keeps a fixed box whichever face renders it (Playfair or its fallback while it loads), so the
   hero's height never changes when the font arrives (CLS 0): three lines on phones, four beside the title */
.inq-hero__s { color: var(--ink-deep); font-size: var(--step-1); line-height: 1.3; max-width: 22em; min-height: calc(3 * 1.3em); }
.inq-hero__reply { margin-top: 14px; color: var(--ink-deep); font-weight: 500; }
@media (min-width: 900px) {
  .inq-hero.inq-hero :deep(.phx--heavy.phx--side .phx__body) {
    grid-template-columns: minmax(0, 7fr) minmax(0, 5fr);
    grid-template-areas: "title side";
  }
  .inq-hero__s { min-height: 0; height: calc(4 * 1.3em); display: flex; align-items: flex-end; }
  .inq-hero.inq-hero :deep(.phx__side) { align-self: end; margin-top: 0; }
}
@media (min-width: 1200px) { .inq-hero.inq-hero :deep(.phx--heavy.phx--side .phx__body) { grid-template-columns: minmax(0, 8fr) minmax(0, 4fr); } }
.inq-body { padding-block: clamp(48px, 5vw, 80px) var(--space-section); }
.inq-faq { margin-top: var(--space-block); max-width: 640px; }
</style>

<style>
/* On /inquire the footer's "Start an inquiry" pill would link to the page itself: hidden here only (SiteFooter is shared). */
</style>
