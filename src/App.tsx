import { apps, company, playUrl, serviceKeys, type AppInfo } from './data/site'
import { content, type Content, type Lang } from './i18n'
import { appPath, homePath, langFromPath, pathIn, privacyPath, resolveRoute, type Route } from './routes'

type T = { t: Content; lang: Lang }

function ThemeIcon() {
  // Sun in dark mode, moon in light mode (switched by CSS).
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
      <g className="i-moon">
        <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" />
      </g>
      <g className="i-sun">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </g>
    </svg>
  )
}

function Header({ t, lang, route }: T & { route?: Route }) {
  const home = homePath(lang)
  const links = [
    ['#services', t.nav.services],
    ['#process', t.nav.process],
    ['#apps', t.nav.apps],
    ['#about', t.nav.about],
    ['#contact', t.nav.contact],
  ] as const
  const other: Lang = lang === 'pt' ? 'en' : 'pt'
  return (
    <header className="header">
      <a className="skip" href="#main">
        {t.ui.skip}
      </a>
      <div className="container header-inner">
        <a href={home} className="brand" aria-label={`${company.name}: ${t.ui.home}`}>
          <img src={company.logo} width={38} height={38} alt="" />
          <span>
            <strong>{company.shortName}</strong>
            <span className="brand-sub">{company.name}</span>
          </span>
        </a>
        <nav className="nav" aria-label={t.ui.menu}>
          {links.map(([hash, label]) => (
            <a key={hash} href={home + hash}>
              {label}
            </a>
          ))}
        </nav>
        <div className="header-actions">
          <a className="lang-switch" href={pathIn(route, other)} hrefLang={content[other].htmlLang} lang={content[other].htmlLang} title={t.ui.otherLangName}>
            {t.ui.otherLang}
          </a>
          <button type="button" className="icon-btn" data-theme-toggle aria-label={t.ui.toggleTheme} title={t.ui.toggleTheme}>
            <ThemeIcon />
          </button>
          <details className="mobile-menu">
            <summary className="icon-btn" aria-label={t.ui.menu}>
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            </summary>
            <nav className="mobile-nav" aria-label={t.ui.menu}>
              {links.map(([hash, label]) => (
                <a key={hash} href={home + hash}>
                  {label}
                </a>
              ))}
            </nav>
          </details>
        </div>
      </div>
    </header>
  )
}

