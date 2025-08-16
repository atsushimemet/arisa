import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // ダークテーマでの輝きを表現するカスタムカラー
        'dark-primary': '#0a0a0a',
        'dark-secondary': '#1a1a1a',
        'dark-accent': '#2a2a2a',
        'glow-primary': '#ff6b9d',
        'glow-secondary': '#c44569',
        'glow-accent': '#f8b500',
        'neon-pink': '#ff0080',
        'neon-blue': '#00d4ff',
        'neon-purple': '#8b5cf6',
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
      },
      keyframes: {
        glow: {
          '0%': { 
            boxShadow: '0 0 5px #ff6b9d, 0 0 10px #ff6b9d, 0 0 15px #ff6b9d',
          },
          '100%': { 
            boxShadow: '0 0 10px #ff6b9d, 0 0 20px #ff6b9d, 0 0 30px #ff6b9d',
          },
        },
        'pulse-glow': {
          '0%, 100%': { 
            boxShadow: '0 0 5px rgba(255, 107, 157, 0.5)',
          },
          '50%': { 
            boxShadow: '0 0 20px rgba(255, 107, 157, 0.8), 0 0 30px rgba(255, 107, 157, 0.6)',
          },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
      backgroundImage: {
        'gradient-glow': 'linear-gradient(45deg, #ff6b9d, #c44569, #f8b500)',
        'dark-gradient': 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #2a2a2a 100%)',
      },
    },
  },
  plugins: [],
} satisfies Config;