// Language-independent data. Texts in each language live in src/i18n/pt.tsx and src/i18n/en.tsx.

export const company = {
  shortName: 'HSI',
  name: 'Help Soluções em Informática',
  cnpj: '31.412.990/0001-07',
  city: 'Guarulhos',
  state: 'SP',
  // Public contact e-mail (support, privacy requests). Change here when the company e-mail exists.
  email: 'lvneves2010@gmail.com',
  founder: 'Leonardo Neves',
  founderUrl: { pt: 'https://leoneves-eng-de-software.web.app/', en: 'https://leoneves-eng-de-software.web.app/en/' },
  founderPhoto: '/img/leonardo-neves-440.webp',
  siteUrl: 'https://hsi-help-solucoes.web.app',
  // From the public CNPJ record (Receita Federal): activity start date.
  foundingDate: '2018-09-03',
  foundingYear: '2018',
  logo: '/logo-hsi.svg',
  logoPng: '/img/logo-hsi-512.png',
  ogImage: { pt: '/img/og-image.jpg', en: '/img/og-image-en.jpg' },
  // Google Search Console HTML-tag token (content="..."). Empty = no tag.
  googleSiteVerification: 'aUqOwpMULz5jXUEqC2DyV17yKP6goe0JalHV3oZNQQk',
  // Date shown on the privacy policies and used as <lastmod> in the sitemap. Update when content changes.
  lastUpdated: '2026-11-15',
}

export type ServiceKey = 'code' | 'web' | 'mobile' | 'integration' | 'cloud' | 'ai' | 'consulting' | 'support'

/** Order of the services (CNAEs of the company + the founder's experience). Texts per language in src/i18n/;
 * photos in public/img/services/<key>.webp (CC0 / public domain, see CREDITS.md there). */
export const serviceKeys: ServiceKey[] = ['code', 'web', 'mobile', 'integration', 'cloud', 'ai', 'consulting', 'support']

export type AppSlug = 'planevento' | 'marcador-de-jogos' | 'kira' | 'my-spot'

export type AppInfo = {
  slug: AppSlug
  name: string
  packageId: string
  /** false = "coming soon"; true = links to the Play listing. */
  published: boolean
  category: string // schema.org applicationCategory
}

export const apps: AppInfo[] = [
  { slug: 'planevento', name: 'PlanEvento', packageId: 'br.com.hsi.planevento', published: false, category: 'LifestyleApplication' },
  { slug: 'marcador-de-jogos', name: 'Marcador de Jogos', packageId: 'br.com.hsi.marcadorjogos', published: false, category: 'GameApplication' },
  { slug: 'kira', name: 'K.I.R.A.', packageId: 'br.com.hsi.kira', published: false, category: 'UtilitiesApplication' },
  { slug: 'my-spot', name: 'My Spot', packageId: 'br.com.hsi.myspot', published: false, category: 'TravelApplication' },
]

export const playUrl = (app: AppInfo) => `https://play.google.com/store/apps/details?id=${app.packageId}`
