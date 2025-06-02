/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        accent: '#1d2739',
        backgroundLight: '#f4f4f5',
        borderAlt: '#ededed',
      },
      typography: ({ theme }) => ({
        DEFAULT: {
          css: {
            '--tw-prose-body': theme('colors.accent'),
            '--tw-prose-invert-body': theme('colors.borderAlt'),
            '--tw-prose-links': theme('colors.accent'),
            '--tw-prose-invert-links': theme('colors.borderAlt'),
            // You can add other prose elements here like headings, blockquotes, etc.
            // For example, to make headings use the accent color:
            // '--tw-prose-headings': theme('colors.accent'),
            // '--tw-prose-invert-headings': theme('colors.borderAlt'),
            'p': {
              fontSize: theme('fontSize.base'),
              lineHeight: theme('lineHeight.relaxed'),
              // Body color is now handled by --tw-prose-body
            },
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