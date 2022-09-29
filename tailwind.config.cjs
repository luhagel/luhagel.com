/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    fontFamily: {
      sans: ['"Darker Grotesque"'],
    },
    extend: {
      colors: {
        twitter: "#1DA1F2",
        linkedin: "#0072b1",
        twitch: "#6441a5",
        pilotblue: "#4F94E4",
        base: "#EFF1F5",
        neutral: "#4C4F69",
        primary: "#179299",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
