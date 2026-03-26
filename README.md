# Portfolio — Miguel Angelo

> Flutter Mobile Developer · Vanilla HTML/CSS/JS · No frameworks

[![GitHub Pages](https://img.shields.io/badge/Live-GitHub%20Pages-0066cc?style=flat-square&logo=github)](https://miguel12342342.github.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)

---

## About

Personal portfolio built entirely with **pure HTML5, CSS3, and Vanilla JavaScript ES6+** — zero frameworks, zero build tools, zero dependencies beyond a CDN icon library and a particle engine.

The goal was to demonstrate that a polished, accessible, and performant experience doesn't require a framework.

---

## Features

| Feature | Implementation |
|---|---|
| Dark / Light mode | CSS custom properties + `localStorage` |
| PT / EN i18n | `data-i18n` attribute system + `localStorage` |
| Typewriter effect | Vanilla JS loop with configurable phrases |
| Skill bar animation | `transform: scaleX()` via `IntersectionObserver` (GPU composited, zero reflow) |
| Skill percent counter | Synchronized timer counting up alongside bar animation |
| Scroll parallax | `requestAnimationFrame`-throttled scroll handler |
| Scroll-spy navbar | `IntersectionObserver` with `rootMargin` center-detection |
| Scroll progress bar | Passive scroll listener → `width` percentage |
| Back to top button | Appears after 300px scroll, smooth `scrollTo()` |
| Available for Work badge | CSS `pulse-green` keyframe animation |
| Copy email to clipboard | `navigator.clipboard.writeText()` with `mailto:` fallback |
| Command Palette | `Ctrl/Cmd+K` → modal with filter + keyboard navigation |
| 3D card tilt | CSS `perspective` + `rotateX/Y` on `mousemove` |
| Magnetic cursor | `Element.animate()` with lag delay (desktop only) |
| Contact form | Formspree `fetch` POST with success/error feedback |
| Particle background | tsParticles (disabled on mobile ≤ 640px) |
| Fade-in-up animations | `IntersectionObserver` + CSS `opacity/translateY` |

---

## Accessibility & Performance

- **WCAG 2.4.7** — `:focus-visible` keyboard focus ring, no outline on mouse click
- **WCAG 2.3.3** — `prefers-reduced-motion` disables all animations/transitions
- **ARIA** — `aria-live` on form feedback, `aria-expanded` on mobile menu, `aria-current` on active nav link, `role="dialog"` + `aria-modal` on command palette
- **SEO** — Schema.org JSON-LD (`Person` type), Open Graph meta tags, canonical URL, `robots` meta
- **Performance** — `transition: all` eliminated from all selectors; `transform/opacity` only for animations; particles disabled on mobile; `loading="lazy"` on all images; `passive: true` on all scroll listeners

---

## Project Structure

```
/
├── index.html          # Single page — all sections
├── css/
│   └── style.css       # Mobile-first, CSS custom properties, no preprocessor
├── js/
│   ├── darkMode.js     # Theme toggle + OS preference detection
│   ├── i18n.js         # Translation system (data-i18n attribute pattern)
│   └── scripts.js      # All interactions (17 sections)
├── img/                # .webp optimized images
└── docs/               # CV PDF (PT)
```

---

## Setup

No build step required. Open `index.html` in a browser or serve with any static server:

```bash
# Python
python -m http.server 8000

# Node
npx serve .
```

### Contact Form (Formspree)

The form currently falls back to `mailto:` while `FORMSPREE_ID` is not configured.
To enable server-side email delivery:

1. Create a free account at [formspree.io](https://formspree.io)
2. Create a new form and copy the ID
3. Replace `'YOUR_FORMSPREE_ID'` in [js/scripts.js](js/scripts.js#L261)

---

## Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `Ctrl/Cmd + K` | Open command palette |
| `↑ ↓` | Navigate palette items |
| `Enter` | Go to selected section |
| `Esc` | Close palette |

---

## Tech Stack

- HTML5 · CSS3 · JavaScript ES6+
- [tsParticles](https://particles.js.org/) — particle background
- [Font Awesome 6](https://fontawesome.com/) — icons
- [Formspree](https://formspree.io/) — form backend
- [GitHub Pages](https://pages.github.com/) — hosting

---

## Author

**Miguel Angelo** — Flutter Mobile Developer
[LinkedIn](https://www.linkedin.com/in/miguelpagys/) · [GitHub](https://github.com/Miguel12342342) · miguelpagy@gmail.com
