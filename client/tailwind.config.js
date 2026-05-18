/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        outline: '#75777d',
        primary: '#091426',
        'on-secondary-container': '#fffbff',
        'on-primary-fixed': '#111c2d',
        'on-error': '#ffffff',
        'secondary-fixed-dim': '#c0c1ff',
        'on-tertiary-container': '#a38c6a',
        'on-surface-variant': '#45474c',
        'on-primary': '#ffffff',
        'secondary-fixed': '#e1e0ff',
        'primary-fixed-dim': '#bcc7de',
        'primary-container': '#1e293b',
        'surface-bright': '#fbf8fa',
        'surface': '#fbf8fa',
        'on-surface': '#1b1b1d',
        'surface-container-highest': '#e4e2e3',
        'surface-container': '#f0edef',
        'surface-container-lowest': '#ffffff',
        'surface-container-low': '#f5f3f4',
        'surface-container-high': '#eae7e9',
        'surface-variant': '#e4e2e3',
        'outline-variant': '#c5c6cd',
        secondary: '#4648d4',
        'secondary-container': '#6063ee',
        'on-secondary': '#ffffff',
        'on-secondary-fixed': '#07006c',
        'primary-fixed': '#d8e3fb',
        'inverse-surface': '#303032',
        'inverse-on-surface': '#f3f0f2',
        tertiary: '#1e1200',
        'tertiary-container': '#35260c',
        'tertiary-fixed': '#fadfb8',
        'tertiary-fixed-dim': '#ddc39d',
        error: '#ba1a1a',
        'error-container': '#ffdad6'
      },
      boxShadow: {
        soft: '0 1px 3px rgba(0, 0, 0, 0.05)',
        ambient: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
      },
      borderRadius: {
        xl: '0.75rem'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif']
      },
      fontSize: {
        'display-lg': ['32px', { lineHeight: '40px', letterSpacing: '-0.02em', fontWeight: '700' }],
        'display-lg-mobile': ['24px', { lineHeight: '32px', fontWeight: '700' }],
        'headline-md': ['24px', { lineHeight: '32px', letterSpacing: '-0.01em', fontWeight: '600' }],
        'headline-sm': ['18px', { lineHeight: '24px', fontWeight: '600' }],
        'label-md': ['12px', { lineHeight: '12px', letterSpacing: '0.05em', fontWeight: '600' }],
        'label-sm': ['11px', { lineHeight: '12px', fontWeight: '500' }],
        'body-lg': ['16px', { lineHeight: '24px', fontWeight: '400' }],
        'body-md': ['14px', { lineHeight: '20px', fontWeight: '400' }],
        'body-sm': ['12px', { lineHeight: '16px', fontWeight: '400' }]
      }
    }
  },
  plugins: []
};