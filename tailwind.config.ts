import type { Config } from 'tailwindcss'

// ─────────────────────────────────────────────────────────────────────
// Ubuntu Kreative Village — tailwind.config.ts
//
// Typography upgrade: Cormorant Garamond / DM Sans / Playfair / DM Mono
// DM Sans replaces Jost — superior optical clarity at small tracking-
// heavy caps. DM Mono replaces Space Mono — cleaner price numerals.
// ─────────────────────────────────────────────────────────────────────

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // ── COLORS ────────────────────────────────────────────────────
      colors: {
        neon:          '#00FF41',
        'neon-dim':    '#00C832',
        gold:          '#D4A853',
        'gold-light':  '#F0C878',
        'gold-muted':  'rgba(200,168,75,0.55)',
        obsidian:      '#0A0A0A',
        'obsidian-mid':'#111111',
        'obs-light':   '#1A1A1A',
        earth:         '#2C1810',
        'earth-mid':   '#4A2E1A',
        cream:         '#EDE6D3',
        'cream-2':     '#D9D0BC',
        'cream-dim':   'rgba(237,230,211,0.55)',
        mist:          'rgba(255,255,255,0.04)',
        'mist-strong': 'rgba(255,255,255,0.10)',
      },

      // ── FONT FAMILIES ─────────────────────────────────────────────
      //
      // CSS variable injected by Next.js font loader at runtime.
      // Fallbacks are for compile-time Tailwind class generation only.
      //
      // Usage in JSX:
      //   font-display → Cormorant Garamond (headings, room/dish names)
      //   font-body    → DM Sans           (nav, body, labels, CTAs)
      //   font-accent  → Playfair Display  (pull-quotes, italic accents)
      //   font-mono    → DM Mono           (prices, telemetry, IDs)
      //
      fontFamily: {
        display: ['var(--font-display)', 'Cormorant Garamond', 'Georgia', 'serif'],
        body:    ['var(--font-body)',    'DM Sans', 'system-ui', 'sans-serif'],
        accent:  ['var(--font-accent)',  'Playfair Display', 'Georgia', 'serif'],
        mono:    ['var(--font-mono)',    'DM Mono', 'ui-monospace', 'Menlo', 'monospace'],
      },

      // ── FONT SIZES ────────────────────────────────────────────────
      //
      // Extends Tailwind's scale with UKV-specific nano sizes
      // needed for badges, eyebrows, and farm telemetry labels.
      //
      fontSize: {
        // Nano sizes below Tailwind's xs (0.75rem / 12px)
        '2xs': ['0.625rem',  { lineHeight: '1' }],        // 10px — badges
        '3xs': ['0.5625rem', { lineHeight: '1' }],        // 9px  — status labels
        '4xs': ['0.5rem',    { lineHeight: '1' }],        // 8px  — nav caps, eyebrows
        'xs':  ['0.6875rem', { lineHeight: '1.4' }],      // 11px — overrides Tailwind xs
      },

      // ── LETTER SPACING ────────────────────────────────────────────
      //
      // DM Sans requires slightly less tracking than Jost at the same
      // visual weight — its glyphs are wider. Scale reflects this.
      //
      letterSpacing: {
        'tighter':  '-0.025em',   // Display headlines
        'tight':    '-0.01em',    // Card names, sub-heads
        'normal':    '0',          // Body paragraphs
        'wide':     '0.04em',     // Button text, labels
        'wider':    '0.08em',     // Short prose caps
        'caps':     '0.14em',     // All-caps UI elements
        'spread':   '0.22em',     // Nav links, badges, eyebrows
        'ultra':    '0.38em',     // Extreme spaced display moments
      },

      // ── LINE HEIGHT ───────────────────────────────────────────────
      lineHeight: {
        'tight':    '0.85',
        'snug':     '1.15',
        'normal':   '1.55',
        'relaxed':  '1.75',
        'loose':    '2.0',
      },

      // ── BORDER RADIUS ─────────────────────────────────────────────
      borderRadius: {
        'sm':   '4px',
        DEFAULT:'8px',
        'md':   '10px',
        'lg':   '14px',
        'xl':   '18px',
        '2xl':  '22px',
        '3xl':  '28px',
        '4xl':  '36px',
        'full': '9999px',
        'glass':    '16px',
        'glass-sm': '10px',
        'pill':     '100px',
      },

      // ── BACKDROP BLUR ─────────────────────────────────────────────
      backdropBlur: {
        xs:         '4px',
        sm:         '8px',
        DEFAULT:    '12px',
        md:         '16px',
        lg:         '20px',
        xl:         '24px',
        '2xl':      '32px',
        '3xl':      '48px',
        glass:      '16px',
        'glass-sm': '8px',
      },

      // ── BOX SHADOW ────────────────────────────────────────────────
      boxShadow: {
        'neon-sm':    '0 0 8px  rgba(0,255,65,0.25)',
        'neon-md':    '0 0 20px rgba(0,255,65,0.35)',
        'neon-lg':    '0 0 40px rgba(0,255,65,0.50)',
        'gold-sm':    '0 0 12px rgba(212,168,83,0.25)',
        'gold-md':    '0 0 24px rgba(212,168,83,0.40)',
        'gold-glow':  '0 0 28px rgba(200,168,75,0.10)',
        'glass':      '0 8px  32px rgba(0,0,0,0.40)',
        'glass-lg':   '0 16px 64px rgba(0,0,0,0.60)',
        'card-lift':  '0 4px 16px -4px rgba(0,0,0,0.5), 0 16px 48px -12px rgba(0,0,0,0.45)',
        'card-hover': '0 8px 32px -8px rgba(0,0,0,0.6), 0 24px 72px -16px rgba(0,0,0,0.5)',
        'cart-float': '0 8px 32px rgba(200,168,75,0.30), 0 2px 8px rgba(0,0,0,0.4)',
      },

      // ── ANIMATIONS ────────────────────────────────────────────────
      animation: {
        'pulse-neon':   'pulseNeon 2s ease-in-out infinite',
        'float':        'float 3s ease-in-out infinite',
        'shimmer':      'shimmer 2s linear infinite',
        'shimmer-gold': 'shimmerGoldText 6s ease-in-out infinite',
        'fade-up':      'fadeUp 0.8s ease forwards',
        'scan':         'scan 6s linear infinite',
        'scroll-dot':   'scrollDot 1.8s ease-in-out infinite',
      },

      keyframes: {
        pulseNeon: {
          '0%,100%': { opacity: '1',   textShadow: '0 0 10px #00FF41' },
          '50%':     { opacity: '0.6', textShadow: '0 0 24px #00FF41, 0 0 48px #00FF41' },
        },
        float: {
          '0%,100%': { transform: 'translateY(0px)' },
          '50%':     { transform: 'translateY(-8px)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition:  '200% 0' },
        },
        shimmerGoldText: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%':      { backgroundPosition: '100% 50%' },
        },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        scan: {
          '0%':   { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        scrollDot: {
          '0%, 100%': { transform: 'translateY(0)',  opacity: '0.6' },
          '50%':      { transform: 'translateY(6px)', opacity: '0.2' },
        },
      },

      // ── SPACING ───────────────────────────────────────────────────
      spacing: {
        '18':  '4.5rem',
        '88':  '22rem',
        '128': '32rem',
      },

      // ── MAX WIDTH ─────────────────────────────────────────────────
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
      },

      // ── TRANSITION TIMING ─────────────────────────────────────────
      transitionTimingFunction: {
        'spring':     'cubic-bezier(0.16, 1, 0.3, 1)',
        'ease-sharp': 'cubic-bezier(0.23, 1, 0.32, 1)',
      },

      transitionDuration: {
        '400': '400ms',
        '600': '600ms',
        '800': '800ms',
      },

      // ── Z-INDEX ───────────────────────────────────────────────────
      zIndex: {
        '60':  '60',
        '70':  '70',
        '80':  '80',
        '90':  '90',
        '100': '100',
        '200': '200',
        '300': '300',
      },

      // ── GRID ──────────────────────────────────────────────────────
      gridTemplateColumns: {
        '13':       'repeat(13, minmax(0, 1fr))',
        'bento-sm': 'repeat(4,  1fr)',
        'bento-md': 'repeat(8,  1fr)',
        'bento-lg': 'repeat(12, 1fr)',
      },
    },
  },
  plugins: [],
}

export default config