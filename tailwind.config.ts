import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        party: ["var(--font-party)", "Nunito", "sans-serif"],
      },
      colors: {
        party: {
          pink: "#EC4899",
          coral: "#F43F5E",
          gold: "#F59E0B",
          violet: "#8B5CF6",
          cream: "#FFF7ED",
          rose: "#FFE4E6",
        },
      },
      backgroundImage: {
        "party-gradient": "linear-gradient(135deg, #FFF7ED 0%, #FFE4E6 50%, #F3E8FF 100%)",
        "party-mesh": "radial-gradient(at 40% 20%, #FFE4E6 0px, transparent 50%), radial-gradient(at 80% 0%, #F3E8FF 0px, transparent 50%), radial-gradient(at 0% 50%, #FFF7ED 0px, transparent 50%)",
      },
      boxShadow: {
        party: "0 4px 20px -2px rgba(236, 72, 153, 0.15), 0 0 0 1px rgba(236, 72, 153, 0.05)",
        "party-lg": "0 10px 40px -10px rgba(236, 72, 153, 0.2), 0 0 0 1px rgba(236, 72, 153, 0.08)",
      },
    },
  },
  plugins: [],
};
export default config;
