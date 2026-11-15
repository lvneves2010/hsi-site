// All site content lives here (company data and one entry per app).

export const company = {
  shortName: 'HSI',
  name: 'Help Soluções em Informática',
  legalName: 'LEONARDO VINICIUS NEVES LTDA',
  cnpj: '31.412.990/0001-07',
  city: 'Guarulhos',
  state: 'SP',
  // Public contact e-mail (support, privacy requests). Change here when the company e-mail exists.
  email: 'lvneves2010@gmail.com',
  founder: 'Leonardo Neves',
  founderUrl: 'https://leoneves-eng-de-software.web.app/',
  siteUrl: 'https://hsi-help-solucoes.web.app',
  // From the public CNPJ record (Receita Federal): activity start date.
  foundingDate: '2018-09-03',
  foundingYear: '2018',
  logo: '/img/logo-hsi-512.png',
  ogImage: '/img/og-image.jpg',
  // Google Search Console HTML-tag token (content="..."). Empty = no tag.
  googleSiteVerification: '',
  // Date shown on the privacy policies and used as <lastmod> in the sitemap. Update when content changes.
  lastUpdated: '2026-11-15',
  lastUpdatedLabel: '15 de novembro de 2026',
}

export type ServiceIcon = 'code' | 'web' | 'mobile' | 'plug' | 'cloud' | 'ai' | 'compass' | 'wrench'
export type Service = { icon: ServiceIcon; title: string; text: string; tech: string[] }

/** Services offered (CNAEs of the company + the founder's experience). */
export const services: Service[] = [
  {
    icon: 'code',
    title: 'Sistemas sob encomenda',
    text: 'Sistemas web e APIs feitos sob medida para o seu negócio, do levantamento de requisitos à produção.',
    tech: ['C#/.NET', 'Java', 'Node.js', 'Python'],
  },
  {
    icon: 'web',
    title: 'Sites e aplicações web',
    text: 'Sites institucionais, portfólios e aplicações web rápidas, responsivas e preparadas para aparecer no Google.',
    tech: ['React', 'Angular', 'Vue', 'SEO'],
  },
  {
    icon: 'mobile',
    title: 'Apps para celular',
    text: 'Apps Android e iOS, da ideia à publicação na loja, com a mesma experiência dos nossos apps próprios.',
    tech: ['Ionic', 'Capacitor', 'Flutter'],
  },
  {
    icon: 'plug',
    title: 'Integrações e ERP',
    text: 'Integração entre sistemas por APIs e customização de ERP e plataformas corporativas.',
    tech: ['REST', 'Infor LN', 'Salesforce', 'ServiceNow'],
  },
  {
    icon: 'cloud',
    title: 'Cloud e DevOps',
    text: 'Hospedagem, automação de infraestrutura e entrega contínua, para publicar com segurança e sem sustos.',
    tech: ['Docker', 'Terraform', 'CI/CD', 'AWS · GCP · Firebase'],
  },
  {
    icon: 'ai',
    title: 'Inteligência artificial',
    text: 'Chatbots, assistentes e consultas a dados em linguagem natural, integrados aos seus sistemas.',
    tech: ['LLMs', 'NLP', 'Watson', 'Gemini'],
  },
  {
    icon: 'compass',
    title: 'Consultoria em TI',
    text: 'Arquitetura de software, escolha de tecnologia, revisão de código e planejamento de projetos.',
    tech: ['Arquitetura', 'Scrum', 'ITIL'],
  },
  {
    icon: 'wrench',
    title: 'Suporte, manutenção e treinamento',
    text: 'Manutenção de sistemas existentes, suporte técnico e treinamento em informática para equipes.',
    tech: ['Manutenção', 'Suporte', 'Treinamento'],
  },
]

export type Permission ={ name: string; why: string }
export type ThirdParty = { name: string; what: string; policyUrl: string }

export type AppInfo = {
  slug: string
  name: string
  packageId: string
  /** false = "Em breve na Google Play"; true = links to the Play listing. */
  published: boolean
  category: string // schema.org applicationCategory
  categoryLabel: string
  tagline: string
  description: string[]
  features: string[]
  keywords: string
  privacy: {
    /** What the app stores, always only on the device. */
    onDevice: string[]
    permissions: Permission[]
    thirdParties: ThirdParty[]
    /** Extra notes specific to the app. */
    notes?: string[]
  }
}

const admob: ThirdParty = {
  name: 'Google AdMob (anúncios)',
  what:
    'Para exibir anúncios, o SDK do Google AdMob pode coletar o identificador de publicidade do aparelho, o endereço IP, ' +
    'informações técnicas do aparelho e interações com os anúncios. Na primeira abertura, quando a lei exige, o app pede o ' +
    'seu consentimento para anúncios personalizados; a escolha pode ser revista em "Privacidade dos anúncios", no próprio app.',
  policyUrl: 'https://policies.google.com/technologies/partner-sites',
}

export const apps: AppInfo[] = [
  {
    slug: 'planevento',
    name: 'PlanEvento',
    packageId: 'br.com.hsi.planevento',
    published: false,
    category: 'LifestyleApplication',
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
      permissions: [{ name: 'Internet', why: 'Usada apenas para carregar os anúncios.' }],
      thirdParties: [admob],
    },
  },
  {
    slug: 'marcador-de-jogos',
    name: 'Marcador de Jogos',
    packageId: 'br.com.hsi.marcadorjogos',
    published: false,
    category: 'GameApplication',
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
    privacy: {
      onDevice: ['Placar das partidas e nomes dos jogadores do dominó.'],
      permissions: [{ name: 'Internet', why: 'Usada apenas para carregar os anúncios.' }],
      thirdParties: [admob],
    },
  },
  {
    slug: 'kira',
    name: 'K.I.R.A.',
    packageId: 'br.com.hsi.kira',
    published: false,
    category: 'UtilitiesApplication',
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
        {
          name: 'Microfone',
          why: 'Para ouvir o seu comando enquanto o app está escutando. O app não grava nem guarda o áudio.',
        },
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
  {
    slug: 'my-spot',
    name: 'My Spot',
    packageId: 'br.com.hsi.myspot',
    published: false,
    category: 'TravelApplication',
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
    privacy: {
      onDevice: ['A última vaga marcada: coordenadas, precisão do GPS, data e hora e a anotação que você escrever.'],
      permissions: [
        {
          name: 'Localização',
          why: 'Para marcar a vaga e guiar você de volta. Só é usada com o app aberto, nunca em segundo plano.',
        },
        { name: 'Internet', why: 'Usada apenas para carregar os anúncios.' },
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
]

export const playUrl = (app: AppInfo) => `https://play.google.com/store/apps/details?id=${app.packageId}`
