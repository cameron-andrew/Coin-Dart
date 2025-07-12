/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dart: {
          green: '#22c55e',
          red: '#ef4444',
          blue: '#3b82f6',
          yellow: '#eab308',
          dark: '#1f2937',
          light: '#f9fafb'
        }
      },
      fontFamily: {
        'mono': ['ui-monospace', 'SFMono-Regular', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace'],
      }
    },
  },
  plugins: [],
} 