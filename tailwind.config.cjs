const daisyui = require("daisyui");

/** @type {import('tailwindcss').Config}*/
const config = {
  content: ["./src/**/*.{html,js,svelte,ts}"],

  theme: {
    extend: {}
  },

  daisyui: {
    themes: [
      {
        kuhnelo : {
          "primary": "#f35f13",
          "primary-content": "#fff",
          "neutral": "#ffffff",
          "base-100": "#141718",
          "base-200": "#232627",
          "base-300": "#343839",
        },
        ucla : {
          "primary": "#2774AE",
          "primary-content": "white",
          "secondary": "#FFD100",
          "secondary-content": "black",
          "accent": "#000000",
          "accent-content": "white",
          "warning": "#dc2626",
          "neutral": "#ffffff",
          "base-100": "#1E1E1E",
          "base-200": "#333333",
          "base-300": "#4D4D4D",
        }
      },
    ],
  },

  plugins: [daisyui]
};

module.exports = config;
