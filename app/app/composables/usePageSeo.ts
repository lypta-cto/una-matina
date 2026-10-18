import site from '~~/site.config'

/** Per-page SEO: title, description, canonical, OG/Twitter. Call once in every page. */
export function usePageSeo(opts: { title?: string, description?: string, image?: string, noindex?: boolean }) {
  const route = useRoute()
  const url = new URL(route.path, site.url.startsWith('http') ? site.url : 'https://example.invalid').href
  const description = opts.description ?? site.description
  useSeoMeta({
    title: opts.title,
    description,
    ogTitle: opts.title ?? site.name,
    ogDescription: description,
    ogUrl: url,
    ogImage: opts.image ?? site.ogImage,
    twitterTitle: opts.title ?? site.name,
    twitterDescription: description,
    robots: opts.noindex ? 'noindex, nofollow' : undefined,
  })
  useHead({ link: [{ rel: 'canonical', href: url }] })
}
