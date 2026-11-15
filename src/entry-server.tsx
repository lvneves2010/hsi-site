import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import App from './App'
import { company, serviceKeys } from './data/site'
import { content, langs, type Lang } from './i18n'
import { appPath, homePath, pathIn, resolveRoute, routes } from './routes'

export { company, routes }

export function render(path: string) {
  return renderToString(
    <StrictMode>
      <App path={path} />
    </StrictMode>,
  )
}

function organization(lang: Lang) {
  const t = content[lang]
  return {
    '@type': 'Organization',
    '@id': `${company.siteUrl}/#organization`,
    name: company.name,
    alternateName: company.shortName,
    taxID: company.cnpj,
    url: company.siteUrl + homePath(lang),
    logo: company.siteUrl + company.logoPng,
    email: company.email,
    foundingDate: company.foundingDate,
    areaServed: 'BR',
    knowsAbout: serviceKeys.flatMap(k => t.services[k].tech),
    makesOffer: serviceKeys.map(k => ({
      '@type': 'Offer',
      itemOffered: { '@type': 'Service', name: t.services[k].title, description: t.services[k].text },
    })),
    // Same @id as the Person in the founder's portfolio JSON-LD, so search engines link both entities.
    founder: { '@type': 'Person', '@id': 'https://leoneves-eng-de-software.web.app/#person', name: company.founder, url: company.founderUrl[lang] },
    address: { '@type': 'PostalAddress', addressLocality: company.city, addressRegion: company.state, addressCountry: 'BR' },
  }
}

/** Page metadata and structured data, consumed by scripts/prerender.mjs. */
export function head(path: string) {
  const route = resolveRoute(path)
  if (!route) throw new Error(`unknown route ${path}`)
  const { lang } = route
  const t = content[lang]
  const url = company.siteUrl + route.path
  const alternates = Object.fromEntries([
    ...langs.map(l => [content[l].htmlLang, company.siteUrl + pathIn(route, l)]),
    ['x-default', company.siteUrl + pathIn(route, 'pt')],
  ])
  const base = {
    lang: t.htmlLang,
    url,
    alternates,
    ogLocale: t.ogLocale,
    ogLocaleAlt: langs.filter(l => l !== lang).map(l => content[l].ogLocale),
    ogImage: company.siteUrl + company.ogImage[lang],
    ogImageSquare: false,
    keywords: '',
  }

  if (route.kind === 'home') {
    return {
      ...base,
      title: t.seo.homeTitle,
      description: t.seo.homeDescription,
      keywords: t.seo.homeKeywords,
      ogType: 'website',
      jsonLd: {
        '@context': 'https://schema.org',
        '@graph': [
          organization(lang),
          {
            '@type': 'WebSite',
            '@id': `${company.siteUrl}/#website`,
            url: company.siteUrl + '/',
            name: company.name,
            inLanguage: langs.map(l => content[l].htmlLang),
            publisher: { '@id': `${company.siteUrl}/#organization` },
          },
        ],
      },
    }
  }

  const { app } = route
  const a = t.apps[app.slug]
  const crumbs = [
    { name: t.seo.crumbHome, item: company.siteUrl + homePath(lang) },
    { name: app.name, item: company.siteUrl + appPath(lang, app) },
  ]
  if (route.kind === 'privacy') crumbs.push({ name: t.seo.crumbPrivacy, item: url })
  const breadcrumb = {
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({ '@type': 'ListItem', position: i + 1, ...c })),
  }

  if (route.kind === 'privacy') {
    return {
      ...base,
      title: t.seo.privacyTitle(app),
      description: t.seo.privacyDescription(app),
      ogType: 'article',
      jsonLd: { '@context': 'https://schema.org', '@graph': [breadcrumb] },
    }
  }

  const image = `${company.siteUrl}/img/apps/${app.slug}-512.png`
  return {
    ...base,
    title: t.seo.appTitle(app, a),
    description: t.seo.appDescription(app, a),
    keywords: a.keywords,
    ogType: 'website',
    ogImage: image,
    ogImageSquare: true,
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'MobileApplication',
          name: app.name,
          description: a.description.join(' '),
          url,
          image,
          operatingSystem: 'Android',
          applicationCategory: app.category,
          inLanguage: 'pt-BR',
          featureList: a.features,
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'BRL' },
          publisher: { '@type': 'Organization', name: company.name, url: company.siteUrl + homePath(lang) },
          ...(app.published ? { installUrl: `https://play.google.com/store/apps/details?id=${app.packageId}` } : {}),
        },
        breadcrumb,
      ],
    },
  }
}
