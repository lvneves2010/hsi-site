// Self-hosted font (no render-blocking request to Google Fonts)
import '@fontsource-variable/inter/wght.css'
import './index.css'

// Production pages are fully static (prerendered by scripts/prerender.mjs) and have no
// interactivity, so they ship no React. Only the dev server renders on the client.
if (import.meta.env.DEV) {
  const root = document.getElementById('root')!
  if (!root.hasChildNodes()) {
    Promise.all([import('react-dom/client'), import('./App')]).then(([{ createRoot }, { default: App }]) =>
      createRoot(root).render(<App path={window.location.pathname} />),
    )
  }
}
