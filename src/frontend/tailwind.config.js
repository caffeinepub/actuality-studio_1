import typography from '@tailwindcss/typography';
import containerQueries from '@tailwindcss/container-queries';
import animate from 'tailwindcss-animate';

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ['class'],
    content: ['index.html', 'src/**/*.{js,ts,jsx,tsx,html,css}'],
    theme: {
        container: {
            center: true,
            padding: '2rem',
            screens: {
                '2xl': '1400px'
            }
        },
        extend: {
            fontFamily: {
                display: ['Cormorant Garamond', 'Georgia', 'serif'],
                body:    ['Inter', 'system-ui', 'sans-serif'],
                sans:    ['Inter', 'system-ui', 'sans-serif'],
            },
            colors: {
                border:     'oklch(var(--border))',
                input:      'oklch(var(--input))',
                ring:       'oklch(var(--ring) / <alpha-value>)',
                background: 'oklch(var(--background))',
                foreground: 'oklch(var(--foreground))',
                primary: {
                    DEFAULT:    'oklch(var(--primary) / <alpha-value>)',
                    foreground: 'oklch(var(--primary-foreground))',
                },
                secondary: {
                    DEFAULT:    'oklch(var(--secondary) / <alpha-value>)',
                    foreground: 'oklch(var(--secondary-foreground))',
                },
                destructive: {
                    DEFAULT:    'oklch(var(--destructive) / <alpha-value>)',
                    foreground: 'oklch(var(--destructive-foreground))',
                },
                muted: {
                    DEFAULT:    'oklch(var(--muted) / <alpha-value>)',
                    foreground: 'oklch(var(--muted-foreground) / <alpha-value>)',
                },
                accent: {
                    DEFAULT:    'oklch(var(--accent) / <alpha-value>)',
                    foreground: 'oklch(var(--accent-foreground))',
                },
                popover: {
                    DEFAULT:    'oklch(var(--popover))',
                    foreground: 'oklch(var(--popover-foreground))',
                },
                card: {
                    DEFAULT:    'oklch(var(--card))',
                    foreground: 'oklch(var(--card-foreground))',
                },
                /* ── Autumn / Spring semantic tokens ─────────────────────── */
                terracotta: {
                    DEFAULT: 'oklch(var(--terracotta))',
                    light:   'oklch(var(--terracotta-light))',
                    dim:     'oklch(var(--terracotta-dim))',
                },
                'sage-green': {
                    DEFAULT: 'oklch(var(--sage))',
                    dark:    'oklch(var(--sage-dark))',
                    light:   'oklch(var(--sage-light))',
                },
                'warm-gold': {
                    DEFAULT: 'oklch(var(--warm-gold))',
                    bright:  'oklch(var(--warm-gold-bright))',
                    dim:     'oklch(var(--warm-gold-dim))',
                },
                'soft-blush': {
                    DEFAULT: 'oklch(var(--blush))',
                    light:   'oklch(var(--blush-light))',
                },
                cream: {
                    DEFAULT: 'oklch(var(--cream))',
                    dark:    'oklch(var(--cream-dark))',
                },
                'forest-green': {
                    DEFAULT: 'oklch(var(--forest))',
                    light:   'oklch(var(--forest-light))',
                },
                /* ── Legacy gold alias ───────────────────────────────────── */
                gold: {
                    DEFAULT: 'oklch(var(--warm-gold))',
                    bright:  'oklch(var(--warm-gold-bright))',
                    dim:     'oklch(var(--warm-gold-dim))',
                    muted:   'oklch(var(--warm-gold-dim))',
                },
                chart: {
                    1: 'oklch(var(--chart-1))',
                    2: 'oklch(var(--chart-2))',
                    3: 'oklch(var(--chart-3))',
                    4: 'oklch(var(--chart-4))',
                    5: 'oklch(var(--chart-5))',
                },
                sidebar: {
                    DEFAULT:              'oklch(var(--sidebar))',
                    foreground:           'oklch(var(--sidebar-foreground))',
                    primary:              'oklch(var(--sidebar-primary))',
                    'primary-foreground': 'oklch(var(--sidebar-primary-foreground))',
                    accent:               'oklch(var(--sidebar-accent))',
                    'accent-foreground':  'oklch(var(--sidebar-accent-foreground))',
                    border:               'oklch(var(--sidebar-border))',
                    ring:                 'oklch(var(--sidebar-ring))',
                },
            },
            borderRadius: {
                lg:   'var(--radius)',
                md:   'calc(var(--radius) - 2px)',
                sm:   'calc(var(--radius) - 4px)',
                '2xl':'1rem',
                '3xl':'1.5rem',
            },
            boxShadow: {
                xs:           '0 1px 2px 0 rgba(0,0,0,0.05)',
                'warm-sm':    '0 2px 12px oklch(0.58 0.12 38 / 0.15)',
                'warm-md':    '0 4px 24px oklch(0.58 0.12 38 / 0.18), 0 1px 6px oklch(0.58 0.12 38 / 0.10)',
                'gold-sm':    '0 0 12px oklch(0.76 0.13 55 / 0.20)',
                'gold-md':    '0 0 24px oklch(0.76 0.13 55 / 0.25), 0 0 48px oklch(0.76 0.13 55 / 0.10)',
                'card':       '0 2px 16px rgba(100,60,30,0.08), 0 1px 4px rgba(100,60,30,0.05)',
                'card-hover': '0 6px 32px rgba(100,60,30,0.14), 0 2px 8px rgba(100,60,30,0.08)',
            },
            keyframes: {
                'accordion-down': {
                    from: { height: '0' },
                    to:   { height: 'var(--radix-accordion-content-height)' },
                },
                'accordion-up': {
                    from: { height: 'var(--radix-accordion-content-height)' },
                    to:   { height: '0' },
                },
                'shimmer': {
                    '0%':   { backgroundPosition: '-200% 0' },
                    '100%': { backgroundPosition: '200% 0' },
                },
                'fade-in': {
                    from: { opacity: '0', transform: 'translateY(8px)' },
                    to:   { opacity: '1', transform: 'translateY(0)' },
                },
                'pulse-gold': {
                    '0%, 100%': { boxShadow: '0 0 8px oklch(0.76 0.13 55 / 0.25)' },
                    '50%':      { boxShadow: '0 0 18px oklch(0.76 0.13 55 / 0.50)' },
                },
                'sway': {
                    '0%, 100%': { transform: 'rotate(-2deg)' },
                    '50%':      { transform: 'rotate(2deg)' },
                },
            },
            animation: {
                'accordion-down': 'accordion-down 0.2s ease-out',
                'accordion-up':   'accordion-up 0.2s ease-out',
                'shimmer':        'shimmer 2s linear infinite',
                'fade-in':        'fade-in 0.4s ease-out',
                'pulse-gold':     'pulse-gold 2.5s ease-in-out infinite',
                'sway':           'sway 4s ease-in-out infinite',
            },
        },
    },
    plugins: [typography, containerQueries, animate],
};
