import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
    './node_modules/null_ong2-design-system/dist/**/*.{js,mjs}',
  ],
  theme: {
    extend: {
      colors: {
        admin: {
          bg: '#f7f8fa',
          surface: '#ffffff',
          border: '#e4e7ec',
          accent: '#2f6feb',
        },
      },
    },
  },
  plugins: [],
};

export default config;
