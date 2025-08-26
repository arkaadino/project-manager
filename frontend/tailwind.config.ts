// // tailwind.config.ts
// import type { Config } from 'tailwindcss'

// const config: Config = {
//   darkMode: ["class", "dark"],
//   content: [
//     "./pages/**/*.{ts,tsx}",
//     "./components/**/*.{ts,tsx}",
//     "./app/**/*.{ts,tsx}",
//     "./src/**/*.{ts,tsx}",
//   ],
//   prefix: "",
//   theme: {
//     container: {
//       center: true,
//       padding: "2rem",
//       screens: {
//         "2xl": "1400px",
//       },
//     },
//     extend: {
//       colors: {
//         border: "hsl(var(--border))",
//         input: "hsl(var(--input))",
//         ring: "hsl(var(--ring))",
//         background: "hsl(var(--background))",
//         foreground: "hsl(var(--foreground))",
        
//         // Brand Colors - Your Project Manager Theme
//         primary: {
//           50: '#ecfeff',
//           100: '#cffafe',
//           200: '#a5f3fc',
//           300: '#67e8f9',
//           400: '#22d3ee',
//           500: '#06b6d4', // Main brand color
//           600: '#0891b2',
//           700: '#0e7490',
//           800: '#155e75',
//           900: '#164e63',
//           950: '#083344',
//           DEFAULT: '#06b6d4',
//           foreground: '#ffffff',
//         },
        
//         // Secondary brand color (complementary)
//         secondary: {
//           50: '#eff6ff',
//           100: '#dbeafe',
//           200: '#bfdbfe',
//           300: '#93c5fd',
//           400: '#60a5fa',
//           500: '#3b82f6',
//           600: '#2563eb',
//           700: '#1d4ed8',
//           800: '#1e40af',
//           900: '#1e3a8a',
//           950: '#172554',
//           DEFAULT: '#3b82f6',
//           foreground: '#ffffff',
//         },
        
//         // Accent colors for status, priorities, etc.
//         accent: {
//           50: '#f0fdf4',
//           100: '#dcfce7',
//           200: '#bbf7d0',
//           300: '#86efac',
//           400: '#4ade80',
//           500: '#22c55e',
//           600: '#16a34a',
//           700: '#15803d',
//           800: '#166534',
//           900: '#14532d',
//           950: '#052e16',
//           DEFAULT: '#22c55e',
//           foreground: '#ffffff',
//         },
        
//         // Status colors
//         status: {
//           planning: '#64748b',    // slate-500
//           progress: '#3b82f6',    // blue-500
//           review: '#f59e0b',      // amber-500
//           completed: '#22c55e',   // green-500
//           hold: '#ef4444',        // red-500
//         },
        
//         // Priority colors
//         priority: {
//           low: '#22c55e',      // green-500
//           medium: '#f59e0b',   // amber-500
//           high: '#ef4444',     // red-500
//         },
        
//         // Dark theme specific colors
//         dark: {
//           50: '#f8fafc',
//           100: '#f1f5f9',
//           200: '#e2e8f0',
//           300: '#cbd5e1',
//           400: '#94a3b8',
//           500: '#64748b',
//           600: '#475569',
//           700: '#334155',
//           800: '#1e293b',
//           900: '#0f172a',
//           950: '#020617',
//         },
        
//         // Keep existing shadcn colors
//         destructive: {
//           DEFAULT: "hsl(var(--destructive))",
//           foreground: "hsl(var(--destructive-foreground))",
//         },
//         muted: {
//           DEFAULT: "hsl(var(--muted))",
//           foreground: "hsl(var(--muted-foreground))",
//         },
//         popover: {
//           DEFAULT: "hsl(var(--popover))",
//           foreground: "hsl(var(--popover-foreground))",
//         },
//         card: {
//           DEFAULT: "hsl(var(--card))",
//           foreground: "hsl(var(--card-foreground))",
//         },
//       },
//       borderRadius: {
//         lg: "var(--radius)",
//         md: "calc(var(--radius) - 2px)",
//         sm: "calc(var(--radius) - 4px)",
//       },
//       keyframes: {
//         "accordion-down": {
//           from: { height: "0" },
//           to: { height: "var(--radix-accordion-content-height)" },
//         },
//         "accordion-up": {
//           from: { height: "var(--radix-accordion-content-height)" },
//           to: { height: "0" },
//         },
//         "fade-in": {
//           "0%": { opacity: "0", transform: "translateY(10px)" },
//           "100%": { opacity: "1", transform: "translateY(0)" },
//         },
//         "slide-in": {
//           "0%": { transform: "translateX(-100%)" },
//           "100%": { transform: "translateX(0)" },
//         },
//       },
//       animation: {
//         "accordion-down": "accordion-down 0.2s ease-out",
//         "accordion-up": "accordion-up 0.2s ease-out",
//         "fade-in": "fade-in 0.3s ease-out",
//         "slide-in": "slide-in 0.3s ease-out",
//       },
//     },
//   },
//   plugins: [
//     // Use dynamic import instead of require
//     (await import('tailwindcss-animate')).default,
//   ],
// }

// export default config