# CLAUDE.md

Site da **Help Soluções em Informática (HSI)**, a empresa de Leonardo Neves (CNPJ 31.412.990/0001-07). Apresenta os **serviços** da empresa (software sob encomenda, sites, apps, integrações/ERP, cloud, IA, consultoria, suporte e treinamento), os **apps Android próprios** e hospeda a **política de privacidade de cada app** (URL exigida pela Google Play). O site não deve parecer só de apps: os serviços vêm primeiro. Vite + React 19 + TypeScript, pré-renderizado em HTML estático e publicado no Firebase Hosting. Mesmo esquema do `leoneves-site` (pasta irmã), que é o portfólio pessoal; os dois sites têm links um para o outro.

- Produção: https://hsi-help-solucoes.web.app
- Repositório: https://github.com/lvneves2010/hsi-site (público). O push usa a conta pessoal: remote `https://lvneves2010@github.com/...`.
- Firebase: projeto `hsi-help-solucoes` (plano Spark, gratuito), conta lvneves2010@gmail.com. O ID `helpsolucoes` já estava tomado.
- Bilíngue: PT em `/` (`/apps/<slug>/`, `/apps/<slug>/privacidade/`) e EN em `/en/` (`/en/apps/<slug>/`, `/en/apps/<slug>/privacy/`), com `hreflang` e sitemap com alternates.

## Comandos

```bash
npm run dev       # dev server (http://localhost:5173), renderiza só no cliente
npm run build     # tsc + build do cliente + build SSR + scripts/prerender.mjs → dist/
npm run preview   # serve dist/
npm run lint      # ESLint
npm run logo      # redesenha public/logo-hsi.svg (Python + fontTools)
npm run images    # gera PNGs do logo (Edge headless), ícones dos apps, fotos e og-image PT/EN (Python + Pillow)
npm run deploy    # build + firebase deploy --only hosting
```

Antes de publicar: `npm run build` e `npx eslint .` sem erros. Depois, confira o site no ar.

## Onde fica cada coisa

| Arquivo | Conteúdo |
| --- | --- |
| `src/data/site.ts` | Dados sem idioma: empresa (`company`), ordem dos serviços (`serviceKeys`) e apps (`apps`: slug, pacote, publicado) |
| `src/i18n/pt.tsx` / `en.tsx` | **Todo o texto** em cada idioma: home, serviços, apps, política de privacidade, SEO. O tipo `Content` (`types.ts`) obriga os dois a andarem juntos |
| `src/routes.ts` | Lista de páginas nos dois idiomas; `pathIn()` dá a mesma página no outro idioma |
| `src/App.tsx` | Componentes de todas as páginas (home, página do app, política de privacidade) |
| `src/entry-server.tsx` | `render(path)` e `head(path)`: título, descrição e JSON-LD (`Organization`, `MobileApplication`, `BreadcrumbList`) |
| `scripts/prerender.mjs` | Gera um `index.html` por rota, o `sitemap.xml` e o `robots.txt` |
| `scripts/gerar_logo.py` | Desenha o logo em vetor (`public/logo-hsi.svg`) |
| `scripts/gerar_imagens.py` | PNGs do logo, ícones dos apps, fotos (cache em `scripts/.cache/`, fora do git) e `og-image*.jpg` |
| `src/main.tsx` | Só JS simples: botão de tema, menu do celular e animação ao rolar. Sem React em produção |
| `public/` | Imagens, favicon e `404.html` |

## Regras

- **Dados da empresa** vêm do cadastro público do CNPJ (início de atividade 03/09/2018; CNAE principal 6201-5/01 software sob encomenda; secundários: consultoria em TI, suporte/manutenção e treinamento em informática). Os serviços seguem esses CNAEs e o currículo do Leonardo (`../leoneves-site`). A consultoria própria de 2013–2018 aparece no currículo como "Symcon Group / HSI".
- **A razão social não aparece no site** (pedido do Leonardo): só o nome fantasia e o CNPJ, discreto no rodapé e nas políticas.
- Empresas como IBM, Sony, Bradesco e Jadlog aparecem só como **carreira do fundador**, nunca como clientes da HSI.

- **Em produção as páginas não carregam React**: são HTML estático e não há nenhuma interatividade. `src/main.tsx` só importa CSS e fonte; o React roda no cliente apenas no `npm run dev`. Se um dia precisar de interatividade, use `hydrateRoot` como no `leoneves-site`.
- **Tema claro por padrão**, mesmo com o navegador em modo escuro (pedido do Leonardo). O escuro só entra pelo botão do topo e fica salvo no `localStorage`; o script inline do `index.html` aplica antes do primeiro paint.
- **Logo:** `public/logo-hsi.svg` é a versão moderna do logo do cartão de visita, escolhida pelo Leonardo (variante `neg-d2`): esfera vermelha fatiada como uma laranja (corte curvo no topo **à esquerda** e a faixa central, paralelos, como no cartão) e "HSI" **vazado** na horizontal no fundo da fatia de baixo, em letras pequenas e espaçadas. `public/logo-hsi-mark.svg` é só a esfera, usada no favicon (o texto não se lê em 16–48 px). Geometria e variantes em `gerar_logo.py` (`--variants DIR` gera todas para comparar); texto em Inter convertido em contorno. Depois de mudar, rode `npm run logo && npm run images`. **Os apps ainda usam o logo antigo** (`logo_hsi.png` em cada app): trocar depois que o Leonardo aprovar no site.
- **Brilhos de fundo:** `src/Sparkles.tsx` (estrelinhas que piscam, posição fixa por seção, iguais no SSR) e a textura de pontos em `.section::after`, como no portfólio. Desligam a animação com `prefers-reduced-motion`.
- **Fotos:** só do Wikimedia Commons com licença **CC0 ou domínio público**; registre cada uma em `public/img/services/CREDITS.md`. Três vêm do `leoneves-site` (integração, cloud, IA).
- **Novo app:** adicione o item em `apps` (`site.ts`), os textos em `pt.tsx` e `en.tsx` (o TypeScript acusa o que faltar), o ícone em `APPS` no `gerar_imagens.py` e rode `npm run images`. Rotas, sitemap e rodapé saem sozinhos.
- **App publicado na Play:** mude `published` para `true`. O botão "Em breve" vira o link da Play e o JSON-LD ganha `installUrl`.
- **Mudou o conteúdo ou uma política:** atualize `lastUpdated` e `lastUpdatedLabel` em `company`. A data aparece nas políticas e vai para o `<lastmod>` do sitemap.
- **A política de privacidade precisa bater com o app.** Se um app ganhar permissão, SDK ou serviço novo (ex.: o proxy da IA do K.I.R.A.), atualize `privacy` dele **nos dois idiomas** e o formulário "Segurança dos dados" da Play.
- **Google Search Console:** o token da metatag vai em `company.googleSiteVerification`.
- **app-ads.txt:** quando a conta AdMob existir, crie `public/app-ads.txt` com a linha `google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0` (com o ID de editor real) e publique.
- O FestaSim (`com.leo.festasim`) fica de fora: foi substituído pelo PlanEvento.
- Comentários de código em inglês; conteúdo e documentação em português.

## Git

- O git **global** desta máquina usa o e-mail da Jadlog. Este repo tem `user.email = lvneves2010@gmail.com` na config local; confira com `git config user.email` antes de commitar.
