// for download button and ToolBox Container 

(function () {
  const toolbox = document.createElement("div");
  toolbox.id = "toolbox-container";
  document.body.appendChild(toolbox);

  const style = document.createElement("style");
  style.textContent = `
    @media print {
      #toolbox-container {
        display: none !important;
      }
    }
  `;
  document.head.appendChild(style);

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
    transition: left 0.1s ease, top 0.1s ease;
  `;

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
    cursor: grab;
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
    <div style="margin-top: 10px;margin-bottom:10px; display: flex; gap: 10px;">
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

  function extractProductData() {
    const products = [];
    const allElements = document.querySelectorAll("body *");

    allElements.forEach((el) => {
      const text = el.innerText?.toLowerCase() || "";
      const hasPrice = /\$\d+|\d+(\.\d{2})? ?(usd|rs|inr|€|£)/i.test(text);
      const hasImage = el.querySelector("img");
      const hasTitle = el.querySelector("h1,h2,h3,h4");
      const hasLink = el.querySelector("a[href]");
      const price = text.match(/\$\d+|\d+(\.\d{2})? ?(usd|rs|inr|€|£)/i);

      if (hasPrice && hasImage && hasTitle) {
        products.push({
          title: hasTitle?.innerText.trim() || "",
          description: el.innerText.trim().slice(0, 300),
          image: hasImage?.src || "",
          url: hasLink?.href || window.location.href,
          price: price ? price[0] : "N/A",
        });
      }
    });

    return products;
  }

  formatSection.querySelector("#confirmBtn").addEventListener("click", () => {
    const format = formatSection.querySelector("#downloadFormat").value;
    toolbox.style.display = "none";

    setTimeout(() => {
      const filename = document.title.replace(/\s+/g, "_") + "_" + new Date().toISOString().slice(0, 16).replace(/[:T]/g, "-");

      const contentClone = document.body.cloneNode(true);
      const toolboxClone = contentClone.querySelector("#toolbox-container");
      if (toolboxClone) toolboxClone.remove();

      const getMainContentText = () => {
        const headings = document.querySelector("h1, h2, h3");
        if (headings) return headings.innerText.trim();
        const meta = document.querySelector("meta[name='description']");
        if (meta) return meta.content.slice(0, 300);
        return document.body.innerText.slice(0, 300);
      };

      if (format === "pdf") {
        window.print();
      } else {
        let blob, extension;
        if (format === "html") {
          blob = new Blob(["<!DOCTYPE html>" + contentClone.innerHTML], { type: "text/html" });
          extension = "html";
        } else if (format === "json") {
          const data = extractProductData();
          const jsonData = data.length > 0 ? data : [{
            title: document.title,
            url: window.location.href,
            timestamp: new Date().toISOString(),
            content: getMainContentText(),
          }];
          blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: "application/json" });
          extension = "json";
        } else {
          blob = new Blob([getMainContentText()], { type: "text/plain" });
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

  let isDragging = false, offsetX = 0, offsetY = 0;

  const startDrag = (x, y) => {
    isDragging = true;
    offsetX = x - toolbox.offsetLeft;
    offsetY = y - toolbox.offsetTop;
    document.body.style.overflow = "hidden";
    document.body.style.userSelect = "none";
  };

  const stopDrag = () => {
    isDragging = false;
    document.body.style.overflow = "";
    document.body.style.userSelect = "";
  };

  const onDrag = (x, y) => {
    if (isDragging) {
      toolbox.style.left = `${x - offsetX}px`;
      toolbox.style.top = `${y - offsetY}px`;
    }
  };

  toolbox.addEventListener("mousedown", (e) => startDrag(e.clientX, e.clientY));
  document.addEventListener("mousemove", (e) => onDrag(e.clientX, e.clientY));
  document.addEventListener("mouseup", stopDrag);

  toolbox.addEventListener("touchstart", (e) => {
    const touch = e.touches[0];
    startDrag(touch.clientX, touch.clientY);
  });
  document.addEventListener("touchmove", (e) => {
    const touch = e.touches[0];
    onDrag(touch.clientX, touch.clientY);
  });
  document.addEventListener("touchend", stopDrag);
})();


// For Screenshot 
(function () {
  const ScreenshotTool = (function () {
    let toolbox, screenshotBtn, captureShotBtn, previewBox;

    function loadHtml2Canvas(callback) {
      const script = document.createElement("script");
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
      script.onload = callback;
      document.body.appendChild(script);
    }

    function createScreenshotButton() {
      screenshotBtn = document.createElement("button");
      screenshotBtn.textContent = "Screenshot";
      screenshotBtn.style.cssText = `
        width: 100%; padding: 10px; margin-bottom: 10px;
        font-weight: bold; background: #0ea5e9; color: white;
        border: none; border-radius: 6px; cursor: pointer;
      `;
      return screenshotBtn;
    }

    function createOptionsBox() {
      const box = document.createElement("div");
      box.style.display = "none";
      box.innerHTML = `
        <div style="margin-top: 10px">
          <label>Screenshot Type:</label>
          <select id="ssType" style="width:100%;padding:6px;border-radius:6px;">
            <option value="full">Full Webpage</option>
            <option value="custom">Custom Area</option>
          </select>
          <label style="display:block; margin:8px 0 4px;">Include Toolbox:</label>
          <select id="includeToolbox" style="width:100%;padding:6px;border-radius:6px;">
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
          <label style="display:block; margin:8px 0 4px;">Image Format:</label>
          <select id="imageFormat" style="width:100%;padding:6px;border-radius:6px;">
            <option value="png">PNG</option>
            <option value="jpeg">JPG</option>
            <option value="webp">WEBP</option>
          </select>
          <button id="captureShot" style="width:100%;margin-top:10px;padding:10px;background:#0f766e;color:white;border:none;border-radius:6px;">Capture</button>
        </div>
      `;
      return box;
    }

    function init() {
      toolbox = document.querySelector("#toolbox-container");
      if (!toolbox) return;

      const toolsArea = toolbox.querySelector("div:nth-child(2)");
      screenshotBtn = createScreenshotButton();
      toolsArea.appendChild(screenshotBtn);

      const optionsBox = createOptionsBox();
      toolsArea.appendChild(optionsBox);
      captureShotBtn = optionsBox.querySelector("#captureShot");

      screenshotBtn.onclick = () => {
        optionsBox.style.display = optionsBox.style.display === "block" ? "none" : "block";
      };

      captureShotBtn.onclick = () => {
        const type = optionsBox.querySelector("#ssType").value;
        const includeToolbox = optionsBox.querySelector("#includeToolbox").value === "yes";
        const format = optionsBox.querySelector("#imageFormat").value;

        screenshotBtn.disabled = true;
        captureShotBtn.disabled = true;

        if (type === "full") {
          captureFullScreenshot(includeToolbox, format);
        } else {
          startCustomSelection(includeToolbox, format);
        }
      };
    }

    function captureFullScreenshot(includeToolbox, format) {
      if (!includeToolbox) toolbox.style.display = "none";
      window.scrollTo(0, 0);
      html2canvas(document.body, {
        scale: 8,
        useCORS: true,
        windowWidth: document.documentElement.scrollWidth,
        windowHeight: document.documentElement.scrollHeight
      }).then(canvas => {
        if (!includeToolbox) toolbox.style.display = "block";
        showPreview(canvas, format);
      });
    }

    function startCustomSelection(includeToolbox, format) {
      const overlay = document.createElement("div");
      const selector = document.createElement("div");
      let startX, startY, isDragging = false;

      overlay.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0,0,0,0.1); z-index: 9998; touch-action: none;
      `;
      selector.style.cssText = `
        position: fixed; border: 2px dashed red; background: rgba(255,0,0,0.1);
        z-index: 9999;
      `;

      document.body.appendChild(overlay);
      document.body.appendChild(selector);

      function start(e) {
        isDragging = true;
        const x = e.touches ? e.touches[0].clientX : e.clientX;
        const y = e.touches ? e.touches[0].clientY : e.clientY;
        startX = x; startY = y;
        Object.assign(selector.style, { left: x + "px", top: y + "px", width: "0px", height: "0px" });
      }

      function move(e) {
        if (!isDragging) return;
        const x = e.touches ? e.touches[0].clientX : e.clientX;
        const y = e.touches ? e.touches[0].clientY : e.clientY;
        Object.assign(selector.style, {
          width: Math.abs(x - startX) + "px",
          height: Math.abs(y - startY) + "px",
          left: Math.min(x, startX) + "px",
          top: Math.min(y, startY) + "px"
        });
      }

      function end() {
        isDragging = false;
        const rect = selector.getBoundingClientRect();
        cleanup();

        if (!includeToolbox) toolbox.style.display = "none";

        html2canvas(document.body, {
          x: rect.left,
          y: rect.top,
          width: rect.width,
          height: rect.height,
          scale: 8,
          useCORS: true,
          scrollY: -window.scrollY
        }).then(canvas => {
          if (!includeToolbox) toolbox.style.display = "block";
          showPreview(canvas, format);
        });
      }

      function cleanup() {
        selector.remove();
        overlay.remove();
        ["mousedown", "mousemove", "mouseup", "touchstart", "touchmove", "touchend"].forEach(event =>
          document.removeEventListener(event, handlers[event])
        );
        screenshotBtn.disabled = false;
        captureShotBtn.disabled = false;
      }

      const handlers = {
        mousedown: start,
        mousemove: move,
        mouseup: end,
        touchstart: start,
        touchmove: move,
        touchend: end
      };

      Object.entries(handlers).forEach(([event, fn]) =>
        document.addEventListener(event, fn)
      );
    }

    function showPreview(canvas, format) {
      const dataURL = canvas.toDataURL("image/" + format, 1.0);
      previewBox = document.createElement("div");
      previewBox.style.cssText = `
        position: fixed; top: 10%; left: 50%; transform: translateX(-50%);
        background: white; padding: 10px; border-radius: 8px;
        box-shadow: 0 0 20px rgba(0,0,0,0.3); z-index: 10000;
        max-width: 90%; max-height: 80%; overflow: auto;
      `;

      const closeBtn = document.createElement("button");
      closeBtn.textContent = "×";
      closeBtn.style.cssText = `
        position: absolute; top: 4px; right: 10px;
        font-size: 22px; background: none; border: none; cursor: pointer;
      `;
      closeBtn.onclick = removePreview;

      const img = new Image();
      img.src = dataURL;
      img.style.cssText = `max-width: 100%; height: auto; border-radius: 6px; display: block;`;

      const btnWrapper = document.createElement("div");
      btnWrapper.style.cssText = "margin-top: 10px; text-align: center;";

      const downloadBtn = createDownloadButton(dataURL, format);
      const clipboardBtn = createClipboardButton(canvas, format);
      const cancelBtn = createCancelButton();

      [downloadBtn, clipboardBtn, cancelBtn].forEach(btn => btnWrapper.appendChild(btn));
      [closeBtn, img, btnWrapper].forEach(el => previewBox.appendChild(el));

      document.body.appendChild(previewBox);
    }

    function createDownloadButton(dataURL, format) {
      const btn = document.createElement("button");
      btn.textContent = `Download (${format.toUpperCase()})`;
      btn.style.cssText = "padding: 8px 16px; background: #22c55e; color: white; border: none; border-radius: 6px; margin-right: 10px;";
      btn.onclick = () => {
        const a = document.createElement("a");
        a.href = dataURL;
        a.download = `${location.hostname.replace(/\W+/g, "-")}-${document.title.trim().replace(/\W+/g, "-")}.${format}`;
        a.click();
      };
      return btn;
    }
    
    function createClipboardButton(canvas, format) {
      const btn = document.createElement("button");
      btn.textContent = "Copy to Clipboard";
      btn.style.cssText = "padding: 8px 16px; background: #0ea5e9; color: white; border: none; border-radius: 6px;";
      if (!window.ClipboardItem || !navigator.clipboard.write) {
        btn.disabled = true;
        btn.textContent = "Clipboard Not Supported";
      } else {
        btn.onclick = () => copyImageToClipboard(canvas, format);
      }
      return btn;
    }

    function createCancelButton() {
      const btn = document.createElement("button");
      btn.textContent = "Cancel";
      btn.style.cssText = "padding: 8px 16px; background: #ef4444; color: white; border: none; border-radius: 6px;";
      btn.onclick = removePreview;
      return btn;
    }

    function removePreview() {
      previewBox?.remove();
      screenshotBtn.disabled = false;
      captureShotBtn.disabled = false;
    }

    async function copyImageToClipboard(canvas, format) {
      try {
        const blob = await new Promise(resolve => canvas.toBlob(resolve, `image/${format}`));
        const clipboardItem = new ClipboardItem({ [`image/${format}`]: blob });
        await navigator.clipboard.write([clipboardItem]);
        alert("Image copied to clipboard!");
      } catch (err) {
        console.error("Clipboard copy failed:", err);
        alert("Failed to copy image.");
      }
    }

    return { init, loadHtml2Canvas };
  })();

  ScreenshotTool.loadHtml2Canvas(ScreenshotTool.init);
})();




