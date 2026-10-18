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
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
