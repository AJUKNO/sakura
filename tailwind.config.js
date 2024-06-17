/** @type {import('tailwindcss').Config} */
export default {
  content: ['./shopify/**/*.liquid', './src/**/*.{ts,tsx}'],
  theme: {
    // fontSize: {
    //   xs: 'var(--font-size-xs)',
    //   sm: 'var(--font-size-sm)',
    //   base: 'var(--font-size-base)',
    //   lg: 'var(--font-size-lg)',
    //   xl: 'var(--font-size-xl)',
    //   '2xl': 'var(--font-size-2xl)',
    //   '3xl': 'var(--font-size-3xl)',
    //   '4xl': 'var(--font-size-4xl)',
    //   '5xl': 'var(--font-size-5xl)',
    //   '6xl': 'var(--font-size-6xl)',
    //   '7xl': 'var(--font-size-7xl)',
    //   '8xl': 'var(--font-size-8xl)',
    //   '9xl': 'var(--font-size-9xl)',
    // },
    extend: {
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
      },
      transitionTimingFunction: {
        'in-expo': 'cubic-bezier(0.95, 0.05, 0.795, 0.035)',
        'out-expo': 'cubic-bezier(0.19, 1, 0.22, 1)',
        'in-out-expo': 'cubic-bezier(0.87, 0, 0.13, 1)',
      },
      colors: {
        background: 'rgb(var(--color-background) / <alpha-value>)',
        foreground: 'rgb(var(--color-foreground) / <alpha-value>)',
        muted: 'rgb(var(--color-muted) / <alpha-value>)',
        'muted-foreground': 'rgb(var(--color-muted-foreground) / <alpha-value>)',
        border: 'rgb(var(--color-border) / <alpha-value>)',
        primary: 'rgb(var(--color-primary) / <alpha-value>)',
        'primary-foreground': 'rgb(var(--color-primary-foreground) / <alpha-value>)',
        secondary: 'rgb(var(--color-secondary) / <alpha-value>)',
        'secondary-foreground':
          'rgb(var(--color-secondary-foreground) / <alpha-value>)',
        accent: 'rgb(var(--color-accent) / <alpha-value>)',
        'accent-foreground': 'rgb(var(--color-accent-foreground) / <alpha-value>)',
        destructive: 'rgb(var(--color-destructive) / <alpha-value>)',
        'destructive-foreground':
          'rgb(var(--color-destructive-foreground) / <alpha-value>)',
        ring: 'rgb(var(--color-ring) / <alpha-value>)',
      },
      fontFamily: {
        body: ['var(--font-body-family)'],
        heading: ['var(--font-heading-family)'],
        kokoro: ['Kokoro'],
        hannari: ['Hannari'],
      },
      spacing: {
        '2xs': 'var(--spacing-2xs)',
        xs: 'var(--spacing-xs)',
        sm: 'var(--spacing-sm)',
        md: 'var(--spacing-md)',
        lg: 'var(--spacing-lg)',
        xl: 'var(--spacing-xl)',
        '2xl': 'var(--spacing-2xl)',
        '3xl': 'var(--spacing-3xl)',
        '4xl': 'var(--spacing-4xl)',
        '5xl': 'var(--spacing-5xl)',
        '6xl': 'var(--spacing-6xl)',
        '7xl': 'var(--spacing-7xl)',
      },
    },
  },
  corePlugins: {
    aspectRatio: false,
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
}
