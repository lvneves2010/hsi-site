# CLAUDE.md

Site da **Help Soluções em Informática (HSI)**, a empresa de Leonardo Neves (LEONARDO VINICIUS NEVES LTDA, CNPJ 31.412.990/0001-07). Apresenta os **serviços** da empresa (software sob encomenda, sites, apps, integrações/ERP, cloud, IA, consultoria, suporte e treinamento), os **apps Android próprios** e hospeda a **política de privacidade de cada app** (URL exigida pela Google Play). O site não deve parecer só de apps: os serviços vêm primeiro. Vite + React 19 + TypeScript, pré-renderizado em HTML estático e publicado no Firebase Hosting. Mesmo esquema do `leoneves-site` (pasta irmã), que é o portfólio pessoal; os dois sites têm links um para o outro.

- Produção: https://hsi-help-solucoes.web.app
- Firebase: projeto `hsi-help-solucoes` (plano Spark, gratuito), conta lvneves2010@gmail.com. O ID `helpsolucoes` já estava tomado.
- Só português, por enquanto.

## Comandos

```bash
npm run dev       # dev server (http://localhost:5173), renderiza só no cliente
npm run build     # tsc + build do cliente + build SSR + scripts/prerender.mjs → dist/
npm run preview   # serve dist/
npm run lint      # ESLint
npm run images    # regera as imagens de public/ a partir do logo e dos ícones dos apps (Python + Pillow)
npm run deploy    # build + firebase deploy --only hosting
```

Antes de publicar: `npm run build` e `npx eslint .` sem erros. Depois, confira o site no ar.

## Onde fica cada coisa

| Arquivo | Conteúdo |
| --- | --- |
| `src/data/site.ts` | **Todo o conteúdo**: dados da empresa (`company`), serviços (`services`) e um item por app (`apps`), com textos, recursos e dados da política de privacidade |
| `src/Icons.tsx` | Ícones SVG inline dos serviços |
| `src/routes.ts` | Lista de páginas: `/`, `/apps/<slug>/` e `/apps/<slug>/privacidade/` |
| `src/App.tsx` | Componentes de todas as páginas (home, página do app, política de privacidade) |
| `src/entry-server.tsx` | `render(path)` e `head(path)`: título, descrição e JSON-LD (`Organization`, `MobileApplication`, `BreadcrumbList`) |
| `scripts/prerender.mjs` | Gera um `index.html` por rota, o `sitemap.xml` e o `robots.txt` |
| `scripts/gerar_imagens.py` | Gera logo, favicon, ícones dos apps e `og-image.jpg` a partir das pastas dos apps |
| `public/` | Imagens, favicon e `404.html` |

## Regras

- **Dados da empresa** vêm do cadastro público do CNPJ (início de atividade 03/09/2018; CNAE principal 6201-5/01 software sob encomenda; secundários: consultoria em TI, suporte/manutenção e treinamento em informática). Os serviços seguem esses CNAEs e o currículo do Leonardo (`../leoneves-site`). A consultoria própria de 2013–2018 aparece no currículo como "Symcon Group / HSI".
- Empresas como IBM, Sony, Bradesco e Jadlog aparecem só como **carreira do fundador**, nunca como clientes da HSI.

- **Em produção as páginas não carregam React**: são HTML estático e não há nenhuma interatividade. `src/main.tsx` só importa CSS e fonte; o React roda no cliente apenas no `npm run dev`. Se um dia precisar de interatividade, use `hydrateRoot` como no `leoneves-site`.
- Tema claro/escuro segue o sistema (`prefers-color-scheme`), só com CSS.
- **Novo app:** adicione o item em `apps` (`site.ts`), coloque o caminho do ícone em `APPS` no `gerar_imagens.py` e rode `npm run images`. Rotas, sitemap e rodapé saem sozinhos.
- **App publicado na Play:** mude `published` para `true`. O botão "Em breve" vira o link da Play e o JSON-LD ganha `installUrl`.
- **Mudou o conteúdo ou uma política:** atualize `lastUpdated` e `lastUpdatedLabel` em `company`. A data aparece nas políticas e vai para o `<lastmod>` do sitemap.
- **A política de privacidade precisa bater com o app.** Se um app ganhar permissão, SDK ou serviço novo (ex.: o proxy da IA do K.I.R.A.), atualize `privacy` dele e o formulário "Segurança dos dados" da Play.
- **Google Search Console:** o token da metatag vai em `company.googleSiteVerification`.
- **app-ads.txt:** quando a conta AdMob existir, crie `public/app-ads.txt` com a linha `google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0` (com o ID de editor real) e publique.
- O FestaSim (`com.leo.festasim`) fica de fora: foi substituído pelo PlanEvento.
- Comentários de código em inglês; conteúdo e documentação em português.

## Git

- O git **global** desta máquina usa o e-mail da Jadlog. Este repo tem `user.email = lvneves2010@gmail.com` na config local; confira com `git config user.email` antes de commitar.
