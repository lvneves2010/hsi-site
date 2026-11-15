// Self-hosted font (no render-blocking request to Google Fonts)
import '@fontsource-variable/inter/wght.css'
import './index.css'

// Production pages are static HTML (prerendered by scripts/prerender.mjs) and ship no React.
// This file only wires the small interactive bits with plain DOM code.
function enhance() {
  // Theme toggle (the initial theme is applied by the inline script in index.html).
  for (const btn of document.querySelectorAll<HTMLButtonElement>('[data-theme-toggle]')) {
    btn.addEventListener('click', () => {
      const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'
      document.documentElement.dataset.theme = next
      try {
        localStorage.setItem('theme', next)
      } catch {
        // storage blocked: the choice lasts until the page is reloaded
      }
    })
  }

  // Close the mobile menu after choosing a link or clicking outside it.
  const menu = document.querySelector<HTMLDetailsElement>('.mobile-menu')
  if (menu) {
    menu.addEventListener('click', e => {
      if ((e.target as HTMLElement).closest('a')) menu.open = false
    })
    document.addEventListener('click', e => {
      if (menu.open && !menu.contains(e.target as Node)) menu.open = false
    })
  }

  // Fade elements in as they scroll into view.
  const items = document.querySelectorAll('.reveal')
  if (!('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) {
    items.forEach(el => el.classList.add('shown'))
    return
  }
  const io = new IntersectionObserver(
    entries => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add('shown')
          io.unobserve(e.target)
        }
      }
    },
    { rootMargin: '0px 0px -40px 0px' },
  )
  items.forEach(el => io.observe(el))
}

const root = document.getElementById('root')!
if (import.meta.env.DEV && !root.hasChildNodes()) {
  // Dev server: no prerendered HTML, so render on the client first.
  Promise.all([import('react-dom/client'), import('react-dom'), import('./App')]).then(([{ createRoot }, { flushSync }, { default: App }]) => {
    flushSync(() => createRoot(root).render(<App path={window.location.pathname} />))
    enhance()
  })
} else {
  enhance()
}
