module.exports = {
    content: ['./{pages,components}/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {},
    },
    plugins: [require("daisyui")],
    daisyui: {
        themes: ["cmyk"]
    }
}