// for screenshot understand

/*
(function () {
  const html2canvasScript = document.createElement("script");
  html2canvasScript.src = "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
  html2canvasScript.onload = initScreenshotTool;
  document.body.appendChild(html2canvasScript);

  function initScreenshotTool() {
    const toolbox = document.querySelector("#toolbox-container");
    if (!toolbox) return;

    const screenshotBtn = document.createElement("button");
    screenshotBtn.textContent = "Screenshot";
    screenshotBtn.style.cssText = `
      width: 100%; padding: 10px; margin-bottom: 10px;
      font-weight: bold; background: #0ea5e9; color: white;
      border: none; border-radius: 6px; cursor: pointer;
    `;

    const toolsArea = toolbox.querySelector("div:nth-child(2)");
    toolsArea.appendChild(screenshotBtn);

    const optionsBox = document.createElement("div");
    optionsBox.style.display = "none";
    optionsBox.innerHTML = `
      <div style="margin-top: 10px">
        <label>Screenshot Type:</label>
        <select id="ssType" style="width:100%;padding:6px;border-radius:6px;">
          <option value="full">Full Webpage</option>
          <option value="custom">Custom Area</option>
        </select>
        <label style="display:block; margin:8px 0 4px;">Include Toolbox:</label>
        <select id="includeToolbox" style="width:100%;padding:6px;border-radius:6px;">
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </select>
        <button id="captureShot" style="width:100%;margin-top:10px;padding:10px;background:#0f766e;color:white;border:none;border-radius:6px;">Capture</button>
      </div>
    `;
    toolsArea.appendChild(optionsBox);

    let captureShotBtn = optionsBox.querySelector("#captureShot");

    screenshotBtn.onclick = () => {
  const isVisible = optionsBox.style.display === "block";
  optionsBox.style.display = isVisible ? "none" : "block";
};

    captureShotBtn.onclick = autoCapture;

    function autoCapture() {
      const type = optionsBox.querySelector("#ssType").value;
      const includeToolbox = optionsBox.querySelector("#includeToolbox").value === "yes";
      screenshotBtn.disabled = true;
      captureShotBtn.disabled = true;

      if (type === "full") {
        if (!includeToolbox) toolbox.style.display = "none";
        html2canvas(document.body, { scale: 10, useCORS: true }).then(canvas => {
          if (!includeToolbox) toolbox.style.display = "block";
          showPreview(canvas.toDataURL("image/png", 1.0));
        });
      } else {
        selectCustomArea(includeToolbox);
      }
    }

    function selectCustomArea(includeToolbox) {
      const selector = document.createElement("div");
      selector.style.cssText = `
        position: fixed; border: 2px dashed red; background: rgba(255,0,0,0.1);
        z-index: 9999;
      `;
      document.body.appendChild(selector);

      let startX, startY, isDragging = false;

      function start(e) {
        isDragging = true;
        const x = e.touches ? e.touches[0].clientX : e.clientX;
        const y = e.touches ? e.touches[0].clientY : e.clientY;
        startX = x; startY = y;
        selector.style.left = x + "px";
        selector.style.top = y + "px";
      }

      function move(e) {
        if (!isDragging) return;
        const x = e.touches ? e.touches[0].clientX : e.clientX;
        const y = e.touches ? e.touches[0].clientY : e.clientY;
        selector.style.width = Math.abs(x - startX) + "px";
        selector.style.height = Math.abs(y - startY) + "px";
        selector.style.left = Math.min(x, startX) + "px";
        selector.style.top = Math.min(y, startY) + "px";
      }

      function end() {
        isDragging = false;
        const rect = selector.getBoundingClientRect();
        selector.remove();

        if (!includeToolbox) toolbox.style.display = "none";

        html2canvas(document.body, {
          x: rect.left,
          y: rect.top,
          width: rect.width,
          height: rect.height,
          scale: 10,
          useCORS: true,
          scrollY: -window.scrollY
        }).then(canvas => {
          if (!includeToolbox) toolbox.style.display = "block";
          showPreview(canvas.toDataURL("image/png", 1.0));
        });

        document.removeEventListener("mousedown", start);
        document.removeEventListener("mousemove", move);
        document.removeEventListener("mouseup", end);
        document.removeEventListener("touchstart", start);
        document.removeEventListener("touchmove", move);
        document.removeEventListener("touchend", end);
      }

      document.addEventListener("mousedown", start);
      document.addEventListener("mousemove", move);
      document.addEventListener("mouseup", end);
      document.addEventListener("touchstart", start);
      document.addEventListener("touchmove", move);
      document.addEventListener("touchend", end);
    }

    function showPreview(dataURL) {
      const previewBox = document.createElement("div");
      previewBox.style.cssText = `
        position: fixed; top: 10%; left: 50%; transform: translateX(-50%);
        background: white; padding: 10px; border-radius: 8px;
        box-shadow: 0 0 20px rgba(0,0,0,0.3); z-index: 10000;
        max-width: 90%; max-height: 80%; overflow: auto;
      `;

      const closeBtn = document.createElement("button");
      closeBtn.textContent = "×";
      closeBtn.style.cssText = `
        position: absolute; top: 4px; right: 10px;
        font-size: 22px; background: none; border: none; cursor: pointer;
      `;
      closeBtn.onclick = () => {
        previewBox.remove();
        screenshotBtn.disabled = false;
        captureShotBtn.disabled = false;
      };

      const img = new Image();
      img.src = dataURL;
      img.style.cssText = `max-width: 100%; height: auto; border-radius: 6px; display: block;`;

      const btnWrapper = document.createElement("div");
      btnWrapper.style.cssText = "margin-top: 10px; text-align: center;";

      const downloadBtn = document.createElement("button");
      downloadBtn.textContent = "Download (10k)";
      downloadBtn.style.cssText = "padding: 8px 16px; background: #22c55e; color: white; border: none; border-radius: 6px; margin-right: 10px;";
      downloadBtn.onclick = () => {
        downloadImage(dataURL);
        setTimeout(() => {
          showPreview(dataURL);
        }, 500);
      };

      const cancelBtn = document.createElement("button");
      cancelBtn.textContent = "Cancel";
      cancelBtn.style.cssText = "padding: 8px 16px; background: #ef4444; color: white; border: none; border-radius: 6px;";
      cancelBtn.onclick = () => {
        previewBox.remove();
        screenshotBtn.disabled = false;
        captureShotBtn.disabled = false;
      };

      btnWrapper.appendChild(downloadBtn);
      btnWrapper.appendChild(cancelBtn);
      previewBox.appendChild(closeBtn);
      previewBox.appendChild(img);
      previewBox.appendChild(btnWrapper);
      document.body.appendChild(previewBox);
    }

    function downloadImage(dataURL) {
      const a = document.createElement("a");
      const siteName = window.location.hostname.replace("www.", "").split(".")[0];
      const pageTitle = document.title.replace(/[^a-zA-Z0-9]/g, '_');
      const filename = `${siteName}-${pageTitle}-screenshot.png`;

      a.href = dataURL;
      a.download = filename;
      a.click();
    }
  }
})();

*/



