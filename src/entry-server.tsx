import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import App from './App'
import { company } from './data/site'
import { appPath, resolveRoute, routes } from './routes'

export { company, routes }

export function render(path: string) {
  return renderToString(
    <StrictMode>
      <App path={path} />
    </StrictMode>,
  )
}

const organization = {
  '@type': 'Organization',
  '@id': `${company.siteUrl}/#organization`,
  name: company.name,
  alternateName: company.shortName,
  legalName: company.legalName,
  taxID: company.cnpj,
  url: company.siteUrl + '/',
  logo: company.siteUrl + company.logo,
  email: company.email,
  founder: { '@type': 'Person', name: company.founder, url: company.founderUrl },
  address: { '@type': 'PostalAddress', addressLocality: company.city, addressRegion: company.state, addressCountry: 'BR' },
}

/** Page metadata and structured data, consumed by scripts/prerender.mjs. */
export function head(path: string) {
  const route = resolveRoute(path)
  if (!route) throw new Error(`unknown route ${path}`)
  const url = company.siteUrl + route.path

  if (route.kind === 'home') {
    return {
      title: `${company.name} (${company.shortName}) · Apps para Android`,
      description:
        'HSI – Help Soluções em Informática: apps para Android como PlanEvento, Marcador de Jogos, K.I.R.A. e My Spot. ' +
        'Sem cadastro, com os dados guardados no seu celular.',
      url,
      ogType: 'website',
      ogImage: company.siteUrl + company.ogImage,
      jsonLd: {
        '@context': 'https://schema.org',
        '@graph': [
          organization,
          { '@type': 'WebSite', '@id': `${company.siteUrl}/#website`, url: company.siteUrl + '/', name: company.name, inLanguage: 'pt-BR', publisher: { '@id': organization['@id'] } },
        ],
      },
    }
  }

  const { app } = route
  const crumbs = [
    { name: 'Início', item: company.siteUrl + '/' },
    { name: app.name, item: company.siteUrl + appPath(app) },
  ]
  if (route.kind === 'privacy') crumbs.push({ name: 'Política de privacidade', item: url })
  const breadcrumb = {
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({ '@type': 'ListItem', position: i + 1, ...c })),
  }

  if (route.kind === 'privacy') {
    return {
      title: `Política de privacidade · ${app.name} · ${company.shortName}`,
      description: `Política de privacidade do app ${app.name} para Android, da ${company.name} (${company.shortName}): quais dados o app usa, permissões, anúncios e como apagar seus dados.`,
      url,
      ogType: 'article',
      ogImage: company.siteUrl + company.ogImage,
      jsonLd: { '@context': 'https://schema.org', '@graph': [breadcrumb] },
    }
  }

  return {
    title: `${app.name}: ${app.tagline.replace(/\.$/, '')} · ${company.shortName}`,
    description: `${app.description[0]} App para Android da ${company.name}.`,
    keywords: app.keywords,
    url,
    ogType: 'website',
    ogImage: `${company.siteUrl}/img/apps/${app.slug}-512.png`,
    ogImageSquare: true,
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'MobileApplication',
          name: app.name,
          description: app.description.join(' '),
          url,
          image: `${company.siteUrl}/img/apps/${app.slug}-512.png`,
          operatingSystem: 'Android',
          applicationCategory: app.category,
          inLanguage: 'pt-BR',
          featureList: app.features,
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'BRL' },
          publisher: organization,
          ...(app.published ? { installUrl: `https://play.google.com/store/apps/details?id=${app.packageId}` } : {}),
        },
        breadcrumb,
      ],
    },
  }
}
