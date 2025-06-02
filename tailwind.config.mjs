/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      typography: ({ theme }) => ({
        DEFAULT: {
          css: {
            'p': {
              fontSize: theme('fontSize.base'),      // Should resolve to 1rem
              lineHeight: theme('lineHeight.relaxed'), // Should resolve to 1.625
              // Optional: If explicit color override is desired, though prose usually handles this.
              // color: '#222222',
              // '--tw-prose-body': '#222222',
              // '--tw-prose-invert-body': '#ffffff', // For dark mode
            },
            // Add other prose customizations here if needed in the future
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    // any other plugins
  ],
};