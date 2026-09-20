import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        'muted-foreground': 'hsl(var(--muted-foreground))',
        border: 'hsl(var(--border))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          elevated: 'hsl(var(--card-elevated))',
        },
        spec: 'hsl(var(--spec))',
        vertex: {
          dark: '#020204',
          cyan: '#0cbde8',
          teal: '#14a8c6',
          navy: '#0a111d'
        }
      },
      fontFamily: {
        sans: ['var(--font-poppins)', 'Poppins', 'sans-serif'],
        serif: ['var(--font-playfair)', '"Playfair Display"', 'serif'],
        mono: ['ui-monospace', 'monospace'],
      },
      letterSpacing: {
        tightest: '-0.025em',
        eyebrow: '0.12em',
      },
    },
  },
  plugins: [],
};

export default config;
