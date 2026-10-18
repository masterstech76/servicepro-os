import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          900: "var(--navy-900, #0F172A)",
          800: "var(--navy-800, #1E293B)",
          700: "var(--navy-700, #334155)",
        },
        orange: {
          500: "var(--orange-500, #F97316)",
          600: "var(--orange-600, #EA580C)",
          700: "var(--orange-700, #C2410C)",
          50: "var(--orange-50, #FFF7ED)",
        },
        slate: {
          50: "var(--slate-50, #F8FAFC)",
          100: "var(--slate-100, #F1F5F9)",
          200: "var(--slate-200, #E2E8F0)",
          500: "var(--slate-500, #64748B)",
        },
        status: {
          unassigned: "#F59E0B",
          assigned: "#3B82F6",
          on_the_way: "#8B5CF6",
          in_progress: "#F97316",
          completed: "#16A34A",
          cancelled: "#94A3B8",
        },
        success: "var(--success, #16A34A)",
        danger: "var(--danger, #DC2626)",
        info: "var(--info, #2563EB)",
      },
      borderRadius: {
        input: "10px",
        card: "14px",
        sheet: "20px",
      },
      boxShadow: {
        sm: "0 1px 2px rgba(15, 23, 42, 0.06)",
        md: "0 8px 24px rgba(15, 23, 42, 0.14)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
