// Load Theme on page load
window.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");
    document.getElementById("toolbox").classList.add("dark");
  }
});

// Theme Toggle
document.querySelector(".theme-toggle").addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  document.getElementById("toolbox").classList.toggle("dark");

  localStorage.setItem("theme", document.body.classList.contains("dark-mode") ? "dark" : "light");
});

// Minimize Toggle
const toolbox = document.getElementById("toolbox");
const minimizeBtn = document.getElementById("minimizeBtn");

minimizeBtn.addEventListener("click", () => {
  toolbox.classList.toggle("minimized");
  toolbox.classList.toggle("expanded");

  minimizeBtn.textContent = toolbox.classList.contains("minimized") ? "+" : "−";
});

// Tool Actions
const toolActions = {
  highlighter: {
    active: false,
    activate: () => console.log("Highlighter ON"),
    deactivate: () => console.log("Highlighter OFF")
  },
  print: {
    active: false,
    activate: () => window.print(),
    deactivate: () => {}
  },
  download: {
    active: false,
    activate: () => {
      const blob = new Blob(["Downloaded from Smart Toolbox"], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "smart-toolbox.txt";
      a.click();
      URL.revokeObjectURL(url);
    },
    deactivate: () => {}
  }
};

// Handle Button Toggle
document.querySelectorAll(".tool-btn").forEach(btn => {
  const tool = btn.dataset.tool;
  if (!tool) return;

  btn.addEventListener("click", () => {
    const t = toolActions[tool];
    if (!t) return;

    t.active = !t.active;
    btn.classList.toggle("active", t.active);

    if (t.active) t.activate();
    else t.deactivate();
  });
});