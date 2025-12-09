export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        sidebar: "#050608",
        sidebarSoft: "#101318",
        brand: "#22c55e",
        brandSoft: "#e7f7ee",
        paleBg: "#edf5fb",
        card: "#ffffff",
      },
      boxShadow: {
        soft: "0 18px 45px rgba(15, 23, 42, 0.10)",
      },
      borderRadius: {
        "3xl": "1.75rem",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
