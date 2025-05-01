// ========== [THEME TOGGLE COMPONENT] ==========
document.querySelector(".theme-toggle").addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  document.getElementById("toolbox").classList.toggle("dark");

  localStorage.setItem("theme", document.body.classList.contains("dark-mode") ? "dark" : "light");
});

window.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");
    document.getElementById("toolbox").classList.add("dark");
  }
});
// ========== [END THEME TOGGLE COMPONENT] ==========


// ========== [MINIMIZE / EXPAND COMPONENT] ==========
const toolbox = document.getElementById("toolbox");
const minimizeBtn = document.getElementById("minimizeBtn");

minimizeBtn.addEventListener("click", () => {
  toolbox.classList.toggle("minimized");
  toolbox.classList.toggle("expanded");

  minimizeBtn.textContent = toolbox.classList.contains("minimized") ? "+" : "−";
});
// ========== [END MINIMIZE / EXPAND COMPONENT] ==========


// ========== [TOOL ACTIONS COMPONENT] ==========
const toolActions = {
  highlighter: {
    active: false,
    activate: () => console.log("Highlighter ON"),
    deactivate: () => console.log("Highlighter OFF")
  },

  // Print Page excluding Toolbox
  print: {
    active: false,
    activate: () => {
      const toolbox = document.getElementById("toolbox");
      toolbox.style.display = "none";
      window.print();
      setTimeout(() => (toolbox.style.display = ""), 1000);
    },
    deactivate: () => {}
  },

  // Download Text File
  download: {
    active: false,
    activate: () => {
      const toolbox = document.getElementById("toolbox");
      toolbox.style.display = "none";

      const blob = new Blob(["Downloaded from Smart Toolbox"], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "smart-toolbox.txt";
      a.click();
      URL.revokeObjectURL(url);

      setTimeout(() => (toolbox.style.display = ""), 1000);
    },
    deactivate: () => {}
  }
};

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
// ========== [END TOOL ACTIONS COMPONENT] ==========


// ========== [DRAG & DROP TOOLBOX COMPONENT] ==========
const dragHandle = document.getElementById("dragHandle");

let isDragging = false;
let offsetX, offsetY;

dragHandle.addEventListener("mousedown", (e) => {
  isDragging = true;
  offsetX = e.clientX - toolbox.offsetLeft;
  offsetY = e.clientY - toolbox.offsetTop;
  dragHandle.style.cursor = "grabbing";
});

document.addEventListener("mouseup", () => {
  isDragging = false;
  dragHandle.style.cursor = "grab";
});

document.addEventListener("mousemove", (e) => {
  if (!isDragging) return;
  toolbox.style.top = `${e.clientY - offsetY}px`;
  toolbox.style.left = `${e.clientX - offsetX}px`;
  toolbox.style.right = "auto";
  toolbox.style.transform = "none";
});
// ========== [END DRAG & DROP TOOLBOX COMPONENT] ==========