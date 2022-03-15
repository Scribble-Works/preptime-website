module.exports = {
  mode: "jit",
  purge: {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    options: {
      safelist: [/^[\w:]*bg-yellow-/, /^bg-yellow-/],
    },
  },

  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      backgroundImage: () => ({
        person1: "url('/src/assets/testimonials/person1.png')",
        person2: "url('/src/assets/testimonials/person2.png')",
        person3: "url('/src/assets/testimonials/person3.png')",
        cta: "url('/src/assets/cta/bg-cta.png')",
        "hero-5": "url('/src/assets/heros/hero5background.svg')",
        "register-page":
          "url('/src/assets/register-pages/register-background.png');",
        "3d-mockup": "url('/src/assets/features/mockupbackground.svg');",
        "trans-grad": "url('/src/assets/features/transparentgrad.svg');",
        cta6: "url('/src/assets/cta/cta6back.jpg')",
      }),
      cursor: {
        grab: "grabbing",
      },
      fontFamily: {
        "dm-sans": ["DMSans", "sans-serif"],
      },
      colors: {
        // Configuration theme colors
        "slate-light": "#F9F9F9", // theme: slate, background color
        "slate-orange": "#FF5930", // theme: slate, primary orange
        "slate-headline": "#1C202B", // theme: slate, headline color
        "slate-body": "#2C3242", // theme: slate, body text color
        "slate-blue": "rgba(67, 83, 255, 1)", // theme: slate, primary blue
        "feeling-moody-start": "#E1ECF6", // theme: slate, start of gradient
        "feeling-moody-end": "#F0E3E3", // theme: slate, end of gradient
        "slate-border": "rgba(25, 49, 60, 0.1)", // theme: slate, end of the border
        "brand-pink": "rgb(233, 30, 99)",
      },
      boxShadow: {
        slight: "0px 13px 19px 8px #C8DDE53B",
      },
      fontSize: {
        "desktop-h1": "48px;",
        "desktop-h2": "42px",
        "desktop-subheading": "21px",
        "desktop-h4": "20px",
        "desktop-paragraph": "18px",
        "mobile-h2": "32px",
        "mobile-h1": "38px",
        "mobile-h3": "26px",
      },
      maxWidth: {
        default: "1146px",
      },
      padding: {
        mob: "24px",
      },
    },
  },

  variants: {
    extend: {
      textColor: ["active"],
    },
  },
  plugins: [],
};
