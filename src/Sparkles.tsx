// Small twinkling four-point stars behind a section (same idea as the founder's portfolio site).

// Deterministic pseudo-random sequence (mulberry32): the prerendered HTML is always the same.
function seeded(seed: string) {
  let a = [...seed].reduce((h, c) => Math.imul(h ^ c.charCodeAt(0), 2654435761), 1)
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function Sparkles({ seed, count = 12 }: { seed: string; count?: number }) {
  const rand = seeded(seed)
  // Most sparkles go in the side margins, where cards don't cover them; a few near the heading.
  const items = Array.from({ length: count }, (_, i) => ({
    left: i % 4 === 3 ? 20 + rand() * 60 : i % 2 ? 1 + rand() * 7 : 92 + rand() * 7,
    top: i % 4 === 3 ? 2 + rand() * 8 : 4 + rand() * 92,
    size: 8 + rand() * 12,
    delay: rand() * 6,
    duration: 3 + rand() * 4,
  }))
  return (
    <div className="sparkles" aria-hidden="true">
      {items.map((s, i) => (
        <svg
          key={i}
          className="sparkle"
          viewBox="0 0 24 24"
          style={{
            left: `${s.left.toFixed(2)}%`,
            top: `${s.top.toFixed(2)}%`,
            width: `${s.size.toFixed(1)}px`,
            height: `${s.size.toFixed(1)}px`,
            animationDelay: `${s.delay.toFixed(2)}s`,
            animationDuration: `${s.duration.toFixed(2)}s`,
          }}
        >
          <path d="M12 0C12.9 7.6 16.4 11.1 24 12 16.4 12.9 12.9 16.4 12 24 11.1 16.4 7.6 12.9 0 12 7.6 11.1 11.1 7.6 12 0Z" />
        </svg>
      ))}
    </div>
  )
}
