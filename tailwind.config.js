/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: "class",
    content: ["./src/**/*.{ts,tsx}"],
    theme: {
        extend: {
            colors: {
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                primary: {
                    DEFAULT: "hsl(var(--primary))",
                    foreground: "hsl(var(--primary-foreground))",
                },
                secondary: {
                    DEFAULT: "hsl(var(--secondary))",
                    foreground: "hsl(var(--secondary-foreground))",
                },
                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                accent: {
                    DEFAULT: "hsl(var(--accent))",
                    foreground: "hsl(var(--accent-foreground))",
                },
                popover: {
                    DEFAULT: "hsl(var(--popover))",
                    foreground: "hsl(var(--popover-foreground))",
                },
                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                },
            },
            borderRadius: {
                lg: `var(--radius)`,
                md: `calc(var(--radius) - 2px)`,
                sm: "calc(var(--radius) - 4px)",
            },
            keyframes: {
                typing: {
                    "0%": {
                        width: "0%",
                        visibility: "hidden",
                    },
                    "100%": {
                        width: "100%",
                    },
                },
                blink: {
                    "50%": {
                        borderColor: "transparent",
                    },
                    "100%": {
                        borderColor: "white",
                    },
                },
                "fade-in": {
                    "0%": { opacity: 0 },
                    "100%": { opacity: 1 },
                },
                "fade-out": {
                    "0%": { opacity: 0 },
                    "100%": { opacity: 1 },
                },
                slideInLeft: {
                    "0%": { transform: "translateX(-100vw)" },
                    "50%": { transform: "translateX(0)" },
                    "100%": { transform: "translateX(-100vw)" },
                },
                slideInRight: {
                    "0%": { transform: "translateX(100vw)" },
                    "50%": { transform: "translateX(0)" },
                    "100%": { transform: "translateX(100vw)" },
                },
                exitLeft: {
                    "0%": { transform: "translateX(-100%) scaleX(-1)" },
                    "50%": { transform: "translateX(-100%) scaleX(-1)" },
                    "100%": { transform: "translateX(-1000%) scaleX(-1)" }, // Moves to the left
                },
                exitRight: {
                    "0%": { transform: "translateX(100%)" },
                    "50%": { transform: "translateX(100%)" },
                    "100%": { transform: "translateX(1000%)" }, // Moves to the right
                },
                slideInFromCenter: {
                    "0%": {
                        clipPath: "inset(0 50% 0 50%)", // Initially hide the text from the sides
                        opacity: 1, // Make the text visible after 4 seconds
                    },
                    "100%": {
                        clipPath: "inset(0 0 0 0)", // Reveal the text completely from the center
                        opacity: 1, // Make the text visible after 4 seconds
                    },
                },
            },
            animation: {
                fadein: "fade-in 3s ease-in-out ",
                fadeout: "fade-out 3s ease-in-out ",
                typing: "typing 1s steps(100) ",
                typingslow: "typing 3s steps(100) 0s",
                typingslowleaving: "typing 3s steps(100) 0s 1 reverse",
                slideInLeft: "slideInLeft 4s ease-in-out infinite",
                slideInRight: "slideInRight 4s ease-in-out infinite",
                exitLeft: "exitLeft 4s ease-in-out forwards", // Apply exit animation to the left video
                exitRight: "exitRight 4s ease-in-out forwards", // Apply exit animation to the right video
                slideInFromCenter: "slideInFromCenter 1s ease-out 2s forwards", // Delay 4s before starting the animation
            },
        },
    },
    plugins: [require("tailwindcss-animate")],
};
