/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Ditto Framework Colors
        "ditto-black": "var(--ditto-black)",
        "ditto-grey": "var(--ditto-grey)",
        "ditto-blue": "var(--blue)",
        "ditto-purple": "var(--brand-primary)",
        "ditto-starter": "var(--ditto-starter)",
        "ditto-pro": "var(--ditto-pro)",
        "ditto-label": "var(--ditto-label)",
        "faded-grey": "var(--faded-grey)",
        "light-grey": "var(--light-grey)",
        "lighter-grey": "var(--lighter-grey)",
        "medium-grey": "var(--medium-grey)",
        "dark-grey": "var(--dark-grey)",
        "brand-border": "var(--brand-border)",
        "brand-secondary": "var(--brand-secondary)",
        "success": "var(--success)",
        "error": "var(--error)",
        "warning": "var(--warning)",
        "info": "var(--info)",
        // Legacy Anima tokens
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
        "satoshi": ["Satoshi", "Helvetica", "Arial", "sans-serif"],
        "poppins": ["Poppins", "Helvetica", "Arial", "sans-serif"],
      },
      fontSize: {
        // Ditto Framework Typography
        "h1": ["3rem", { lineHeight: "3.5rem", letterSpacing: "-0.04em" }],
        "h2": ["1.75rem", { lineHeight: "2.25rem", letterSpacing: "-1px" }],
        "h3": ["1.5rem", { lineHeight: "2rem" }],
        "h4": ["1.125rem", { lineHeight: "1.25rem" }],
        "h5": ["0.875rem", { lineHeight: "1.3125rem", letterSpacing: "2px" }],
        "h6": ["0.625rem", { lineHeight: "1rem", letterSpacing: "0.1em" }],
        "body": ["1rem", { lineHeight: "1.65rem" }],
        "lead": ["1.25rem", { lineHeight: "2rem" }],
      },
      borderRadius: {
        "button": "2rem",
        "card": "1.25rem",
      },
    },
  },
  plugins: [],
};
