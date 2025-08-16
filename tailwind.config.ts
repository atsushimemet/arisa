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
        // Enhanced dark theme colors
        'dark-primary': '#0a0a0a',
        'dark-secondary': '#1a1a1a',
        'dark-accent': '#2a2a2a',
        'dark-card': '#1e1e1e',
        'dark-border': '#333333',
        // Enhanced neon color palette
        'glow-primary': '#ff6b9d',
        'glow-secondary': '#c44569',
        'glow-accent': '#f8b500',
        'neon-pink': '#ff0080',
        'neon-cyan': '#00ffff',
        'neon-blue': '#00d4ff',
        'neon-purple': '#8b5cf6',
        'neon-green': '#39ff14',
        'neon-orange': '#ff6600',
        'electric-blue': '#0066ff',
        'plasma-pink': '#ff3366',
        'cyber-purple': '#6600cc',
        'laser-green': '#00ff88',
        // Gaming-inspired colors
        'game-gold': '#ffd700',
        'game-silver': '#c0c0c0',
        'game-bronze': '#cd7f32',
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
        'float': 'float 3s ease-in-out infinite',
        'bounce-glow': 'bounce-glow 2s infinite',
        'slide-in-up': 'slide-in-up 0.6s ease-out',
        'slide-in-down': 'slide-in-down 0.6s ease-out',
        'slide-in-left': 'slide-in-left 0.6s ease-out',
        'slide-in-right': 'slide-in-right 0.6s ease-out',
        'fade-in': 'fade-in 0.8s ease-out',
        'scale-in': 'scale-in 0.5s ease-out',
        'ripple': 'ripple 0.6s linear',
        'neon-pulse': 'neon-pulse 2s ease-in-out infinite',
        'cyber-glitch': 'cyber-glitch 0.5s linear infinite',
        'holographic': 'holographic 4s linear infinite',
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
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'bounce-glow': {
          '0%, 20%, 53%, 80%, 100%': {
            transform: 'translateY(0px)',
            filter: 'drop-shadow(0 0 10px rgba(255, 107, 157, 0.5))',
          },
          '40%, 43%': {
            transform: 'translateY(-20px)',
            filter: 'drop-shadow(0 0 20px rgba(255, 107, 157, 0.8))',
          },
        },
        'slide-in-up': {
          '0%': {
            transform: 'translateY(100px)',
            opacity: '0',
          },
          '100%': {
            transform: 'translateY(0)',
            opacity: '1',
          },
        },
        'slide-in-down': {
          '0%': {
            transform: 'translateY(-100px)',
            opacity: '0',
          },
          '100%': {
            transform: 'translateY(0)',
            opacity: '1',
          },
        },
        'slide-in-left': {
          '0%': {
            transform: 'translateX(-100px)',
            opacity: '0',
          },
          '100%': {
            transform: 'translateX(0)',
            opacity: '1',
          },
        },
        'slide-in-right': {
          '0%': {
            transform: 'translateX(100px)',
            opacity: '0',
          },
          '100%': {
            transform: 'translateX(0)',
            opacity: '1',
          },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'scale-in': {
          '0%': {
            transform: 'scale(0.5)',
            opacity: '0',
          },
          '100%': {
            transform: 'scale(1)',
            opacity: '1',
          },
        },
        ripple: {
          '0%': {
            transform: 'scale(0)',
            opacity: '1',
          },
          '100%': {
            transform: 'scale(4)',
            opacity: '0',
          },
        },
        'neon-pulse': {
          '0%, 100%': {
            textShadow: '0 0 5px currentColor, 0 0 10px currentColor, 0 0 15px currentColor',
          },
          '50%': {
            textShadow: '0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor',
          },
        },
        'cyber-glitch': {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%': { transform: 'translateX(-2px)' },
          '40%': { transform: 'translateX(2px)' },
          '60%': { transform: 'translateX(-2px)' },
          '80%': { transform: 'translateX(2px)' },
        },
        holographic: {
          '0%': {
            backgroundPosition: '0% 50%',
          },
          '50%': {
            backgroundPosition: '100% 50%',
          },
          '100%': {
            backgroundPosition: '0% 50%',
          },
        },
      },
      backgroundImage: {
        'gradient-glow': 'linear-gradient(45deg, #ff6b9d, #c44569, #f8b500)',
        'dark-gradient': 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #2a2a2a 100%)',
        'neon-gradient': 'linear-gradient(45deg, #ff0080, #00ffff, #8b5cf6)',
        'cyber-gradient': 'linear-gradient(135deg, #0066ff 0%, #6600cc 50%, #ff3366 100%)',
        'gaming-gradient': 'linear-gradient(45deg, #39ff14, #00d4ff, #ff6600)',
        'holographic': 'linear-gradient(45deg, #ff0080, #00ffff, #8b5cf6, #39ff14, #ff6600)',
        'shimmer-overlay': 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
      },
      backgroundSize: {
        '200%': '200% 200%',
        '300%': '300% 300%',
      },
      backdropBlur: {
        'gaming': '20px',
      },
      boxShadow: {
        'neon-sm': '0 0 5px currentColor',
        'neon': '0 0 10px currentColor, 0 0 20px currentColor',
        'neon-lg': '0 0 15px currentColor, 0 0 30px currentColor, 0 0 45px currentColor',
        'cyber': '0 0 20px rgba(0, 102, 255, 0.5), inset 0 0 20px rgba(0, 102, 255, 0.1)',
        'gaming': '0 10px 30px rgba(255, 107, 157, 0.3), 0 0 20px rgba(255, 107, 157, 0.2)',
      },
      blur: {
        'gaming': '20px',
      },
    },
  },
  plugins: [],
} satisfies Config;