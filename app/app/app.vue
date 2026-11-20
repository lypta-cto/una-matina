<script setup lang="ts">
import site from '~~/site.config'

useSeoMeta({
  titleTemplate: (t?: string) => (t ? `${t} · ${site.name}` : site.name),
  description: site.description,
  ogSiteName: site.name,
  ogType: 'website',
  ogImage: site.ogImage,
  twitterCard: 'summary_large_image',
})
</script>

<template>
  <ComingSoon v-if="site.comingSoon" />
  <NuxtLayout v-else>
    <NuxtPage />
  </NuxtLayout>
</template>
