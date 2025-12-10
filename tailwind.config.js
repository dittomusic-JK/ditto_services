/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "ditto-colors-light-dark-active-green":
          "var(--ditto-colors-light-dark-active-green)",
        "ditto-colors-light-dark-ditto-background-white":
          "var(--ditto-colors-light-dark-ditto-background-white)",
        "ditto-colors-light-dark-ditto-border-grey":
          "var(--ditto-colors-light-dark-ditto-border-grey)",
        "ditto-colors-light-dark-ditto-inactive-variant":
          "var(--ditto-colors-light-dark-ditto-inactive-variant)",
        "ditto-colors-light-dark-ditto-labels-yellow":
          "var(--ditto-colors-light-dark-ditto-labels-yellow)",
        "ditto-colors-light-dark-ditto-light-blue":
          "var(--ditto-colors-light-dark-ditto-light-blue)",
        "ditto-colors-light-dark-ditto-light-grey":
          "var(--ditto-colors-light-dark-ditto-light-grey)",
        "ditto-colors-light-dark-ditto-mid-button-grey":
          "var(--ditto-colors-light-dark-ditto-mid-button-grey)",
        "ditto-colors-light-dark-ditto-orange":
          "var(--ditto-colors-light-dark-ditto-orange)",
        "ditto-colors-light-dark-ditto-pro-green":
          "var(--ditto-colors-light-dark-ditto-pro-green)",
        "ditto-colors-light-dark-ditto-purple":
          "var(--ditto-colors-light-dark-ditto-purple)",
        "ditto-colors-light-dark-ditto-red":
          "var(--ditto-colors-light-dark-ditto-red)",
        "ditto-colors-light-dark-ditto-starter-puple":
          "var(--ditto-colors-light-dark-ditto-starter-puple)",
        "ditto-colors-light-dark-ditto-subtext-grey":
          "var(--ditto-colors-light-dark-ditto-subtext-grey)",
        "ditto-colors-light-dark-ditto-text-fill":
          "var(--ditto-colors-light-dark-ditto-text-fill)",
        "ditto-colors-light-dark-ditto-text-prompt":
          "var(--ditto-colors-light-dark-ditto-text-prompt)",
      },
      fontFamily: {
        "poppins-bold-11px": "var(--poppins-bold-11px-font-family)",
      },
    },
  },
  plugins: [],
};
