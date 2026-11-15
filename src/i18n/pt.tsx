import { company } from '../data/site'
import type { Content, ThirdParty } from './types'

const admob: ThirdParty = {
  name: 'Google AdMob (anúncios)',
  what:
    'Para exibir anúncios, o SDK do Google AdMob pode coletar o identificador de publicidade do aparelho, o endereço IP, ' +
    'informações técnicas do aparelho e interações com os anúncios. Na primeira abertura, quando a lei exige, o app pede o ' +
    'seu consentimento para anúncios personalizados; a escolha pode ser revista em "Privacidade dos anúncios", no próprio app.',
  policyUrl: 'https://policies.google.com/technologies/partner-sites',
}

const internetAdsOnly = { name: 'Internet', why: 'Usada apenas para carregar os anúncios.' }
const months = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro']
const mail = <a href={`mailto:${company.email}`}>{company.email}</a>

export const pt: Content = {
  lang: 'pt',
  htmlLang: 'pt-BR',
  ogLocale: 'pt_BR',
  dateLabel: iso => {
    const [y, m, d] = iso.split('-').map(Number)
    return `${d} de ${months[m - 1]} de ${y}`
  },
  nav: { services: 'Serviços', process: 'Como trabalhamos', apps: 'Apps', about: 'Sobre', contact: 'Contato' },
  ui: {
    skip: 'Pular para o conteúdo',
    menu: 'Menu',
    toggleTheme: 'Alternar tema claro/escuro',
    langName: 'Português',
    home: 'Início',
    seeDetails: 'Ver detalhes',
    soon: 'Em breve na Google Play',
    download: 'Baixar na Google Play',
    breadcrumb: 'Você está em',
    logoAlt: 'Logo da HSI',
    iconAlt: app => `Ícone do app ${app}`,
    notFound: 'Página não encontrada',
    backHome: 'Voltar para o início',
    quoteSubject: 'Orçamento',
    supportSubject: app => `Suporte ${app}`,
    footerAbout: 'Software sob encomenda, sites, apps e consultoria em TI.',
    footerPolicies: 'Políticas de privacidade',
    footerContact: 'Contato',
    founderLine: 'Fundada por',
    since: 'Desde',
  },
  home: {
    eyebrow: `Desde ${company.foundingYear} · ${company.city} – ${company.state}`,
    lead:
      'Desenvolvemos software sob encomenda, sites, apps para celular e integrações, e damos consultoria em TI, com a ' +
      'experiência de mais de 20 anos em tecnologia do nosso fundador.',
    ctaPrimary: 'Peça um orçamento',
    ctaSecondary: 'Conheça os serviços',
    heroBadge: 'Do código à publicação',
    stats: [
      { value: company.foundingYear, label: 'empresa aberta' },
      { value: '20+', label: 'anos de experiência do fundador' },
      { value: '20+', label: 'empresas atendidas no Brasil e na América Latina' },
      { value: '4', label: 'apps próprios para Android' },
    ],
    servicesTitle: 'O que fazemos',
    servicesIntro: 'Do sistema sob medida ao app na loja: cuidamos do projeto inteiro ou da parte que você precisar.',
    processTitle: 'Como trabalhamos',
    processIntro: 'Um processo simples, com você acompanhando cada etapa.',
    process: [
      { title: 'Conversa', text: 'Entendemos o problema, o público e o que já existe hoje.' },
      { title: 'Proposta', text: 'Escopo, prazo e preço claros, antes de começar.' },
      { title: 'Desenvolvimento', text: 'Entregas curtas e frequentes, para você ver o resultado cedo.' },
      { title: 'Entrega e suporte', text: 'Publicação, treinamento da equipe e manutenção depois do lançamento.' },
    ],
    appsTitle: 'Apps próprios',
    appsIntro: 'Além dos projetos para clientes, a HSI desenvolve e publica os seus próprios apps para Android.',
    aboutTitle: 'Sobre a HSI',
    about: [
      <>
        A {company.name} ({company.shortName}) é uma empresa de tecnologia de {company.city} – {company.state}, aberta em{' '}
        {company.foundingYear}. Ela formalizou a consultoria que o nosso fundador mantinha desde 2013, que desenvolveu
        aplicações web para mais de 20 empresas no Brasil, na Argentina, no Peru e na Colômbia.
      </>,
      <>
        O fundador, {company.founder}, é engenheiro de software sênior com mais de 20 anos em tecnologia e passagens por
        empresas como IBM, Sony, Bradesco e Jadlog. Trabalha com desenvolvimento full stack, arquitetura de software,
        integração de sistemas, ERP, DevOps e desenvolvimento assistido por IA.
      </>,
      <>
        Nos nossos apps, seguimos uma regra simples: resolver uma coisa só, e bem, sem cadastro e, sempre que possível, com
        os seus dados guardados apenas no seu celular.
      </>,
    ],
    founderRole: 'Fundador · Engenheiro de Software Sênior',
    founderLink: 'Saiba mais',
    ctaTitle: 'Vamos tirar o seu projeto do papel?',
    ctaText: 'Conte o que você precisa. Respondemos com uma proposta sem compromisso.',
    ctaButton: 'Falar com a HSI',
    contactTitle: 'Contato',
    contact: [
      <>
        <strong>Tem um projeto?</strong> Escreva para {mail} contando o que você precisa.
      </>,
      <>
        <strong>Usa um dos nossos apps?</strong> Para suporte, sugestões ou pedidos sobre os seus dados, escreva para o
        mesmo e-mail e diga qual app você usa.
      </>,
    ],
  },
  services: {
    code: {
      title: 'Sistemas sob encomenda',
      text: 'Sistemas web e APIs feitos sob medida para o seu negócio, do levantamento de requisitos à produção.',
      tech: ['C#/.NET', 'Java', 'TypeScript', 'Node.js', 'Python'],
    },
    web: {
      title: 'Sites e aplicações web',
      text: 'Sites institucionais, portfólios e aplicações web rápidas, responsivas e preparadas para aparecer no Google.',
      tech: ['React', 'Angular', 'Vue', 'SEO'],
    },
    mobile: {
      title: 'Apps para celular',
      text: 'Apps Android e iOS, da ideia à publicação na loja, com a mesma experiência dos nossos apps próprios.',
      tech: ['Ionic', 'Capacitor', 'Flutter', 'React Native'],
    },
    integration: {
      title: 'Integrações e ERP',
      text: 'Integração entre sistemas por APIs e customização de ERP e plataformas corporativas.',
      tech: ['REST', 'Infor LN', 'Salesforce', 'ServiceNow'],
    },
    cloud: {
      title: 'Cloud e DevOps',
      text: 'Hospedagem, automação de infraestrutura e entrega contínua, para publicar com segurança e sem sustos.',
      tech: ['Docker', 'Terraform', 'CI/CD', 'AWS · GCP · Firebase'],
    },
    ai: {
      title: 'Inteligência artificial',
      text: 'Chatbots, assistentes e consultas a dados em linguagem natural, integrados aos seus sistemas.',
      tech: ['LLMs', 'NLP', 'Watson', 'Gemini'],
    },
    consulting: {
      title: 'Consultoria em TI',
      text: 'Arquitetura de software, escolha de tecnologia, revisão de código e planejamento de projetos.',
      tech: ['Arquitetura', 'Scrum', 'ITIL'],
    },
    support: {
      title: 'Suporte, manutenção e treinamento',
      text: 'Manutenção de sistemas existentes, suporte técnico e treinamento em informática para equipes.',
      tech: ['Manutenção', 'Suporte', 'Treinamento'],
    },
  },
  apps: {
    planevento: {
      categoryLabel: 'Organização de eventos',
      tagline: 'Organize festas e eventos: convidados, tarefas e orçamento num lugar só.',
      description: [
        'O PlanEvento ajuda a planejar aniversários, casamentos, chás e qualquer outro evento. Você cadastra os convidados, ' +
          'monta o cronograma de tarefas e acompanha quanto já gastou em cada categoria.',
        'Não precisa criar conta: tudo fica salvo no seu celular e o app funciona sem internet.',
      ],
      features: [
        'Vários eventos no mesmo app, com um painel para alternar entre eles',
        'Lista de convidados',
        'Cronograma de tarefas com status de andamento',
        'Controle financeiro por categoria: previsto e gasto',
        'Sem cadastro e sem login; os dados ficam no aparelho',
      ],
      keywords: 'organizar festa, planejar evento, lista de convidados, orçamento de festa, app de eventos',
      privacy: {
        onDevice: ['Eventos, convidados (nome e, se você quiser, e-mail), tarefas e lançamentos financeiros que você cadastrar.'],
        permissions: [internetAdsOnly],
        thirdParties: [admob],
      },
    },
    'marcador-de-jogos': {
      categoryLabel: 'Placar para jogos de cartas',
      tagline: 'Placar de truco, dominó e buraco direto no celular.',
      description: [
        'Chega de papel e caneta na mesa: o Marcador de Jogos marca os pontos de truco, dominó e buraco com um toque.',
        'O placar fica salvo no celular, então você pode fechar o app e continuar a partida depois.',
      ],
      features: [
        'Truco: nós contra eles, até 12 pontos',
        'Dominó: de 2 a 4 jogadores, com nomes, meta ajustável e opção de desfazer',
        'Buraco: lançamento por rodada e meta configurável (padrão de 3.000 pontos)',
        'Placar salvo automaticamente',
        'Sem cadastro e sem login',
      ],
      keywords: 'placar de truco, marcador de truco, placar de dominó, placar de buraco, contador de pontos',
      seoTitle: 'Marcador de Jogos – Placar de truco, dominó e buraco',
      privacy: {
        onDevice: ['Placar das partidas e nomes dos jogadores do dominó.'],
        permissions: [internetAdsOnly],
        thirdParties: [admob],
      },
    },
    kira: {
      categoryLabel: 'Assistente por voz',
      tagline: 'Assistente virtual por voz: fale um comando e a KIRA responde.',
      description: [
        'A KIRA é uma assistente por voz em português. Você fala e ela responde em voz: comandos rápidos, previsão do tempo, ' +
          'lanterna e perguntas livres para uma inteligência artificial.',
        'Para fazer uma pergunta à IA, comece a frase com "Kira". As respostas podem ser salvas num arquivo de texto no celular.',
      ],
      features: [
        'Comandos de voz em português, com resposta falada',
        'Perguntas livres à inteligência artificial (comece a frase com "Kira")',
        'Previsão do tempo para onde você está',
        'Liga e desliga a lanterna',
        'Salva a resposta em arquivo de texto',
      ],
      keywords: 'assistente de voz, assistente virtual, comando de voz, inteligência artificial, app de voz em português',
      privacy: {
        onDevice: ['Preferências do app e as respostas que você escolher salvar em arquivo (pasta Documentos do aparelho).'],
        permissions: [
          { name: 'Microfone', why: 'Para ouvir o seu comando enquanto o app está escutando. O app não grava nem guarda o áudio.' },
          {
            name: 'Localização',
            why: 'Só quando você pede a previsão do tempo, para saber de qual lugar buscar. Não é usada em segundo plano.',
          },
          { name: 'Internet', why: 'Para a previsão do tempo, as perguntas à IA e os anúncios.' },
        ],
        thirdParties: [
          {
            name: 'Reconhecimento de voz do Google (Android)',
            what:
              'A transcrição da fala é feita pelo serviço de reconhecimento de voz do sistema Android (Google), que recebe o ' +
              'áudio do comando para convertê-lo em texto.',
            policyUrl: 'https://policies.google.com/privacy',
          },
          {
            name: 'Google Gemini (inteligência artificial)',
            what:
              'Quando a frase começa com "Kira", o texto da pergunta é enviado ao Google Gemini para gerar a resposta. ' +
              'Não envie dados pessoais ou sensíveis nas perguntas.',
            policyUrl: 'https://policies.google.com/privacy',
          },
          {
            name: 'Open-Meteo (previsão do tempo)',
            what: 'Ao pedir a previsão do tempo, as coordenadas da sua localização são enviadas ao Open-Meteo para buscar a previsão.',
            policyUrl: 'https://open-meteo.com/en/terms',
          },
          admob,
        ],
      },
    },
    'my-spot': {
      categoryLabel: 'Onde estacionei',
      tagline: 'Marque onde estacionou e volte até o carro com uma seta.',
      description: [
        'Estacionou num shopping, num estádio ou numa rua que você não conhece? Aperte um botão e o My Spot guarda o lugar pelo GPS.',
        'Na volta, uma seta aponta para o carro e mostra a distância. Se preferir, abra a rota a pé no Google Maps.',
      ],
      features: [
        'Marca a vaga com um toque, usando a leitura de GPS mais precisa',
        'Seta e distância até o carro, com aviso quando você chega',
        'Anotação da vaga (piso, número, cor da coluna)',
        'Mostra há quanto tempo o carro está estacionado',
        'Rota a pé no Google Maps',
        'Sem cadastro e sem login; a vaga fica só no celular',
      ],
      keywords: 'onde estacionei, achar carro estacionado, localizar carro, marcar vaga, estacionamento',
      seoTitle: 'My Spot – App para achar o carro estacionado',
      privacy: {
        onDevice: ['A última vaga marcada: coordenadas, precisão do GPS, data e hora e a anotação que você escrever.'],
        permissions: [
          { name: 'Localização', why: 'Para marcar a vaga e guiar você de volta. Só é usada com o app aberto, nunca em segundo plano.' },
          internetAdsOnly,
        ],
        thirdParties: [
          {
            name: 'Google Maps',
            what: 'Só se você tocar em "Rota a pé no Google Maps": as coordenadas da vaga são abertas no app ou site do Google Maps.',
            policyUrl: 'https://policies.google.com/privacy',
          },
          admob,
        ],
      },
    },
  },
  appPage: {
    whatItDoes: 'O que ele faz',
    privacyTitle: 'Privacidade em resumo',
    privacyItems: [
      'Não pedimos cadastro nem login.',
      'Os seus dados ficam salvos apenas no seu celular; a HSI não recebe nem guarda esses dados.',
      'O app exibe anúncios do Google AdMob.',
    ],
    readPolicy: app => `Leia a política de privacidade completa do app ${app}`,
    supportTitle: 'Suporte',
    supportText: 'Dúvidas, problemas ou sugestões:',
    otherApps: 'Outros apps da HSI',
  },
  policy: (app, t) => ({
    title: `Política de privacidade do app ${app.name}`,
    intro: (
      <>
        Esta política explica como o app <strong>{app.name}</strong> (Android, pacote <code>{app.packageId}</code>) trata as
        suas informações. O app é desenvolvido pela {company.name} ({company.shortName}), CNPJ {company.cnpj}, com sede em {company.city} – {company.state}, que é a controladora dos dados nos termos da Lei Geral de
        Proteção de Dados (LGPD, Lei 13.709/2018).
      </>
    ),
    sections: [
      {
        title: '1. Resumo',
        body: (
          <ul>
            <li>O app não tem cadastro nem login.</li>
            <li>
              Os dados que você digita ou que o app gera ficam <strong>só no seu celular</strong>. A HSI não tem servidor que
              receba esses dados e não os vende nem compartilha.
            </li>
            <li>O app exibe anúncios do Google AdMob, que coleta alguns dados do aparelho, como explicado no item 4.</li>
          </ul>
        ),
      },
      {
        title: '2. Dados guardados no seu aparelho',
        body: (
          <>
            <ul>
              {t.privacy.onDevice.map(d => (
                <li key={d}>{d}</li>
              ))}
            </ul>
            <p>
              Esses dados ficam no armazenamento interno do app. Se o backup automático do Android estiver ativado na sua conta
              Google, eles podem entrar no backup do aparelho, que é gerenciado pelo Google e não pela HSI.
            </p>
          </>
        ),
      },
      {
        title: '3. Permissões do aparelho',
        body: (
          <>
            <ul>
              {t.privacy.permissions.map(p => (
                <li key={p.name}>
                  <strong>{p.name}:</strong> {p.why}
                </li>
              ))}
            </ul>
            <p>Você pode negar ou revogar as permissões nas configurações do Android a qualquer momento.</p>
          </>
        ),
      },
      {
        title: '4. Serviços de terceiros',
        body: (
          <>
            <p>O app usa os serviços abaixo. Cada um tem a sua própria política de privacidade:</p>
            <ul>
              {t.privacy.thirdParties.map(tp => (
                <li key={tp.name}>
                  <strong>{tp.name}:</strong> {tp.what}{' '}
                  <a href={tp.policyUrl} rel="noopener">
                    Política do serviço
                  </a>
                  .
                </li>
              ))}
            </ul>
            <p>
              Você pode redefinir ou excluir o ID de publicidade do aparelho em <em>Configurações → Google → Anúncios</em> (o
              caminho pode variar conforme o fabricante).
            </p>
          </>
        ),
      },
      {
        title: '5. Como apagar os seus dados',
        body: (
          <p>
            Como os dados ficam só no aparelho, você mesmo pode apagá-los: em{' '}
            <em>Configurações → Apps → {app.name} → Armazenamento → Limpar dados</em>, ou desinstalando o app. A HSI não guarda
            cópia.
          </p>
        ),
      },
      {
        title: '6. Crianças',
        body: <p>O app não é direcionado a crianças menores de 13 anos e não coleta intencionalmente dados pessoais delas.</p>,
      },
      {
        title: '7. Seus direitos (LGPD)',
        body: (
          <p>
            Você pode pedir confirmação de tratamento, acesso, correção, exclusão e informações sobre compartilhamento dos seus
            dados. Como a HSI não recebe dados dos usuários, na maioria dos casos não há o que acessar ou excluir do nosso lado,
            mas responderemos a qualquer pedido pelo e-mail {mail}.
          </p>
        ),
      },
      {
        title: '8. Mudanças nesta política',
        body: (
          <p>
            Se esta política mudar, a nova versão será publicada nesta página com a data de atualização. Mudanças relevantes
            também serão informadas no app ou na página dele na Google Play.
          </p>
        ),
      },
      {
        title: '9. Contato',
        body: (
          <p>
            {company.name} ({company.shortName}) · CNPJ {company.cnpj}
            <br />
            E-mail: {mail}
          </p>
        ),
      },
    ],
  }),
  seo: {
    homeTitle: `HSI – Software, sites e apps sob encomenda | ${company.city}`,
    homeDescription:
      `Help Soluções em Informática (HSI), desde ${company.foundingYear} em ${company.city}–${company.state}: software sob encomenda, ` +
      'sites, apps, integrações e consultoria em TI.',
    homeKeywords:
      'desenvolvimento de software, software sob encomenda, criação de sites, desenvolvimento de apps, consultoria em TI, ' +
      `integração de sistemas, ${company.city}, HSI, Help Soluções em Informática`,
    appTitle: (app, t) => `${t.seoTitle ?? `${app.name} – ${t.categoryLabel} para Android`} | ${company.shortName}`,
    appDescription: (_app, t) => `${t.tagline} App gratuito para Android, sem cadastro, da ${company.name}.`,
    privacyTitle: app => `Política de privacidade do ${app.name} | ${company.shortName}`,
    privacyDescription: app =>
      `Política de privacidade do app ${app.name} (Android): dados usados, permissões, anúncios e como apagar seus dados.`,
    crumbHome: 'Início',
    crumbPrivacy: 'Política de privacidade',
  },
}
