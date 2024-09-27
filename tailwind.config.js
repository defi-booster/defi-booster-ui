const { nextui } = require("@nextui-org/react")

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {},
    },
    darkMode: "class",
    plugins: [
        nextui({
            themes: {
                dark: {
                    colors: {
                        primary: {
                            DEFAULT: "#FFFFFF",
                            foreground: "#000000",
                        },
                        danger: "#D40000",
                        success: {
                            DEFAULT: "#BEF264",
                            foreground: "#000000",
                        },
                        focus: "#BEF264",
                        background: "black",
                    },
                },
                light: {
                    colors: {
                        primary: {
                            // DEFAULT: "#D40000",
                            DEFAULT: "#000000",
                            foreground: "#000000",
                        },
                        danger: "#D40000",
                        success: {
                            DEFAULT: "#BEF264",
                            foreground: "#000000",
                        },
                        focus: "#BEF264",
                        background: "white",
                    },
                },
            },
        }),
    ],
}
