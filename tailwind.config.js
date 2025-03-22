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
                    "0%": { width: "0%", visibility: "hidden" },
                    "100%": { width: "100%" },
                },
                blink: {
                    "50%": { borderColor: "transparent" },
                    "100%": { borderColor: "white" },
                },
                fadeIn: {
                    "0%": { opacity: 0 },
                    "100%": { opacity: 1 },
                },
                fadeOut: {
                    "0%": { opacity: 1 },
                    "100%": { opacity: 0 },
                },
                fadeInSlow: {
                    "0%": { opacity: 0 },
                    "50%": { opacity: 0 },
                    "100%": { opacity: 1 },
                },
                fadeOutSlow: {
                    "0%": { opacity: 1 },
                    "50%": { opacity: 1 },
                    "100%": { opacity: 0 },
                },
                countdownFade: {
                    "0%": { opacity: 1, transform: "scale(1.2)" },
                    "100%": { opacity: 0, transform: "scale(0.8)" },
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
                    "0%": {
                        transform:
                            "translateX(-100%) translateY(-50%) scaleX(-1)",
                    },
                    "50%": {
                        transform:
                            "translateX(-100%) translateY(-50%) scaleX(-1)",
                    },
                    "100%": {
                        transform:
                            "translateX(-1000%) translateY(-50%) scaleX(-1)",
                    },
                },
                exitRight: {
                    "0%": { transform: "translateX(100%) translateY(-50%)" },
                    "50%": { transform: "translateX(100%) translateY(-50%)" },
                    "100%": { transform: "translateX(1000%) translateY(-50%)" },
                },
                slideInFromCenter: {
                    "0%": { clipPath: "inset(0 500% 0 500%)", opacity: 1 },
                    "100%": { clipPath: "inset(0 0 0 0)", opacity: 1 },
                },
            },
            animation: {
                fadein: "fadeIn 3s ease-in-out",
                fadeinslow: "fadeInSlow 3s ease-in-out",
                fadeinslower: "fadeInSlow 7s ease-in-out",
                fadeout: "fadeOut 3s ease-in-out",
                fadeoutslow: "fadeOutSlow 3s ease-in-out",
                fadeoutslower: "fadeOutSlow 4s ease-in-out",
                typing: "typing 1s steps(100)",
                typingslow: "typing 3s steps(100) 0s",
                typingslowleaving: "typing 3s steps(100) 0s 1 reverse",
                slideInLeft: "slideInLeft 4s ease-in-out infinite",
                slideInRight: "slideInRight 4s ease-in-out infinite",
                exitLeft: "exitLeft 3s ease-in-out forwards",
                exitRight: "exitRight 3s ease-in-out forwards",
                slideInFromCenter: "slideInFromCenter 2s ease-in-out forwards",
                countdownFade: "countdownFade 1s ease-in-out",
            },
        },
    },
    plugins: [require("tailwindcss-animate")],
};
