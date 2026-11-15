import type { ReactNode } from 'react'
import { apps, company, playUrl, type AppInfo } from './data/site'
import { appPath, privacyPath, resolveRoute } from './routes'

function Header() {
  return (
    <header className="header">
      <div className="container header-inner">
        <a href="/" className="brand" aria-label={`${company.name}: página inicial`}>
          <img src="/img/logo-hsi-96.webp" width={36} height={36} alt="" />
          <span>
            <strong>{company.shortName}</strong>
            <span className="brand-sub">{company.name}</span>
          </span>
        </a>
        <nav className="nav" aria-label="Principal">
          <a href="/#apps">Apps</a>
          <a href="/#sobre">Sobre</a>
          <a href="/#contato">Contato</a>
        </nav>
      </div>
    </header>
  )
}

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <div className="footer-brand">
            <img src="/img/logo-hsi-96.webp" width={28} height={28} alt="" />
            <strong>{company.name}</strong>
          </div>
          <p className="muted small">
            {company.legalName} · <span className="nowrap">CNPJ {company.cnpj}</span>
            <br />
            {company.city} – {company.state}, Brasil
          </p>
        </div>
        <div>
          <h2 className="footer-title">Políticas de privacidade</h2>
          <ul className="footer-links">
            {apps.map(app => (
              <li key={app.slug}>
                <a href={privacyPath(app)}>{app.name}</a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="footer-title">Contato</h2>
          <p className="small">
            <a href={`mailto:${company.email}`}>{company.email}</a>
          </p>
          <p className="small muted">
            Desenvolvido por <a href={company.founderUrl}>{company.founder}</a>
          </p>
        </div>
      </div>
      <div className="container footer-bottom muted small">
        © {company.lastUpdated.slice(0, 4)} {company.name} ({company.shortName})
      </div>
    </footer>
  )
}

function PlayButton({ app }: { app: AppInfo }) {
  if (!app.published) return <span className="badge-soon">Em breve na Google Play</span>
  return (
    <a className="btn" href={playUrl(app)} rel="noopener">
      Baixar na Google Play
    </a>
  )
}

function AppIcon({ app, size }: { app: AppInfo; size: number }) {
  return <img className="app-icon" src={`/img/apps/${app.slug}.webp`} width={size} height={size} alt={`Ícone do app ${app.name}`} />
}

function Home() {
  return (
    <>
      <section className="hero">
        <div className="container hero-inner">
          <div>
            <p className="eyebrow">{company.shortName} · Apps para Android</p>
            <h1>{company.name}</h1>
            <p className="lead">
              Apps simples e úteis para o dia a dia: organizar eventos, marcar o placar do jogo, achar o carro no
              estacionamento e falar com uma assistente por voz.
            </p>
            <div className="hero-actions">
              <a className="btn" href="#apps">
                Conheça os apps
              </a>
              <a className="btn btn-ghost" href="#contato">
                Fale com a gente
              </a>
            </div>
          </div>
          <img className="hero-logo" src="/img/logo-hsi-400.webp" width={240} height={240} alt={`Logo da ${company.shortName}`} />
        </div>
      </section>

      <section className="section" id="apps">
        <div className="container">
          <h2 className="section-title">Nossos apps</h2>
          <div className="app-grid">
            {apps.map(app => (
              <a key={app.slug} className="card app-card" href={appPath(app)}>
                <AppIcon app={app} size={72} />
                <div>
                  <h3>{app.name}</h3>
                  <p className="muted small">{app.categoryLabel}</p>
                  <p>{app.tagline}</p>
                  <span className="card-link">Ver detalhes →</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="sobre">
        <div className="container narrow">
          <h2 className="section-title">Sobre a {company.shortName}</h2>
          <p>
            A {company.name} ({company.shortName}) é uma empresa de software de {company.city} – {company.state}. Criamos
            apps que resolvem uma coisa só, e bem: sem cadastro, sem complicação e, sempre que possível, com os seus dados
            guardados apenas no seu celular.
          </p>
          <p>
            A empresa foi fundada por <a href={company.founderUrl}>{company.founder}</a>, engenheiro de software sênior com
            mais de 20 anos em tecnologia.
          </p>
        </div>
      </section>

      <section className="section" id="contato">
        <div className="container narrow">
          <h2 className="section-title">Contato e suporte</h2>
          <p>
            Encontrou um problema, tem uma sugestão ou quer pedir a exclusão de dados? Escreva para{' '}
            <a href={`mailto:${company.email}`}>{company.email}</a> e diga qual app você usa.
          </p>
        </div>
      </section>
    </>
  )
}

function Breadcrumb({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav className="breadcrumb small" aria-label="Você está em">
      {items.map((it, i) => (
        <span key={i}>
          {i > 0 && <span className="muted"> / </span>}
          {it.href ? <a href={it.href}>{it.label}</a> : <span className="muted">{it.label}</span>}
        </span>
      ))}
    </nav>
  )
}

function AppPage({ app }: { app: AppInfo }) {
  const support = `mailto:${company.email}?subject=${encodeURIComponent(`Suporte ${app.name}`)}`
  return (
    <section className="section page">
      <div className="container narrow">
        <Breadcrumb items={[{ label: 'Início', href: '/' }, { label: 'Apps', href: '/#apps' }, { label: app.name }]} />
        <div className="app-hero">
          <AppIcon app={app} size={112} />
          <div>
            <h1>{app.name}</h1>
            <p className="muted">{app.categoryLabel} · Android</p>
            <PlayButton app={app} />
          </div>
        </div>
        <p className="lead">{app.tagline}</p>
        {app.description.map((p, i) => (
          <p key={i}>{p}</p>
        ))}

        <h2 className="h2">O que ele faz</h2>
        <ul className="checklist">
          {app.features.map(f => (
            <li key={f}>{f}</li>
          ))}
        </ul>

        <h2 className="h2">Privacidade em resumo</h2>
        <ul>
          <li>Não pedimos cadastro nem login.</li>
          <li>Os seus dados ficam salvos apenas no seu celular; a {company.shortName} não recebe nem guarda esses dados.</li>
          <li>O app exibe anúncios do Google AdMob.</li>
        </ul>
        <p>
          <a href={privacyPath(app)}>Leia a política de privacidade completa do app {app.name} →</a>
        </p>

        <h2 className="h2">Suporte</h2>
        <p>
          Dúvidas, problemas ou sugestões: <a href={support}>{company.email}</a>.
        </p>
      </div>
    </section>
  )
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <>
      <h2 className="h2">{title}</h2>
      {children}
    </>
  )
}

function PrivacyPage({ app }: { app: AppInfo }) {
  const p = app.privacy
  return (
    <section className="section page">
      <article className="container narrow policy">
        <Breadcrumb
          items={[
            { label: 'Início', href: '/' },
            { label: app.name, href: appPath(app) },
            { label: 'Política de privacidade' },
          ]}
        />
        <h1>Política de privacidade do app {app.name}</h1>
        <p className="muted small">Última atualização: {company.lastUpdatedLabel}</p>

        <p>
          Esta política explica como o app <strong>{app.name}</strong> (Android, pacote <code>{app.packageId}</code>) trata as
          suas informações. O app é desenvolvido por {company.legalName}, nome fantasia {company.name} ({company.shortName}),
          CNPJ {company.cnpj}, com sede em {company.city} – {company.state}, que é a controladora dos dados nos termos da Lei
          Geral de Proteção de Dados (LGPD, Lei 13.709/2018).
        </p>

        <Section title="1. Resumo">
          <ul>
            <li>O app não tem cadastro nem login.</li>
            <li>
              Os dados que você digita ou que o app gera ficam <strong>só no seu celular</strong>. A {company.shortName} não
              tem servidor que receba esses dados e não os vende nem compartilha.
            </li>
            <li>
              O app exibe anúncios do Google AdMob, que coleta alguns dados do aparelho, como explicado no item 4.
            </li>
          </ul>
        </Section>

        <Section title="2. Dados guardados no seu aparelho">
          <ul>
            {p.onDevice.map(d => (
              <li key={d}>{d}</li>
            ))}
          </ul>
          <p>
            Esses dados ficam no armazenamento interno do app. Se o backup automático do Android estiver ativado na sua
            conta Google, eles podem entrar no backup do aparelho, que é gerenciado pelo Google e não pela{' '}
            {company.shortName}.
          </p>
        </Section>

        <Section title="3. Permissões do aparelho">
          <ul>
            {p.permissions.map(perm => (
              <li key={perm.name}>
                <strong>{perm.name}:</strong> {perm.why}
              </li>
            ))}
          </ul>
          <p>Você pode negar ou revogar as permissões nas configurações do Android a qualquer momento.</p>
        </Section>

        <Section title="4. Serviços de terceiros">
          <p>O app usa os serviços abaixo. Cada um tem a sua própria política de privacidade:</p>
          <ul>
            {p.thirdParties.map(t => (
              <li key={t.name}>
                <strong>{t.name}:</strong> {t.what}{' '}
                <a href={t.policyUrl} rel="noopener">
                  Política do serviço
                </a>
                .
              </li>
            ))}
          </ul>
          <p>
            Você pode redefinir ou excluir o ID de publicidade do aparelho em <em>Configurações → Google → Anúncios</em>{' '}
            (o caminho pode variar conforme o fabricante).
          </p>
        </Section>

        <Section title="5. Como apagar os seus dados">
          <p>
            Como os dados ficam só no aparelho, você mesmo pode apagá-los: em <em>Configurações → Apps → {app.name} →
            Armazenamento → Limpar dados</em>, ou desinstalando o app. A {company.shortName} não guarda cópia.
          </p>
        </Section>

        <Section title="6. Crianças">
          <p>
            O app não é direcionado a crianças menores de 13 anos e não coleta intencionalmente dados pessoais delas.
          </p>
        </Section>

        <Section title="7. Seus direitos (LGPD)">
          <p>
            Você pode pedir confirmação de tratamento, acesso, correção, exclusão e informações sobre compartilhamento dos
            seus dados. Como a {company.shortName} não recebe dados dos usuários, na maioria dos casos não há o que acessar
            ou excluir do nosso lado, mas responderemos a qualquer pedido pelo e-mail{' '}
            <a href={`mailto:${company.email}`}>{company.email}</a>.
          </p>
        </Section>

        {p.notes && (
          <Section title="Observações">
            <ul>
              {p.notes.map(n => (
                <li key={n}>{n}</li>
              ))}
            </ul>
          </Section>
        )}

        <Section title="8. Mudanças nesta política">
          <p>
            Se esta política mudar, a nova versão será publicada nesta página com a data de atualização. Mudanças
            relevantes também serão informadas no app ou na página dele na Google Play.
          </p>
        </Section>

        <Section title="9. Contato">
          <p>
            {company.legalName} ({company.name}) · CNPJ {company.cnpj}
            <br />
            E-mail: <a href={`mailto:${company.email}`}>{company.email}</a>
          </p>
        </Section>
      </article>
    </section>
  )
}

function NotFound() {
  return (
    <section className="section page">
      <div className="container narrow">
        <h1>Página não encontrada</h1>
        <p>
          <a href="/">Voltar para o início</a>
        </p>
      </div>
    </section>
  )
}

export default function App({ path }: { path: string }) {
  const route = resolveRoute(path)
  return (
    <>
      <Header />
      <main>
        {!route ? (
          <NotFound />
        ) : route.kind === 'home' ? (
          <Home />
        ) : route.kind === 'app' ? (
          <AppPage app={route.app} />
        ) : (
          <PrivacyPage app={route.app} />
        )}
      </main>
      <Footer />
    </>
  )
}
