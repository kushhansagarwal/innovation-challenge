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
          "accent": "white",
          "accent-content": "#1E1E1E",
          "warning": "#dc2626",
          "neutral": "#ffffff",
          "base-100": "#1E1E1E",
          "base-200": "#333333",
          "base-300": "#4D4D4D",
        },
        ucla_light : {
          "primary": "#2774AE",
          "primary-content": "#1E1E1E",
          "secondary": "#FFD100",
          "secondary-content": "black",
          "accent": "#1E1E1E",
          "accent-content": "white",
          "warning": "#dc2626",
          "neutral": "#ffffff",
          "base-100": "#ffffff",
          "base-200": "#f7f7f7",
          "base-300": "#e5e5e5",
        }
      },
    ],
  },

  plugins: [daisyui]
};

module.exports = config;
