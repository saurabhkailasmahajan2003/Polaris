/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        night: '#050818',
        surface: '#0a1628',
        'surface-deep': '#0d1f3c',
        primary: '#4f6ef7',
        secondary: '#7c3aed',
        tertiary: '#06b6d4',
        success: '#10b981',
        warning: '#f59e0b',
        danger: '#ef4444',
        'text-primary': '#f1f5f9',
        'text-secondary': '#94a3b8',
        'text-muted': '#475569',
      },
      fontFamily: {
        heading: ['"Space Grotesk"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        neon: '0 0 20px rgba(79,110,247,0.4)',
        'neon-lg': '0 0 40px rgba(79,110,247,0.5)',
        'neon-purple': '0 0 20px rgba(124,58,237,0.4)',
        'neon-cyan': '0 0 20px rgba(6,182,212,0.4)',
      },
    },
  },
  plugins: [],
};
