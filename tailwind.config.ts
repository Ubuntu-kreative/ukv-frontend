import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        neon:          '#00FF41',
        'neon-dim':    '#00C832',
        gold:          '#D4A853',
        'gold-light':  '#F0C878',
        obsidian:      '#0A0A0A',
        'obsidian-mid':'#111111',
        'obs-light':   '#1A1A1A',
        earth:         '#2C1810',
        'earth-mid':   '#4A2E1A',
        cream:         '#F5F0E8',
        'cream-dim':   'rgba(245,240,232,0.55)',
        mist:          'rgba(255,255,255,0.04)',
        'mist-strong': 'rgba(255,255,255,0.10)',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Cormorant Garamond', 'Georgia', 'serif'],
        body:    ['var(--font-body)',    'Jost', 'system-ui', 'sans-serif'],
        accent:  ['var(--font-accent)',  'Playfair Display', 'Georgia', 'serif'],
        mono:    ['var(--font-mono)',    'Space Mono', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        '2xs': '0.625rem',  // 10px
        xs:    '0.6875rem', // 11px
      },
      backdropBlur: {
        glass:    '16px',
        'glass-sm':'8px',
      },
      borderRadius: {
        glass:    '16px',
        'glass-sm':'10px',
        '3xl':    '24px',
        '4xl':    '32px',
      },
      boxShadow: {
        'neon-sm':    '0 0 8px  rgba(0,255,65,0.25)',
        'neon-md':    '0 0 20px rgba(0,255,65,0.35)',
        'neon-lg':    '0 0 40px rgba(0,255,65,0.50)',
        'gold-sm':    '0 0 12px rgba(212,168,83,0.25)',
        'gold-md':    '0 0 24px rgba(212,168,83,0.40)',
        'gold-glow':  '0 0 28px rgba(200,168,75,0.10)',
        glass:        '0 8px  32px rgba(0,0,0,0.40)',
        'glass-lg':   '0 16px 64px rgba(0,0,0,0.60)',
        'card-lift':  '0 4px 16px -4px rgba(0,0,0,0.5), 0 16px 48px -12px rgba(0,0,0,0.45)',
        'card-hover': '0 8px 32px -8px rgba(0,0,0,0.6), 0 24px 72px -16px rgba(0,0,0,0.5)',
        'cart-float': '0 8px 32px rgba(200,168,75,0.30), 0 2px 8px rgba(0,0,0,0.4)',
      },
      animation: {
        'pulse-neon':      'pulseNeon 2s ease-in-out infinite',
        'float':           'float 3s ease-in-out infinite',
        'shimmer':         'shimmer 2s linear infinite',
        'shimmer-gold':    'shimmerGoldText 6s ease-in-out infinite',
        'fade-up':         'fadeUp 0.8s ease forwards',
        'scan':            'scan 6s linear infinite',
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
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128':'32rem',
      },
      maxWidth: {
        '8xl': '88rem',
      },
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100':'100',
        '200':'200',
        '300':'300',
      },
      transitionDuration: {
        '400': '400ms',
      },
      gridTemplateColumns: {
        '13': 'repeat(13, minmax(0, 1fr))',
        'bento-sm': 'repeat(4,  1fr)',
        'bento-md': 'repeat(8,  1fr)',
        'bento-lg': 'repeat(12, 1fr)',
      },
    },
  },
  plugins: [],
}

export default config