// While site.config `crepesOnly` is on, /crepes is the only public page: any other URL (known page, unknown
// path, client-side link) redirects to it. 302, so nothing caches the redirect for when the events site opens.
import site from '~~/site.config'

export default defineNuxtRouteMiddleware((to) => {
  // comingSoon: one holding page at / (app.vue renders it), every other URL redirects there
  if (site.comingSoon) return to.path === '/' ? undefined : navigateTo('/', { redirectCode: 302, replace: true })
  if (!site.crepesOnly) return
  if (to.path === '/crepes' || to.path.startsWith('/crepes/')) return
  return navigateTo({ path: '/crepes', hash: to.hash }, { redirectCode: 302, replace: true })
})
