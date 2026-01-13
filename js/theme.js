const toggle = document.getElementById("themeToggle");

function applyTheme(theme) {
  document.body.classList.add("theme-transition");

  if (theme === "dark") {
    document.body.classList.add("dark");
    toggle.innerText = "☀️";
  } else {
    document.body.classList.remove("dark");
    toggle.innerText = "🌙";
  }

  localStorage.setItem("theme", theme);

  setTimeout(() => {
    document.body.classList.remove("theme-transition");
  }, 600);
}

/* TOGGLE CLICK */
toggle.addEventListener("click", () => {
  const isDark = document.body.classList.contains("dark");
  applyTheme(isDark ? "light" : "dark");
});

/* LOAD SAVED THEME */
const savedTheme = localStorage.getItem("theme") || "light";
applyTheme(savedTheme);
