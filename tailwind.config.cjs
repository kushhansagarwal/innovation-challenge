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
      },
    ],
  },

  plugins: [daisyui]
};

module.exports = config;
