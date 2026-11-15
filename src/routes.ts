import { apps, type AppInfo } from './data/site'
import { langs, type Lang } from './i18n'

export type Route =
  | { kind: 'home'; lang: Lang; path: string }
  | { kind: 'app'; lang: Lang; path: string; app: AppInfo }
  | { kind: 'privacy'; lang: Lang; path: string; app: AppInfo }

const prefix = (lang: Lang) => (lang === 'pt' ? '' : `/${lang}`)
const privacySegment: Record<Lang, string> = { pt: 'privacidade', en: 'privacy' }

export const homePath = (lang: Lang) => `${prefix(lang)}/`
export const appPath = (lang: Lang, app: AppInfo) => `${prefix(lang)}/apps/${app.slug}/`
export const privacyPath = (lang: Lang, app: AppInfo) => `${prefix(lang)}/apps/${app.slug}/${privacySegment[lang]}/`

/** Every prerendered page. scripts/prerender.mjs writes one HTML file per entry and builds the sitemap from it. */
export const routes: Route[] = langs.flatMap(lang => [
  { kind: 'home' as const, lang, path: homePath(lang) },
  ...apps.flatMap(app => [
    { kind: 'app' as const, lang, path: appPath(lang, app), app },
    { kind: 'privacy' as const, lang, path: privacyPath(lang, app), app },
  ]),
])

export const langFromPath = (pathname: string): Lang => (pathname === '/en' || pathname.startsWith('/en/') ? 'en' : 'pt')

export function resolveRoute(pathname: string): Route | undefined {
  const path = pathname.endsWith('/') ? pathname : pathname + '/'
  return routes.find(r => r.path === path)
}

/** The same page in another language. */
export function pathIn(route: Route | undefined, lang: Lang): string {
  if (!route || route.kind === 'home') return homePath(lang)
  return route.kind === 'app' ? appPath(lang, route.app) : privacyPath(lang, route.app)
}
