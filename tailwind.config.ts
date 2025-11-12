import type { Config } from 'tailwindcss'
import colors from 'tailwindcss/colors'
import defaultTheme from 'tailwindcss/defaultTheme'
import plugin from 'tailwindcss/plugin'

const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{js,ts,jsx,tsx,md,mdx,html}'],
  theme: {
    extend: {
      screens: {
        mobile: '769px',
      },
      width: {
        editor: '708px',
      },
      fontFamily: {
        // pretendard: ['var(--font-pretendard)'],
        sans: ['var(--font-pretendard)', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        // TailwindCSS 기본 색상 전체 활성화
        ...colors,
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        Grayscale: {
          B1000: '#000000',
          B900: '#32343A',
          B800: '#42454D',
          B600: '#6E7481',
          B500: '#8A91A1',
          B200: '#B9BDC7',
          B100: '#D5D7DD',
          B70: '#EDEEF0',
          B50: '#F5F5F7',
          B25: '#F8F8FA',
          B0: '#FFFFFF',
        },
        Yellow: {
          950: '#483001',
          900: '#775107',
          800: '#A2700E',
          700: '#C98F1E',
          600: '#E5A62B',
          500: '#F8B739',
          400: '#F7C667',
          300: '#F8D184',
          200: '#F9DBA1',
          100: '#F7E5C2',
          50: '#FDF6E8',
        },
        Finola: {
          Blue: '#017BFF',
          Blue0: '#00BBFF',
          Blue100: '#0049FF',
        },
        Cyan: {
          800: '#012D7A',
          700: '#02399A',
          600: '#024CCC',
          500: '#035FFF',
          400: '#357FFF',
          300: '#69A0FF',
          200: '#A4C5FF',
          100: '#D7E6FF',
          50: '#EBF2FF',
        },
        Blue: {
          950: '#0A1234',
          900: '#161F49',
          800: '#263164',
          700: '#303C74',
          600: '#39478A',
          500: '#4455A3',
          400: '#5D6EBA',
          300: '#7C8CD4',
          200: '#98A5E5',
          100: '#BBC5F5',
          50: '#DFE4FB',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        slideIn: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '100%' },
        },
        slideOut: {
          '0%': { transform: 'translateX(0)', opacity: '0' },
          '100%': { transform: 'translateX(-100%)', opacity: '100%' },
        },
        widthShrink: {
          '0%': { width: '18rem' },
          '100%': { width: '13rem' },
        },
        bounce: {
          '0%, 80%, 100%': { transform: 'scale(0.8)' },
          '40%': { transform: 'scale(1.2)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'gradient-shimmer': {
          '0%': { backgroundPosition: '300% 0' },
          '100%': { backgroundPosition: '-300% 0' },
        },
        fadeInOut: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        slideIn: 'slideIn 1s ease-out forwards',
        slideOut: 'slideOut 1s ease-out forwards',
        widthShrink: 'widthShrink 1s ease-out forwards',
        bounce1: 'bounce 1.4s infinite ease-in-out both -0.32s',
        bounce2: 'bounce 1.4s infinite ease-in-out both -0.16s',
        bounce3: 'bounce 1.4s infinite ease-in-out both 0s',
        shimmer: 'shimmer 2s infinite',
        'gradient-shimmer': 'gradient-shimmer 3s ease-in-out infinite',
        fadeInOut: 'fadeInOut 3s ease-in-out infinite',
      },
      backgroundImage: {
        'gradient-text': 'linear-gradient(90deg, #000000, #B2B7C8)',
        'finola-cta-gradient':
          'linear-gradient(to bottom, theme("colors.Finola.Blue0"), theme("colors.Finola.Blue100"))',
        'finola-logo-gradient': 'linear-gradient(180deg, #EDF7FF 0%, #DAF9FF 100%)',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    require('tailwind-scrollbar'),
    plugin(({ addUtilities }) => {
      addUtilities({
        '.prose-no-select': {
          '.ProseMirror-selectednode > .bn-block-content > *': {
            borderRadius: 'inherit',
            outline: 'none !important',
          },
        },
      })
    }),
  ],
}

export default config
