import colors from 'tailwindcss/colors'

import type { Config } from 'tailwindcss'

const config: Partial<Config> = {
  content: ['./app/**/*.{js,ts,jsx,tsx,md,mdx,vue}'],
  safelist: [
    'i-ph-minus',
    'i-ph-plus',
    'i-ph-browser',
    'i-ph-x',
    'i-twemoji-flag-russia',
    'i-twemoji-flag-united-states',
    'i-carbon-light',
    'i-carbon-moon',
    'i-carbon-chevron-down',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter Light', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: colors.emerald,
      },
    },
  },
}

export default config