function Footer({ t, lang }: T) {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <div className="footer-brand">
            <img src={company.logo} width={40} height={40} alt="" />
            <strong>{company.name}</strong>
          </div>
          <p className="muted small">{t.ui.footerAbout}</p>
          <p className="muted small">
            {company.legalName} · <span className="nowrap">CNPJ {company.cnpj}</span>
            <br />
            {company.city} – {company.state}, {lang === 'pt' ? 'Brasil' : 'Brazil'} · {t.ui.since} {company.foundingYear}
          </p>
        </div>
        <div>
          <h2 className="footer-title">{t.ui.footerPolicies}</h2>
          <ul className="footer-links">
            {apps.map(app => (
              <li key={app.slug}>
                <a href={privacyPath(lang, app)}>{app.name}</a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="footer-title">{t.ui.footerContact}</h2>
          <p className="small">
            <a href={`mailto:${company.email}`}>{company.email}</a>
          </p>
          <p className="small muted">
            {t.ui.founderLine} <a href={company.founderUrl[lang]}>{company.founder}</a>
          </p>
        </div>
      </div>
      <div className="container footer-bottom muted small">
        © {company.lastUpdated.slice(0, 4)} {company.name} ({company.shortName})
      </div>
    </footer>
  )
}

function PlayButton({ app, t }: { app: AppInfo; t: Content }) {
  if (!app.published) return <span className="badge-soon">{t.ui.soon}</span>
  return (
    <a className="btn" href={playUrl(app)} rel="noopener">
      {t.ui.download}
    </a>
  )
}

function AppIcon({ app, size, t }: { app: AppInfo; size: number; t: Content }) {
  return <img className="app-icon" src={`/img/apps/${app.slug}.webp`} width={size} height={size} alt={t.ui.iconAlt(app.name)} loading="lazy" />
}

function AppCards({ t, lang, list }: T & { list: AppInfo[] }) {
  return (
    <div className="app-grid">
      {list.map(app => (
        <a key={app.slug} className="card app-card reveal" href={appPath(lang, app)}>
          <AppIcon app={app} size={72} t={t} />
          <div>
            <h3>{app.name}</h3>
            <p className="muted small">{t.apps[app.slug].categoryLabel}</p>
            <p>{t.apps[app.slug].tagline}</p>
            <span className="card-link">{t.ui.seeDetails} →</span>
          </div>
        </a>
      ))}
    </div>
  )
}

function Home({ t, lang }: T) {
  const h = t.home
  const quote = `mailto:${company.email}?subject=${encodeURIComponent(t.ui.quoteSubject)}`
  return (
    <>
      <section className="hero">
        <div className="container hero-inner">
          <div className="hero-text">
            <p className="eyebrow">{h.eyebrow}</p>
            <h1>{company.name}</h1>
            <p className="lead">{h.lead}</p>
            <div className="hero-actions">
              <a className="btn btn-lg" href={quote}>
                {h.ctaPrimary}
              </a>
              <a className="btn btn-ghost btn-lg" href="#services">
                {h.ctaSecondary}
              </a>
            </div>
          </div>
          <div className="hero-visual">
            <img
              className="hero-photo"
              src="/img/hero-1040.webp"
              srcSet="/img/hero-640.webp 640w, /img/hero-1040.webp 1040w"
              sizes="(max-width: 860px) 92vw, 480px"
              width={1040}
              height={780}
              alt=""
              fetchPriority="high"
            />
            <div className="hero-logo-card">
              <img src={company.logo} width={96} height={96} alt={t.ui.logoAlt} />
            </div>
            <span className="hero-badge">{h.heroBadge}</span>
          </div>
        </div>
        <div className="container">
          <ul className="stats">
            {h.stats.map(s => (
              <li key={s.label}>
                <strong>{s.value}</strong>
                <span>{s.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section" id="services">
        <div className="container">
          <h2 className="section-title">{h.servicesTitle}</h2>
          <p className="section-intro">{h.servicesIntro}</p>
          <div className="service-grid">
            {serviceKeys.map(key => {
              const s = t.services[key]
              return (
                <article key={key} className="card service-card reveal">
                  <img src={`/img/services/${key}.webp`} width={640} height={360} alt="" loading="lazy" />
                  <div className="service-body">
                    <h3>{s.title}</h3>
                    <p>{s.text}</p>
                    <ul className="chips">
                      {s.tech.map(x => (
                        <li key={x}>{x}</li>
                      ))}
                    </ul>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      <section className="section section-alt" id="process">
        <div className="container">
          <h2 className="section-title">{h.processTitle}</h2>
          <p className="section-intro">{h.processIntro}</p>
          <ol className="process">
            {h.process.map((p, i) => (
              <li key={p.title} className="reveal">
                <span className="step">{String(i + 1).padStart(2, '0')}</span>
                <h3>{p.title}</h3>
                <p>{p.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section" id="apps">
        <div className="container">
          <h2 className="section-title">{h.appsTitle}</h2>
          <p className="section-intro">{h.appsIntro}</p>
          <AppCards t={t} lang={lang} list={apps} />
        </div>
      </section>

      <section className="section section-alt" id="about">
        <div className="container about">
          <div>
            <h2 className="section-title">{h.aboutTitle}</h2>
            {h.about.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          <aside className="card founder reveal">
            <img src={company.founderPhoto} width={220} height={220} alt={company.founder} loading="lazy" />
            <strong>{company.founder}</strong>
            <span className="muted small">{h.founderRole}</span>
            <a className="card-link" href={company.founderUrl[lang]}>
              {h.founderLink} →
            </a>
          </aside>
        </div>
      </section>

      <section className="cta-band">
        <div className="container cta-inner">
          <div>
            <h2>{h.ctaTitle}</h2>
            <p>{h.ctaText}</p>
          </div>
          <a className="btn btn-light btn-lg" href={quote}>
            {h.ctaButton}
          </a>
        </div>
      </section>

      <section className="section" id="contact">
        <div className="container">
          <h2 className="section-title">{h.contactTitle}</h2>
          <div className="contact-grid">
            {h.contact.map((p, i) => (
              <p key={i} className="card contact-card reveal">
                {p}
              </p>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

function Breadcrumb({ items, label }: { items: { label: string; href?: string }[]; label: string }) {
  return (
    <nav className="breadcrumb small" aria-label={label}>
      {items.map((it, i) => (
        <span key={i}>
          {i > 0 && <span className="muted"> / </span>}
          {it.href ? <a href={it.href}>{it.label}</a> : <span className="muted">{it.label}</span>}
        </span>
      ))}
    </nav>
  )
}

function AppPage({ t, lang, app }: T & { app: AppInfo }) {
  const a = t.apps[app.slug]
  const support = `mailto:${company.email}?subject=${encodeURIComponent(t.ui.supportSubject(app.name))}`
  return (
    <>
      <section className="page-hero">
        <div className="container narrow">
          <Breadcrumb
            label={t.ui.breadcrumb}
            items={[{ label: t.ui.home, href: homePath(lang) }, { label: t.nav.apps, href: homePath(lang) + '#apps' }, { label: app.name }]}
          />
          <div className="app-hero">
            <AppIcon app={app} size={120} t={t} />
            <div>
              <h1>{app.name}</h1>
              <p className="muted">{a.categoryLabel} · Android</p>
              <PlayButton app={app} t={t} />
            </div>
          </div>
          <p className="lead">{a.tagline}</p>
        </div>
      </section>
      <section className="section page">
        <div className="container narrow">
          {a.description.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
          <h2 className="h2">{t.appPage.whatItDoes}</h2>
          <ul className="checklist">
            {a.features.map(f => (
              <li key={f}>{f}</li>
            ))}
          </ul>
          <div className="card note">
            <h2 className="h2">{t.appPage.privacyTitle}</h2>
            <ul>
              {t.appPage.privacyItems.map(x => (
                <li key={x}>{x}</li>
              ))}
            </ul>
            <a className="card-link" href={privacyPath(lang, app)}>
              {t.appPage.readPolicy(app.name)} →
            </a>
          </div>
          <h2 className="h2">{t.appPage.supportTitle}</h2>
          <p>
            {t.appPage.supportText} <a href={support}>{company.email}</a>
          </p>
          <h2 className="h2">{t.appPage.otherApps}</h2>
          <AppCards t={t} lang={lang} list={apps.filter(x => x.slug !== app.slug)} />
        </div>
      </section>
    </>
  )
}

function PrivacyPage({ t, lang, app }: T & { app: AppInfo }) {
  const p = t.policy(app, t.apps[app.slug])
  return (
    <section className="section page">
      <article className="container narrow policy">
        <Breadcrumb
          label={t.ui.breadcrumb}
          items={[{ label: t.ui.home, href: homePath(lang) }, { label: app.name, href: appPath(lang, app) }, { label: t.seo.crumbPrivacy }]}
        />
        <h1>{p.title}</h1>
        <p className="muted small">
          {lang === 'pt' ? 'Última atualização' : 'Last updated'}: {t.dateLabel(company.lastUpdated)}
        </p>
        <p>{p.intro}</p>
        {p.sections.map(s => (
          <section key={s.title}>
            <h2 className="h2">{s.title}</h2>
            {s.body}
          </section>
        ))}
      </article>
    </section>
  )
}

function NotFound({ t, lang }: T) {
  return (
    <section className="section page">
      <div className="container narrow">
        <h1>{t.ui.notFound}</h1>
        <p>
          <a href={homePath(lang)}>{t.ui.backHome}</a>
        </p>
      </div>
    </section>
  )
}

export default function App({ path }: { path: string }) {
  const route = resolveRoute(path)
  const lang = route?.lang ?? langFromPath(path)
  const t = content[lang]
  return (
    <>
      <Header t={t} lang={lang} route={route} />
      <main id="main">
        {!route ? (
          <NotFound t={t} lang={lang} />
        ) : route.kind === 'home' ? (
          <Home t={t} lang={lang} />
        ) : route.kind === 'app' ? (
          <AppPage t={t} lang={lang} app={route.app} />
        ) : (
          <PrivacyPage t={t} lang={lang} app={route.app} />
        )}
      </main>
      <Footer t={t} lang={lang} />
    </>
  )
}
