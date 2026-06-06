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
        primary: {
          50: '#EBF5FB',
          100: '#D6EAF8',
          200: '#AED6F1',
          300: '#85C1E9',
          400: '#5DADE2',
          500: '#2E86C1',
          600: '#1B4F72',
          700: '#154360',
          800: '#0E2D44',
          900: '#071828',
        },
        accent: {
          50: '#E8F8F5',
          100: '#D1F2EB',
          200: '#A3E4D7',
          300: '#76D7C4',
          400: '#48C9B0',
          500: '#1ABC9C',
          600: '#17A589',
          700: '#148F77',
          800: '#117A65',
          900: '#0E6655',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Poppins', 'sans-serif'],
      },
      boxShadow: {
        card: '0 4px 24px rgba(27, 79, 114, 0.08)',
        'card-hover': '0 8px 32px rgba(27, 79, 114, 0.15)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
