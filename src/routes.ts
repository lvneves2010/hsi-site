import { apps, type AppInfo } from './data/site'

export type Route =
  | { kind: 'home'; path: '/' }
  | { kind: 'app'; path: string; app: AppInfo }
  | { kind: 'privacy'; path: string; app: AppInfo }

export const appPath = (app: AppInfo) => `/apps/${app.slug}/`
export const privacyPath = (app: AppInfo) => `/apps/${app.slug}/privacidade/`

/** Every prerendered page. scripts/prerender.mjs writes one HTML file per entry and builds the sitemap from it. */
export const routes: Route[] = [
  { kind: 'home', path: '/' },
  ...apps.flatMap(app => [
    { kind: 'app' as const, path: appPath(app), app },
    { kind: 'privacy' as const, path: privacyPath(app), app },
  ]),
]

export function resolveRoute(pathname: string): Route | undefined {
  const path = pathname.endsWith('/') ? pathname : pathname + '/'
  return routes.find(r => r.path === path)
}
