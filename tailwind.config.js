/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/tabs/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/assets/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  daisyui: {
    themes: [
      {
        topicker: {
          primary: "#f97316",
          secondary: "#0e7490",
          accent: "#eab308",
          neutral: "#313131",
          "base-100": "#181818",
          info: "#7dd3fc",
          success: "#84cc16",
          warning: "#fca5a5",
          error: "#ef4444",
        },
      },
    ],
  },
  plugins: [require("daisyui")],
};
