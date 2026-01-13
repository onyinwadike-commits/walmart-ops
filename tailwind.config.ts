import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // Walmart Brand Colors
        'walmart-blue': '#0071CE',
        'walmart-blue-dark': '#004C91',
        'spark-yellow': '#FFC220',
        'spark-orange': '#F47721',

        // Dark Theme
        'dark-bg': '#0A0E14',
        'dark-surface': '#12171E',
        'dark-border': '#1E2530',
        'dark-text': '#E8EAED',
        'dark-text-secondary': '#9AA0A6',

        // Section Colors
        'section-a': '#22C55E',
        'section-b': '#3B82F6',
        'section-c': '#A855F7',
        'section-d': '#F97316',
        'section-e': '#EC4899',
        'section-f': '#06B6D4',
        'section-g': '#EAB308',
        'section-h': '#84CC16',
        'section-i': '#F43F5E',
        'section-j': '#6366F1',
        'section-k': '#14B8A6',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'glass-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
      },
      backdropBlur: {
        'xs': '2px',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(0, 113, 206, 0.5)' },
          '100%': { boxShadow: '0 0 20px rgba(0, 113, 206, 0.8), 0 0 30px rgba(0, 113, 206, 0.4)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'glass-sm': '0 4px 16px 0 rgba(0, 0, 0, 0.25)',
        'neon-blue': '0 0 20px rgba(0, 113, 206, 0.5)',
        'neon-yellow': '0 0 20px rgba(255, 194, 32, 0.5)',
      },
    },
  },
  plugins: [],
};
export default config;
