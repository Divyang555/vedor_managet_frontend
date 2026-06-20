export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'on-error': '#ffffff',
        'surface-container-lowest': '#ffffff',
        'inverse-primary': '#bec6e0',
        'outline': '#e2e8f0',
        'background': '#f8fafc',
        'secondary-fixed': '#dbe1ff',
        'on-primary': '#ffffff',
        'on-primary-container': '#94a3b8',
        'primary-fixed-dim': '#bec6e0',
        'surface-dim': '#f1f5f9',
        'on-tertiary': '#ffffff',
        'on-background': '#0f172a',
        'tertiary-fixed': '#e0e3e5',
        'error': '#ef4444',
        'on-error-container': '#93000a',
        'error-container': '#fee2e2',
        'surface-container-low': '#f8fafc',
        'outline-variant': '#cbd5e1',
        'inverse-surface': '#1e293b',
        'surface-container': '#f1f5f9',
        'surface-container-high': '#e2e8f0',
        'on-surface-variant': '#64748b',
        'secondary-fixed-dim': '#b4c5ff',
        'primary': '#0f172a',
        'on-primary-fixed-variant': '#94a3b8',
        'on-secondary': '#ffffff',
        'tertiary': '#000000',
        'secondary-container': '#316bf3',
        'on-surface': '#0f172a',
        'tertiary-container': '#191c1e',
        'on-tertiary-fixed': '#191c1e',
        'secondary': '#316bf3',
        'surface-variant': '#f1f5f9',
        'surface-bright': '#ffffff',
        'on-secondary-container': '#ffffff',
        'on-primary-fixed': '#0f172a',
        'on-secondary-fixed': '#00174b',
        'surface': '#ffffff',
        'surface-container-highest': '#cbd5e1',
        'on-tertiary-fixed-variant': '#444749',
        'primary-container': '#0f172a',
        'on-secondary-fixed-variant': '#003ea8',
        'primary-fixed': '#dae2fd',
        'on-tertiary-container': '#818486',
        'surface-tint': '#565e74',
        'inverse-on-surface': '#f8fafc',
        'tertiary-fixed-dim': '#c4c7c9'
      },
      borderRadius: {
        DEFAULT: '8px',
        lg: '8px',
        xl: '12px',
        full: '9999px'
      },
      spacing: {
        'section-margin': '32px',
        gutter: '16px',
        base: '4px',
        'container-padding': '24px',
        'sidebar-width': '260px',
        'card-gap': '24px'
      },
      fontFamily: {
        'body-lg': ['Inter', 'sans-serif'],
        'headline-md': ['Hanken Grotesk', 'sans-serif'],
        'headline-lg': ['Hanken Grotesk', 'sans-serif'],
        display: ['Hanken Grotesk', 'sans-serif'],
        'data-tabular': ['Inter', 'sans-serif'],
        'body-md': ['Inter', 'sans-serif'],
        'label-md': ['Inter', 'sans-serif']
      },
      fontSize: {
        'body-lg': ['16px', { lineHeight: '24px', fontWeight: '400' }],
        'headline-md': ['18px', { lineHeight: '24px', fontWeight: '600' }],
        'headline-lg': ['24px', { lineHeight: '32px', fontWeight: '600' }],
        display: ['32px', { lineHeight: '1.2', letterSpacing: '-0.02em', fontWeight: '700' }],
        'data-tabular': ['14px', { lineHeight: '20px', fontWeight: '500' }],
        'body-md': ['14px', { lineHeight: '20px', fontWeight: '400' }],
        'label-md': ['12px', { lineHeight: '16px', letterSpacing: '0.05em', fontWeight: '600' }]
      }
    }
  }
};
