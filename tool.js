// for download button and ToolBox Container 

(function () {
  const toolbox = document.createElement("div");
  toolbox.id = "toolbox-container";
  document.body.appendChild(toolbox);

  // Styling
  toolbox.style.cssText = `
    position: fixed;
    top: 100px;
    left: 20px;
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(10px);
    border: 1px solid #ddd;
    border-radius: 10px;
    box-shadow: 0 4px 16px rgba(0,0,0,0.1);
    width: 220px;
    z-index: 9999;
    font-family: 'Segoe UI', sans-serif;
    user-select: none;
  `;

  // Header
  const header = document.createElement("div");
  header.innerHTML = `<strong style="padding-left:10px;">Smart Toolbox</strong>`;
  header.style.cssText = `
    background: #4f46e5;
    color: white;
    padding: 10px;
    font-size: 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: grap;
    border-radius: 10px 10px 0 0;
  `;

  const toggleBtn = document.createElement("button");
  toggleBtn.textContent = "–";
  toggleBtn.style.cssText = `
    background: transparent;
    border: none;
    color: white;
    font-size: 18px;
    margin-right: 8px;
    cursor: pointer;
  `;
  header.appendChild(toggleBtn);
  toolbox.appendChild(header);
const buttonContainer = document.createElement("div");



const closeBtn = document.createElement("button");
closeBtn.textContent = "×";
closeBtn.style.cssText = `
  background: transparent;
  border: none;
  color: white;
  font-size: 20px;
  margin-right: 8px;
  cursor: pointer;
`;


buttonContainer.appendChild(closeBtn);
header.appendChild(buttonContainer);

// Minimize toggle

// Close functionality
closeBtn.addEventListener("click", () => {
  toolbox.style.display = "none";
});


  const toolsArea = document.createElement("div");
  toolsArea.style.cssText = `padding: 12px; transition: 0.3s ease;`;
  toolbox.appendChild(toolsArea);

  const downloadBtn = document.createElement("button");
  downloadBtn.textContent = "Download";
  downloadBtn.style.cssText = `
    width: 100%;
    padding: 10px;
    margin-bottom: 10px;
    font-weight: bold;
    background: linear-gradient(135deg, #6366f1, #3b82f6);
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
  `;
  toolsArea.appendChild(downloadBtn);

  const formatSection = document.createElement("div");
  formatSection.style.display = "none";
  formatSection.innerHTML = `
    <label style="display:block; margin: 6px 0;">Choose format:</label>
    <select id="downloadFormat" style="width: 100%; padding: 6px; border-radius: 6px;">
      <option value="pdf">PDF</option>
      <option value="html">HTML</option>
      <option value="json">JSON</option>
      <option value="txt">TXT</option>
    </select>
    <div style="margin-top: 10px; display: flex; gap: 10px;">
      <button id="confirmBtn" style="flex:1; padding:6px; background:#10b981; color:white; border:none; border-radius:6px;">Confirm</button>
      <button id="cancelBtn" style="flex:1; padding:6px; background:#ef4444; color:white; border:none; border-radius:6px;">Close</button>
    </div>
  `;
  toolsArea.appendChild(formatSection);

  downloadBtn.addEventListener("click", () => {
    formatSection.style.display = formatSection.style.display === "none" ? "block" : "none";
  });

  toggleBtn.addEventListener("click", () => {
    const isHidden = toolsArea.style.display === "none";
    toolsArea.style.display = isHidden ? "block" : "none";
    formatSection.style.display = "none";
    toggleBtn.textContent = isHidden ? "–" : "+";
  });

  formatSection.querySelector("#confirmBtn").addEventListener("click", () => {
    const format = formatSection.querySelector("#downloadFormat").value;
    toolbox.style.display = "none";

    setTimeout(() => {
      const filename = document.title.replace(/\s+/g, "_") + "_" + new Date().toISOString().slice(0, 16).replace(/[:T]/g, "-");
      const contentClone = document.body.cloneNode(true);
      const toolboxClone = contentClone.querySelector("#toolbox-container");
      if (toolboxClone) toolboxClone.remove();

      if (format === "pdf") {
        window.print();
      } else {
        let blob, extension;
        if (format === "html") {
          blob = new Blob(["<!DOCTYPE html>" + contentClone.innerHTML], { type: "text/html" });
          extension = "html";
        } else if (format === "json") {
          const pageData = {
            title: document.title,
            url: window.location.href,
            timestamp: new Date().toISOString(),
            sample: contentClone.innerText.slice(0, 300),
          };
          blob = new Blob([JSON.stringify(pageData, null, 2)], { type: "application/json" });
          extension = "json";
        } else {
          blob = new Blob([contentClone.innerText], { type: "text/plain" });
          extension = "txt";
        }

        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename + "." + extension;
        a.click();
        URL.revokeObjectURL(url);
      }

      toolbox.style.display = "block";
      formatSection.style.display = "none";
    }, 300);
  });

  formatSection.querySelector("#cancelBtn").addEventListener("click", () => {
    formatSection.style.display = "none";
  });

// For mouse events (laptop/desktop)
// Add CSS transition for smooth movement
toolbox.style.transition = 'left 0.1s ease, top 0.1s ease';

// For touch events (mobile)
toolbox.addEventListener("touchstart", (e) => {
  isDragging = true;
  const touch = e.touches[0];
  offsetX = touch.clientX - toolbox.offsetLeft;
  offsetY = touch.clientY - toolbox.offsetTop;
  document.body.style.userSelect = "none"; // Prevent text selection during dragging
});

document.addEventListener("touchmove", (e) => {
  if (isDragging) {
    const touch = e.touches[0];
    toolbox.style.left = `${touch.clientX - offsetX}px`;
    toolbox.style.top = `${touch.clientY - offsetY}px`;
  }
});

document.addEventListener("touchend", () => {
  isDragging = false;
  document.body.style.userSelect = "";
});

// For mouse events (laptop/desktop)
toolbox.addEventListener("mousedown", (e) => {
  isDragging = true;
  offsetX = e.clientX - toolbox.offsetLeft;
  offsetY = e.clientY - toolbox.offsetTop;
  document.body.style.userSelect = "none"; // Prevent text selection during dragging
});

document.addEventListener("mousemove", (e) => {
  if (isDragging) {
    toolbox.style.left = `${e.clientX - offsetX}px`;
    toolbox.style.top = `${e.clientY - offsetY}px`;
  }
});

document.addEventListener("mouseup", () => {
  isDragging = false;
  document.body.style.userSelect = "";
});
})();

