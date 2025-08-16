import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      spacing: {
        '18': '4.5rem',   // 72px
        '22': '5.5rem',   // 88px
        '26': '6.5rem',   // 104px
        '30': '7.5rem',   // 120px
        '34': '8.5rem',   // 136px
        '38': '9.5rem',   // 152px
        '42': '10.5rem',  // 168px
        '46': '11.5rem',  // 184px
        '50': '12.5rem',  // 200px
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // iOS color system
        'ios-gray': {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#eeeeee',
          300: '#e0e0e0',
          400: '#bdbdbd',
          500: '#9e9e9e',
          600: '#757575',
          700: '#424242',
          800: '#212121',
          900: '#111111',
        },
        'ios-blue': '#007AFF',
        'ios-green': '#34C759',
        'ios-orange': '#FF9500',
        'ios-red': '#FF3B30',
        'ios-purple': '#AF52DE',
        'ios-pink': '#FF2D92',
        'ios-teal': '#5AC8FA',
        'ios-indigo': '#5856D6',
        'ios-yellow': '#FFCC00',
        'ios-mint': '#00C7BE',
      },
      animation: {
        'ios-fade-in': 'ios-fade-in 0.6s ease-out',
        'ios-slide-up': 'ios-slide-up 0.6s cubic-bezier(0.25, 0.8, 0.25, 1)',
        'ios-scale-in': 'ios-scale-in 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        'float': 'float 3s ease-in-out infinite',
        'fade-in': 'fade-in 0.8s ease-out',
        'scale-in': 'scale-in 0.5s ease-out',
      },
      keyframes: {
        'ios-fade-in': {
          'from': {
            opacity: '0',
            transform: 'translateY(20px)',
          },
          'to': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        'ios-slide-up': {
          'from': {
            opacity: '0',
            transform: 'translateY(30px)',
          },
          'to': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        'ios-scale-in': {
          'from': {
            opacity: '0',
            transform: 'scale(0.8)',
          },
          'to': {
            opacity: '1',
            transform: 'scale(1)',
          },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
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
      },
      backgroundImage: {
        'ios-gradient': 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
        'ios-gradient-subtle': 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
        'ios-gradient-blue': 'linear-gradient(135deg, #007AFF 0%, #0056b3 100%)',
        'ios-gradient-green': 'linear-gradient(135deg, #34C759 0%, #28a745 100%)',
      },
      boxShadow: {
        'ios-sm': '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
        'ios': '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)',
        'ios-md': '0 4px 8px rgba(0, 0, 0, 0.12), 0 2px 4px rgba(0, 0, 0, 0.08)',
        'ios-lg': '0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)',
        'ios-xl': '0 14px 28px rgba(0, 0, 0, 0.15), 0 10px 10px rgba(0, 0, 0, 0.12)',
        'ios-button': '0 4px 8px rgba(0, 122, 255, 0.3), 0 1px 3px rgba(0, 122, 255, 0.15)',
        'ios-button-hover': '0 6px 12px rgba(0, 122, 255, 0.4), 0 2px 4px rgba(0, 122, 255, 0.2)',
      },
      borderRadius: {
        'ios': '12px',
        'ios-lg': '16px',
        'ios-xl': '20px',
      },
      fontFamily: {
        'ios': ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', 'sans-serif'],
      },
      letterSpacing: {
        'ios': '-0.01em',
        'ios-tight': '-0.02em',
      },
    },
  },
  plugins: [],
} satisfies Config;