import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Atlas Design Tokens (aus Böblingen-Mockup übernommen)
        ink: '#1e3d28',
        moss: { DEFAULT: '#2d5a3d', dark: '#1f4029' },
        sand: { DEFAULT: '#f4ede0', warm: '#ebe0cd' },
        cream: '#fbf7ef',
        clay: '#b85444',
        amber: '#c8821a',
        'text-muted': '#5a6b5c',
        'text-dim': '#8a9489',
        border: { DEFAULT: '#e5dcc8', strong: '#d4c8ac' },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Fraunces', 'Georgia', 'serif'],
      },
      boxShadow: {
        soft: '0 1px 3px rgba(30, 61, 40, 0.06)',
        card: '0 4px 12px rgba(30, 61, 40, 0.08)',
        lg: '0 8px 24px rgba(30, 61, 40, 0.12)',
      },
    },
  },
  plugins: [],
};
export default config;
