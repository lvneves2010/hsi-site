import { company } from '../data/site'
import type { Content, ThirdParty } from './types'

const admob: ThirdParty = {
  name: 'Google AdMob (ads)',
  what:
    'To show ads, the Google AdMob SDK may collect the device advertising ID, IP address, technical device information ' +
    'and interactions with ads. On first launch, where the law requires it, the app asks for your consent to personalized ' +
    'ads; you can review that choice under "Ad privacy" in the app.',
  policyUrl: 'https://policies.google.com/technologies/partner-sites',
}

const internetAdsOnly = { name: 'Internet', why: 'Used only to load ads.' }
const mail = <a href={`mailto:${company.email}`}>{company.email}</a>

export const en: Content = {
  lang: 'en',
  htmlLang: 'en',
  ogLocale: 'en_US',
  dateLabel: iso =>
    new Date(`${iso}T12:00:00Z`).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' }),
  nav: { services: 'Services', process: 'How we work', apps: 'Apps', about: 'About', contact: 'Contact' },
  ui: {
    skip: 'Skip to content',
    menu: 'Menu',
    toggleTheme: 'Toggle light/dark theme',
    langName: 'English',
    home: 'Home',
    seeDetails: 'See details',
    soon: 'Coming soon to Google Play',
    download: 'Get it on Google Play',
    breadcrumb: 'You are here',
    logoAlt: 'HSI logo',
    iconAlt: app => `${app} app icon`,
    notFound: 'Page not found',
    backHome: 'Back to home',
    quoteSubject: 'Project quote',
    supportSubject: app => `${app} support`,
    footerAbout: 'Custom software, websites, apps and IT consulting.',
    footerPolicies: 'Privacy policies',
    footerContact: 'Contact',
    founderLine: 'Founded by',
    since: 'Since',
  },
  home: {
    eyebrow: `Since ${company.foundingYear} · ${company.city}, Brazil`,
    lead:
      'We build custom software, websites, mobile apps and integrations, and provide IT consulting, backed by our ' +
      "founder's 20+ years in technology.",
    ctaPrimary: 'Request a quote',
    ctaSecondary: 'Our services',
    heroBadge: 'From code to launch',
    stats: [
      { value: company.foundingYear, label: 'company founded' },
      { value: '20+', label: "years of the founder's experience" },
      { value: '20+', label: 'companies served in Brazil and Latin America' },
      { value: '4', label: 'own Android apps' },
    ],
    servicesTitle: 'What we do',
    servicesIntro: 'From tailor-made systems to apps on the store: we take the whole project or just the part you need.',
    processTitle: 'How we work',
    processIntro: 'A simple process, with you following every step.',
    process: [
      { title: 'Conversation', text: 'We understand the problem, the audience and what exists today.' },
      { title: 'Proposal', text: 'Clear scope, timeline and price before we start.' },
      { title: 'Development', text: 'Short, frequent deliveries so you see results early.' },
      { title: 'Launch and support', text: 'Release, team training and maintenance after launch.' },
    ],
    appsTitle: 'Our own apps',
    appsIntro: 'Besides client projects, HSI develops and publishes its own Android apps (in Portuguese).',
    aboutTitle: 'About HSI',
    about: [
      <>
        {company.name} ({company.shortName}) is a technology company based in {company.city}, São Paulo, Brazil, founded in{' '}
        {company.foundingYear}. It formalized the consulting business our founder had run since 2013, which built web
        applications for more than 20 companies in Brazil, Argentina, Peru and Colombia.
      </>,
      <>
        Our founder, {company.founder}, is a senior software engineer with 20+ years in technology and experience at
        companies such as IBM, Sony, Bradesco and Jadlog. He works with full-stack development, software architecture,
        systems integration, ERP, DevOps and AI-assisted development.
      </>,
      <>
        Our own apps follow one simple rule: do one thing well, with no sign-up and, whenever possible, with your data kept
        only on your phone.
      </>,
    ],
    founderRole: 'Founder · Senior Software Engineer',
    founderLink: 'Learn more',
    ctaTitle: "Let's get your project off the ground?",
    ctaText: "Tell us what you need. We'll reply with a no-strings proposal.",
    ctaButton: 'Talk to HSI',
    contactTitle: 'Contact',
    contact: [
      <>
        <strong>Have a project?</strong> Email {mail} and tell us what you need.
      </>,
      <>
        <strong>Using one of our apps?</strong> For support, suggestions or requests about your data, write to the same
        address and tell us which app you use.
      </>,
    ],
  },
  services: {
    code: {
      title: 'Custom software',
      text: 'Web systems and APIs tailored to your business, from requirements to production.',
      tech: ['C#/.NET', 'Java', 'TypeScript', 'Node.js', 'Python'],
    },
    web: {
      title: 'Websites and web apps',
      text: 'Company websites, portfolios and web applications that are fast, responsive and ready to rank on Google.',
      tech: ['React', 'Angular', 'Vue', 'SEO'],
    },
    mobile: {
      title: 'Mobile apps',
      text: 'Android and iOS apps, from idea to store release, with the same care we put into our own apps.',
      tech: ['Ionic', 'Capacitor', 'Flutter', 'React Native'],
    },
    integration: {
      title: 'Integrations and ERP',
      text: 'Systems integration through APIs and customization of ERP and enterprise platforms.',
      tech: ['REST', 'Infor LN', 'Salesforce', 'ServiceNow'],
    },
    cloud: {
      title: 'Cloud and DevOps',
      text: 'Hosting, infrastructure automation and continuous delivery, so you ship safely and without surprises.',
      tech: ['Docker', 'Terraform', 'CI/CD', 'AWS · GCP · Firebase'],
    },
    ai: {
      title: 'Artificial intelligence',
      text: 'Chatbots, assistants and natural-language data queries, integrated with your systems.',
      tech: ['LLMs', 'NLP', 'Watson', 'Gemini'],
    },
    consulting: {
      title: 'IT consulting',
      text: 'Software architecture, technology choices, code review and project planning.',
      tech: ['Architecture', 'Scrum', 'ITIL'],
    },
    support: {
      title: 'Support, maintenance and training',
      text: 'Maintenance of existing systems, technical support and computer training for teams.',
      tech: ['Maintenance', 'Support', 'Training'],
    },
  },
  apps: {
    planevento: {
      categoryLabel: 'Event planning',
      tagline: 'Plan parties and events: guests, tasks and budget in one place.',
      description: [
        'PlanEvento helps you plan birthdays, weddings, showers and any other event. Add your guests, build the task ' +
          'schedule and track how much you have spent in each category.',
        'No account needed: everything is saved on your phone and the app works offline.',
      ],
      features: [
        'Several events in the same app, with a dashboard to switch between them',
        'Guest list',
        'Task schedule with progress status',
        'Budget by category: planned and spent',
        'No sign-up or login; data stays on the device',
      ],
      keywords: 'event planner, party planner, guest list, party budget, event app',
      privacy: {
        onDevice: ['Events, guests (name and, if you want, email), tasks and budget entries you add.'],
        permissions: [internetAdsOnly],
        thirdParties: [admob],
      },
    },
    'marcador-de-jogos': {
      categoryLabel: 'Card game scorekeeper',
      tagline: 'Scoreboard for truco, dominoes and buraco on your phone.',
      description: [
        'No more pen and paper at the table: Marcador de Jogos keeps the score of truco, dominoes and buraco with a tap.',
        'The score is saved on your phone, so you can close the app and continue the game later.',
      ],
      features: [
        'Truco: us versus them, up to 12 points',
        'Dominoes: 2 to 4 players, with names, adjustable target and undo',
        'Buraco: round-by-round entries and a configurable target (3,000 points by default)',
        'Score saved automatically',
        'No sign-up or login',
      ],
      keywords: 'truco score, truco scoreboard, dominoes score, buraco score, score counter',
      seoTitle: 'Marcador de Jogos – Truco and dominoes scorekeeper',
      privacy: {
        onDevice: ['Game scores and the names of domino players.'],
        permissions: [internetAdsOnly],
        thirdParties: [admob],
      },
    },
    kira: {
      categoryLabel: 'Voice assistant',
      tagline: 'Voice assistant: say a command and KIRA answers.',
      description: [
        'KIRA is a voice assistant in Portuguese. You speak and she answers out loud: quick commands, weather forecast, ' +
          'flashlight and open questions to an artificial intelligence.',
        'To ask the AI, start the sentence with "Kira". Answers can be saved to a text file on your phone.',
      ],
      features: [
        'Voice commands in Portuguese, with spoken answers',
        'Open questions to artificial intelligence (start the sentence with "Kira")',
        'Weather forecast for where you are',
        'Turns the flashlight on and off',
        'Saves the answer to a text file',
      ],
      keywords: 'voice assistant, virtual assistant, voice command, artificial intelligence, Portuguese voice app',
      privacy: {
        onDevice: ['App preferences and the answers you choose to save to a file (Documents folder on the device).'],
        permissions: [
          { name: 'Microphone', why: 'To hear your command while the app is listening. The app does not record or keep audio.' },
          { name: 'Location', why: 'Only when you ask for the weather forecast, to know where to look it up. Never used in the background.' },
          { name: 'Internet', why: 'For the weather forecast, AI questions and ads.' },
        ],
        thirdParties: [
          {
            name: 'Google speech recognition (Android)',
            what: "Speech is transcribed by the Android system's speech recognition service (Google), which receives the command audio to convert it to text.",
            policyUrl: 'https://policies.google.com/privacy',
          },
          {
            name: 'Google Gemini (artificial intelligence)',
            what:
              'When the sentence starts with "Kira", the text of the question is sent to Google Gemini to generate the answer. ' +
              'Do not include personal or sensitive data in your questions.',
            policyUrl: 'https://policies.google.com/privacy',
          },
          {
            name: 'Open-Meteo (weather forecast)',
            what: 'When you ask for the weather forecast, your location coordinates are sent to Open-Meteo to fetch the forecast.',
            policyUrl: 'https://open-meteo.com/en/terms',
          },
          admob,
        ],
      },
    },
    'my-spot': {
      categoryLabel: 'Where did I park',
      tagline: 'Mark where you parked and walk back to your car following an arrow.',
      description: [
        'Parked at a mall, a stadium or on a street you do not know? Tap a button and My Spot saves the spot using GPS.',
        'On the way back, an arrow points to the car and shows the distance. You can also open the walking route in Google Maps.',
      ],
      features: [
        'Marks the spot with one tap, using the most accurate GPS reading',
        'Arrow and distance to the car, with a notice when you arrive',
        'Notes about the spot (floor, number, pillar color)',
        'Shows how long the car has been parked',
        'Walking route in Google Maps',
        'No sign-up or login; the spot stays on your phone',
      ],
      keywords: 'where did I park, find my car, car locator, parking spot, parking reminder',
      privacy: {
        onDevice: ['The last marked spot: coordinates, GPS accuracy, date and time and the note you write.'],
        permissions: [
          { name: 'Location', why: 'To mark the spot and guide you back. Used only while the app is open, never in the background.' },
          internetAdsOnly,
        ],
        thirdParties: [
          {
            name: 'Google Maps',
            what: 'Only if you tap "Walking route in Google Maps": the spot coordinates are opened in the Google Maps app or website.',
            policyUrl: 'https://policies.google.com/privacy',
          },
          admob,
        ],
      },
    },
  },
  appPage: {
    whatItDoes: 'What it does',
    privacyTitle: 'Privacy at a glance',
    privacyItems: [
      'No sign-up or login.',
      'Your data is saved only on your phone; HSI does not receive or store it.',
      'The app shows Google AdMob ads.',
    ],
    readPolicy: app => `Read the full privacy policy of ${app}`,
    supportTitle: 'Support',
    supportText: 'Questions, problems or suggestions:',
    otherApps: 'Other HSI apps',
  },
  policy: (app, t) => ({
    title: `${app.name} privacy policy`,
    intro: (
      <>
        This policy explains how the <strong>{app.name}</strong> app (Android, package <code>{app.packageId}</code>) handles
        your information. The app is developed by {company.name} ({company.shortName}), Brazilian company registration
        (CNPJ) {company.cnpj}, based in {company.city}, São Paulo, Brazil, which is the data
        controller under the Brazilian General Data Protection Law (LGPD, Law 13,709/2018).
      </>
    ),
    sections: [
      {
        title: '1. Summary',
        body: (
          <ul>
            <li>The app has no sign-up or login.</li>
            <li>
              The data you enter or the app creates stays <strong>only on your phone</strong>. HSI has no server that receives
              this data and does not sell or share it.
            </li>
            <li>The app shows Google AdMob ads, which collect some device data, as explained in section 4.</li>
          </ul>
        ),
      },
      {
        title: '2. Data stored on your device',
        body: (
          <>
            <ul>
              {t.privacy.onDevice.map(d => (
                <li key={d}>{d}</li>
              ))}
            </ul>
            <p>
              This data stays in the app's internal storage. If Android automatic backup is enabled for your Google account, it
              may be included in the device backup, which is managed by Google, not by HSI.
            </p>
          </>
        ),
      },
      {
        title: '3. Device permissions',
        body: (
          <>
            <ul>
              {t.privacy.permissions.map(p => (
                <li key={p.name}>
                  <strong>{p.name}:</strong> {p.why}
                </li>
              ))}
            </ul>
            <p>You can deny or revoke permissions in the Android settings at any time.</p>
          </>
        ),
      },
      {
        title: '4. Third-party services',
        body: (
          <>
            <p>The app uses the services below. Each one has its own privacy policy:</p>
            <ul>
              {t.privacy.thirdParties.map(tp => (
                <li key={tp.name}>
                  <strong>{tp.name}:</strong> {tp.what}{' '}
                  <a href={tp.policyUrl} rel="noopener">
                    Service policy
                  </a>
                  .
                </li>
              ))}
            </ul>
            <p>
              You can reset or delete the device advertising ID under <em>Settings → Google → Ads</em> (the path may vary by
              manufacturer).
            </p>
          </>
        ),
      },
      {
        title: '5. How to delete your data',
        body: (
          <p>
            Since the data stays on the device, you can delete it yourself: go to{' '}
            <em>Settings → Apps → {app.name} → Storage → Clear data</em>, or uninstall the app. HSI keeps no copy.
          </p>
        ),
      },
      {
        title: '6. Children',
        body: <p>The app is not directed to children under 13 and does not knowingly collect their personal data.</p>,
      },
      {
        title: '7. Your rights',
        body: (
          <p>
            You may request confirmation of processing, access, correction, deletion and information about sharing of your
            data. Since HSI does not receive user data, in most cases there is nothing to access or delete on our side, but we
            will answer any request sent to {mail}.
          </p>
        ),
      },
      {
        title: '8. Changes to this policy',
        body: (
          <p>
            If this policy changes, the new version will be published on this page with its update date. Relevant changes will
            also be announced in the app or on its Google Play page.
          </p>
        ),
      },
      {
        title: '9. Contact',
        body: (
          <p>
            {company.name} ({company.shortName}) · CNPJ {company.cnpj}
            <br />
            Email: {mail}
          </p>
        ),
      },
    ],
  }),
  seo: {
    homeTitle: 'HSI – Custom software, websites and apps | Brazil',
    homeDescription:
      `Help Soluções em Informática (HSI), since ${company.foundingYear} in ${company.city}, Brazil: custom software, websites, ` +
      'mobile apps, integrations and IT consulting.',
    homeKeywords:
      'software development, custom software, website development, app development, IT consulting, systems integration, ' +
      'Brazil, nearshore, HSI, Help Soluções em Informática',
    appTitle: (app, t) => `${t.seoTitle ?? `${app.name} – ${t.categoryLabel} app for Android`} | ${company.shortName}`,
    appDescription: (_app, t) => `${t.tagline} Free Android app, no sign-up, by ${company.name}.`,
    privacyTitle: app => `${app.name} privacy policy | ${company.shortName}`,
    privacyDescription: app =>
      `Privacy policy of the ${app.name} Android app: data used, permissions, ads and how to delete your data.`,
    crumbHome: 'Home',
    crumbPrivacy: 'Privacy policy',
  },
}
