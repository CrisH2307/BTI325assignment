module.exports = {
  content: [`./views/**/*.ejs`],
  theme: {
    extend: {
      fontFamily: {
        fantasy: ["Fantasy"],
      },
    },
  },
  daisyui: {
    themes: ["cupcake"],
  },
  plugins: [require("daisyui"), require("@tailwindcss/typography")],
};
