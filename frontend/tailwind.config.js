/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // Enable dark mode via class
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#E10600', // F1 Red
        'primary-dark': '#FF1E00', // Brighter F1 Red for dark mode accents
        secondary: '#FFFFFF', // White
        'secondary-dark': '#1A1A1A', // Dark gray for dark mode backgrounds
        'app-text': '#1A1A1A', // Dark text for light mode
        'app-text-dark': '#FFFFFF', // White text for dark mode
        'muted-text': '#6B7280', // Gray for muted text
        'muted-text-dark': '#A0A0A0', // Lighter gray for muted text in dark mode
        'sector-green': '#00FF00', // Green for improved sectors
        'sector-purple': '#800080', // Purple for personal best sectors
        'sector-yellow': '#FFFF00', // Yellow for slower sectors
        'pit-stop': '#FFA500', // Orange for pit stops
      },
      keyframes: {
        flash: {
          '0%, 100%': { backgroundColor: 'transparent' },
          '50%': { backgroundColor: 'rgba(225, 6, 0, 0.2)' }, // Light red flash
        },
        'flash-dark': {
          '0%, 100%': { backgroundColor: 'transparent' },
          '50%': { backgroundColor: 'rgba(255, 30, 0, 0.3)' }, // Brighter red flash for dark mode
        },
      },
      animation: {
        flash: 'flash 0.5s ease-in-out',
        'flash-dark': 'flash-dark 0.5s ease-in-out',
      },
    },
  },
  plugins: [],
}