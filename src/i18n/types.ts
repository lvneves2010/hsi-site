import type { ReactNode } from 'react'
import type { AppInfo, AppSlug, ServiceKey } from '../data/site'

export type Lang = 'pt' | 'en'

export type ThirdParty = { name: string; what: string; policyUrl: string }

export type AppText = {
  categoryLabel: string
  tagline: string
  description: string[]
  features: string[]
  keywords: string
  privacy: {
    /** What the app stores, always only on the device. */
    onDevice: string[]
    permissions: { name: string; why: string }[]
    thirdParties: ThirdParty[]
  }
}

export type PolicySection = { title: string; body: ReactNode }

/** Everything the site shows in one language. The TypeScript type keeps PT and EN in sync. */
export interface Content {
  lang: Lang
  htmlLang: string
  ogLocale: string
  dateLabel: (isoDate: string) => string
  nav: { services: string; process: string; apps: string; about: string; contact: string }
  ui: {
    skip: string
    menu: string
    toggleTheme: string
    otherLang: string // label of the language switch (the other language)
    otherLangName: string
    home: string
    seeDetails: string
    soon: string
    download: string
    breadcrumb: string
    logoAlt: string
    iconAlt: (app: string) => string
    notFound: string
    backHome: string
    quoteSubject: string
    supportSubject: (app: string) => string
    footerAbout: string
    footerPolicies: string
    footerContact: string
    founderLine: string
    since: string
  }
  home: {
    eyebrow: string
    lead: string
    ctaPrimary: string
    ctaSecondary: string
    heroBadge: string
    stats: { value: string; label: string }[]
    servicesTitle: string
    servicesIntro: string
    processTitle: string
    processIntro: string
    process: { title: string; text: string }[]
    appsTitle: string
    appsIntro: string
    aboutTitle: string
    about: ReactNode[]
    founderRole: string
    founderLink: string
    ctaTitle: string
    ctaText: string
    ctaButton: string
    contactTitle: string
    contact: ReactNode[]
  }
  services: Record<ServiceKey, { title: string; text: string; tech: string[] }>
  apps: Record<AppSlug, AppText>
  appPage: {
    whatItDoes: string
    privacyTitle: string
    privacyItems: string[]
    readPolicy: (app: string) => string
    supportTitle: string
    supportText: string
    otherApps: string
  }
  policy: (app: AppInfo, t: AppText) => { title: string; intro: ReactNode; sections: PolicySection[] }
  seo: {
    homeTitle: string
    homeDescription: string
    homeKeywords: string
    appTitle: (app: AppInfo, t: AppText) => string
    appDescription: (app: AppInfo, t: AppText) => string
    privacyTitle: (app: AppInfo) => string
    privacyDescription: (app: AppInfo) => string
    crumbHome: string
    crumbPrivacy: string
  }
}
