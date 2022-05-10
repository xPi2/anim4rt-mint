module.exports = {
  content: ["./{pages,components}/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        "hero-pattern": "url('/jungle-animals.png')",
      },
      colors: {
        orange: "#5C2700",
        brown: "#FFB14E",
      },
    },
    fontFamily: {
      roboto: ["Roboto", "sans-serif"],
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        anim4rt: {
          primary: "#DC2626",
          neutral: "#f5f5f4",
          "base-100": "#000000",
        },
      },
      "cmyk",
    ],
  },
};
