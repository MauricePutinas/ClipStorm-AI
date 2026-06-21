import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/lib/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: {
        "2xl": "1280px",
      },
    },
    extend: {
      colors: {
        // ClipStorm Markenpalette: Dark Navy, Cyan, Electric Blue, dezentes Rot
        navy: {
          DEFAULT: "#0a0f1e",
          50: "#1b2540",
          100: "#161f38",
          200: "#121a30",
          300: "#0e1628",
          400: "#0b1120",
          500: "#0a0f1e",
          600: "#080c18",
          700: "#060912",
          800: "#04060c",
          900: "#020308",
        },
        cyan: {
          DEFAULT: "#22d3ee",
          glow: "#67e8f9",
        },
        electric: {
          DEFAULT: "#3b82f6",
          deep: "#2563eb",
        },
        accent: {
          red: "#ef4444",
        },
        border: "hsl(217 33% 18%)",
        input: "hsl(217 33% 16%)",
        ring: "hsl(189 94% 53%)",
        background: "#0a0f1e",
        foreground: "#e2e8f0",
        card: {
          DEFAULT: "#0e1628",
          foreground: "#e2e8f0",
        },
        muted: {
          DEFAULT: "#121a30",
          foreground: "#94a3b8",
        },
        primary: {
          DEFAULT: "#22d3ee",
          foreground: "#04060c",
        },
        secondary: {
          DEFAULT: "#3b82f6",
          foreground: "#f8fafc",
        },
        destructive: {
          DEFAULT: "#ef4444",
          foreground: "#fef2f2",
        },
      },
      borderRadius: {
        lg: "0.75rem",
        md: "0.5rem",
        sm: "0.375rem",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(34,211,238,0.15), 0 8px 40px -12px rgba(34,211,238,0.35)",
        "glow-blue": "0 0 0 1px rgba(59,130,246,0.18), 0 8px 40px -12px rgba(59,130,246,0.4)",
        card: "0 1px 0 0 rgba(255,255,255,0.04) inset, 0 8px 30px -16px rgba(0,0,0,0.8)",
      },
      backgroundImage: {
        "grid-faint":
          "linear-gradient(to right, rgba(148,163,184,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,0.06) 1px, transparent 1px)",
        "hero-glow":
          "radial-gradient(60% 60% at 50% 0%, rgba(34,211,238,0.18) 0%, rgba(59,130,246,0.06) 40%, transparent 70%)",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.5s ease-out both",
        shimmer: "shimmer 1.5s infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
