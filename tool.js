// for download button and ToolBox Container 

(function () {
  const toolbox = document.createElement("div");
  toolbox.id = "toolbox-container";
  document.body.appendChild(toolbox);

  // Styling
  toolbox.style.cssText = `
    position: fixed;
    top: 400px;
    right: 20px;
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(10px);
    border: 1px solid #ddd;
    border-radius: 10px;
    box-shadow: 0 4px 16px rgba(0,0,0,0.1);
    width: 220px;
    z-index: 9999;
    font-family: 'Segoe UI', sans-serif;
    user-select: none;
    display:flex;
    flex-direction:column;
    justify-content:space-evenly;
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


// for screenshot understand 

(function () {
  const waitForToolbox = setInterval(() => {
    const toolbox = document.getElementById("toolbox-container");
    if (!toolbox) return;

    clearInterval(waitForToolbox);
    const toolsArea = toolbox.querySelector("div:nth-child(2)");

    const screenshotBtn = document.createElement("button");
    screenshotBtn.textContent = "Screenshot";
    screenshotBtn.style.cssText = `
      width: 100%;
      margin-top:10px;
      padding: 10px;
      margin-bottom: 10px;
      font-weight: bold;
      background: linear-gradient(135deg, #22c55e, #16a34a);
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
    `;
    toolsArea.appendChild(screenshotBtn);

    const optionsBox = document.createElement("div");
    optionsBox.style.display = "none";
    optionsBox.innerHTML = `
      <label style="display:block;margin:6px 0;">Select Screenshot Type:</label>
      <button id="fullShot" style="width:100%;padding:6px;margin-bottom:5px;background:#3b82f6;color:white;border:none;border-radius:6px;">Full Page</button>
      <button id="customShot" style="width:100%;padding:6px;background:#ef4444;color:white;border:none;border-radius:6px;">Select Area</button>
    `;
    toolsArea.appendChild(optionsBox);

    screenshotBtn.addEventListener("click", () => {
      optionsBox.style.display = optionsBox.style.display === "none" ? "block" : "none";
    });

    function loadHtml2Canvas(callback) {
      if (window.html2canvas) return callback();
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js";
      script.onload = callback;
      document.body.appendChild(script);
    }

    function showPreview(canvas) {
      const previewOverlay = document.createElement("div");
      previewOverlay.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
        background: rgba(0,0,0,0.7); z-index: 999999;
        display: flex; justify-content: center; align-items: center;
        flex-direction: column; padding: 20px;
      `;

      const previewImg = new Image();
      previewImg.src = canvas.toDataURL("image/png");
      previewImg.style.maxWidth = "90%";
      previewImg.style.maxHeight = "80%";
      previewImg.style.border = "4px solid white";
      previewImg.style.borderRadius = "10px";

      const btns = document.createElement("div");
      btns.style.marginTop = "15px";

      const downloadBtn = document.createElement("button");
      downloadBtn.textContent = "Download";
      downloadBtn.style.cssText = `
        padding: 10px 16px; background: #22c55e; color: white;
        border: none; border-radius: 6px; margin-right: 10px;
        font-weight: bold;
      `;

      const cancelBtn = document.createElement("button");
      cancelBtn.textContent = "Cancel";
      cancelBtn.style.cssText = `
        padding: 10px 16px; background: #ef4444; color: white;
        border: none; border-radius: 6px; font-weight: bold;
      `;

      btns.appendChild(downloadBtn);
      btns.appendChild(cancelBtn);
      previewOverlay.appendChild(previewImg);
      previewOverlay.appendChild(btns);
      document.body.appendChild(previewOverlay);

      downloadBtn.onclick = () => {
        const link = document.createElement("a");
        link.href = canvas.toDataURL("image/png");
        link.download = "screenshot.png";
        link.click();
        previewOverlay.remove();
      };

      cancelBtn.onclick = () => {
        previewOverlay.remove();
      };
    }

    optionsBox.querySelector("#fullShot").addEventListener("click", () => {
      optionsBox.style.display = "none";
      loadHtml2Canvas(() => {
        html2canvas(document.body, {
          scale: 3 // higher resolution
        }).then(canvas => {
          showPreview(canvas);
        });
      });
    });

    optionsBox.querySelector("#customShot").addEventListener("click", () => {
      optionsBox.style.display = "none";

      const overlay = document.createElement("div");
      overlay.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
        background: rgba(0,0,0,0.2); z-index: 999999; cursor: crosshair;
      `;
      document.body.appendChild(overlay);

      let startX, startY, box;

      function start(e) {
        startX = (e.touches ? e.touches[0].clientX : e.clientX);
        startY = (e.touches ? e.touches[0].clientY : e.clientY);

        box = document.createElement("div");
        box.style.cssText = `
          position: absolute; border: 2px dashed red;
          background: rgba(255,255,255,0.3);
        `;
        overlay.appendChild(box);

        document.addEventListener("mousemove", draw);
        document.addEventListener("mouseup", end);
        document.addEventListener("touchmove", draw);
        document.addEventListener("touchend", end);
      }

      function draw(e) {
        const x = (e.touches ? e.touches[0].clientX : e.clientX);
        const y = (e.touches ? e.touches[0].clientY : e.clientY);
        const left = Math.min(x, startX);
        const top = Math.min(y, startY);
        const width = Math.abs(x - startX);
        const height = Math.abs(y - startY);

        Object.assign(box.style, {
          left: left + "px",
          top: top + "px",
          width: width + "px",
          height: height + "px"
        });
      }

      function end() {
        const rect = box.getBoundingClientRect();
        overlay.remove();
        document.removeEventListener("mousemove", draw);
        document.removeEventListener("mouseup", end);
        document.removeEventListener("touchmove", draw);
        document.removeEventListener("touchend", end);

        loadHtml2Canvas(() => {
          html2canvas(document.body, {
            x: rect.left,
            y: rect.top,
            width: rect.width,
            height: rect.height,
            windowWidth: document.documentElement.scrollWidth,
            windowHeight: document.documentElement.scrollHeight,
            scale: 3
          }).then(canvas => {
            showPreview(canvas);
          });
        });
      }

      overlay.addEventListener("mousedown", start);
      overlay.addEventListener("touchstart", start);
    });
  }, 500);
})();