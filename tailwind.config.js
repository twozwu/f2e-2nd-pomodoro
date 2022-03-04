module.exports = {
  content: ["index.html", "./src/**/*.{js,jsx,ts,tsx,vue,html}"],
  theme: {
    extend: {
      colors: {
        //自訂顏色
        primary: {
          DEFAULT: "#304030", //primayr
        },
        secondary: {
          DEFAULT: "#F08448",
        },
        thirdly: "#6C9460",
      },
    },
  },
  plugins: [],
};
