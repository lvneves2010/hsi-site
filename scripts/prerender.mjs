// Renders every route to static HTML (dist/<path>/index.html) and writes dist/sitemap.xml and
// dist/robots.txt, so search engines and link previews get the full content without running JS.
import { mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

const dist = resolve('dist')
const ssr = await import(pathToFileURL(resolve('dist-ssr/entry-server.js')).href)
const { company } = ssr
const template = readFileSync(resolve(dist, 'index.html'), 'utf8')

// Preload the Latin subset of Inter so it arrives with the CSS instead of after it.
const interLatin = readdirSync(resolve(dist, 'assets')).find(f => /^inter-latin-wght-normal-.*\.woff2$/.test(f))
if (!interLatin) throw new Error('Inter latin font not found in dist/assets')

const esc = s => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')

for (const { path } of ssr.routes) {
  const h = ssr.head(path)
  const tags = [
    `<link rel="preload" href="/assets/${interLatin}" as="font" type="font/woff2" crossorigin />`,
    `<title>${esc(h.title)}</title>`,
    `<meta name="description" content="${esc(h.description)}" />`,
    h.keywords && `<meta name="keywords" content="${esc(h.keywords)}" />`,
    `<meta name="robots" content="index, follow, max-image-preview:large" />`,
    `<link rel="canonical" href="${h.url}" />`,
    ...Object.entries(h.alternates).map(([hl, href]) => `<link rel="alternate" hreflang="${hl}" href="${href}" />`),
    company.googleSiteVerification && `<meta name="google-site-verification" content="${esc(company.googleSiteVerification)}" />`,
    `<meta property="og:type" content="${h.ogType}" />`,
    `<meta property="og:site_name" content="${esc(company.name)}" />`,
    `<meta property="og:locale" content="${h.ogLocale}" />`,
    ...h.ogLocaleAlt.map(l => `<meta property="og:locale:alternate" content="${l}" />`),
    `<meta property="og:title" content="${esc(h.title)}" />`,
    `<meta property="og:description" content="${esc(h.description)}" />`,
    `<meta property="og:url" content="${h.url}" />`,
    `<meta property="og:image" content="${h.ogImage}" />`,
    `<meta name="twitter:card" content="${h.ogImageSquare ? 'summary' : 'summary_large_image'}" />`,
    `<script type="application/ld+json">${JSON.stringify(h.jsonLd).replace(/</g, '\\u003c')}</script>`,
  ]
    .filter(Boolean)
    .join('\n    ')

  const html = template
    .replace('<html lang="pt-BR">', `<html lang="${h.lang}">`)
    .replace('<!--head-->', tags)
    .replace('<!--app-->', ssr.render(path))
  const out = resolve(dist, path.slice(1), 'index.html')
  mkdirSync(dirname(out), { recursive: true })
  writeFileSync(out, html)
  console.log(`prerendered ${path}`)
}

// Sitemap with hreflang alternates for each page.
const urls = ssr.routes.map(({ path }) => {
  const h = ssr.head(path)
  const alts = Object.entries(h.alternates)
    .map(([hl, href]) => `    <xhtml:link rel="alternate" hreflang="${hl}" href="${href}"/>`)
    .join('\n')
  return `  <url>\n    <loc>${h.url}</loc>\n    <lastmod>${company.lastUpdated}</lastmod>\n${alts}\n  </url>`
})
writeFileSync(
  resolve(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join('\n')}\n</urlset>\n`,
)
writeFileSync(resolve(dist, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${company.siteUrl}/sitemap.xml\n`)
console.log('wrote sitemap.xml and robots.txt')

rmSync(resolve('dist-ssr'), { recursive: true, force: true })
