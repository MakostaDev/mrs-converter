const saved = localStorage.getItem("theme");
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
const theme = saved || (prefersDark ? "dark" : "light");
document.documentElement.setAttribute("data-theme", theme);
