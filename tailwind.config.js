/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Brand & surfaces
        'brand-primary': '#4f4559', // Background/Brand/Primary & Text/Default/Default
        'brand-surface': '#4e445a', // Background/Default
        'brand-accent': '#019cdc', // Background/Tertiary

        // Neutrals & semantic
        'surface-white': '#ffffff', // Background/White, Background/Neutral/White/White Default
        'surface-info-secondary': '#d6ebff', // Background/Semantic/Info/Secondary/Secondary
        'surface-neutral-gray': '#f0f0f0', // Background/Neutral/Grey/Grey Default
        'surface-neutral': '#f7f7f7', // Background/Neutral
        'border-default-gray': '#e3e3e3', // Border/Default/Grey/Grey Default

        // Text
        'text-default': '#4f4559', // Text/Default/Default
        'text-secondary': '#7a6b8c', // Text/Default/Secondary/Secondary
        'text-on-light': '#ffffff', // Text/Neutral/White
      },
      fontFamily: {
        // Main typeface from Figma (Roboto Flex)
        sans: ['"Roboto Flex"', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Typography tokens from Figma
        'eva-h4': ['40px', { lineHeight: '1.2', fontWeight: '500' }], // Headlines/H4
        'eva-body': ['16px', { lineHeight: '24px', fontWeight: '400', letterSpacing: '0.5px' }], // Body
        'eva-body-sm': ['14px', { lineHeight: '24px', fontWeight: '400', letterSpacing: '0.1px' }], // Small body
        'eva-body-sm-bold': ['14px', { lineHeight: '1.2', fontWeight: '600' }], // Body/Small body bold
        'eva-label': ['12px', { lineHeight: '1.8', fontWeight: '400' }], // Body/Label
      },
      borderRadius: {
        // Radius tokens from Figma
        'eva-s': '8px', // Radius/S
        'eva-l': '16px', // Radius/L
        'eva-xl': '20px', // Radius/XL
        'eva-full': '999px', // Radius/Full
      },
      boxShadow: {
        // Shadow tokens from Figma
        'eva-chip': '3px 4px 9px -1px rgba(78, 68, 90, 0.13)', // Action chip shadow
        'eva-input': '14px 16px 25.4px 0px rgba(0, 0, 0, 0.05)', // Input field shadow
        'eva-chat-input': '3px 4px 9px -1px rgba(0, 0, 0, 0.08)', // Chat input shadow
        'eva-chat-panel': '0px 4px 19.5px 0px rgba(91, 66, 120, 0.2)', // Chat panel shadow
      },
      backgroundColor: {
        'surface-light': '#ededed', // Main background color
      },
      spacing: {
        'eva-10': '4px', // Space/10
        'eva-50': '8px', // Space/50
        'eva-100': '12px', // Space/100
        'eva-150': '16px', // Space/150
        'eva-350': '32px', // Space/350
      },
    },
  },
  plugins: [],
}


