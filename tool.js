(function () {
  // ========== [SMART TOOLBOX CONTAINER START] ==========
  const toolbox = document.createElement("div");
  toolbox.id = "toolbox-container"; // Main toolbox container
  toolbox.style.cssText = `
    position: fixed;
    top: 50%;
    right: 0;
    transform: translateY(-50%);
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    padding: 20px;
    border-radius: 15px 0 0 15px;
    box-shadow: -6px 6px 24px rgba(0,0,0,0.2);
    font-family: 'Segoe UI', sans-serif;
    color: #333;
    z-index: 9999;
    width: 280px;
    display: block;
  `;
  document.body.appendChild(toolbox); // Append the toolbox to the body

  // ========== [TOOL CHILDREN (Download Button)] ==========
  const toolboxTitle = document.createElement("div");
  toolboxTitle.innerHTML = `
    <strong style="font-size: 18px; font-weight: bold;">Smart Toolbox</strong>
  `;
  toolbox.appendChild(toolboxTitle); // Append to toolbox

  // Create Download Button with hover and gradient effect
  const downloadBtn = document.createElement("button");
  downloadBtn.textContent = "Download Options";
  downloadBtn.style.cssText = `
    background: linear-gradient(90deg, #6A11CB 0%, #2575FC 100%);
    color: #fff;
    border: none;
    padding: 15px;
    width: 100%;
    margin-top: 16px;
    cursor: pointer;
    border-radius: 8px;
    font-size: 16px;
    transition: background 0.3s ease;
  `;
  downloadBtn.onmouseover = () => {
    downloadBtn.style.background = "linear-gradient(90deg, #2575FC 0%, #6A11CB 100%)";
  };
  downloadBtn.onmouseout = () => {
    downloadBtn.style.background = "linear-gradient(90deg, #6A11CB 0%, #2575FC 100%)";
  };
  toolbox.appendChild(downloadBtn); // Append to toolbox

  // Create a format selection dropdown with elegant styling
  const downloadSelectContainer = document.createElement("div");
  downloadSelectContainer.style.cssText = `
    margin-top: 12px;
    display: none; /* Initially hidden */
  `;
  const downloadFormatLabel = document.createElement("label");
  downloadFormatLabel.textContent = "Select Format:";
  downloadFormatLabel.style.cssText = `
    font-size: 14px;
    color: #444;
  `;
  const downloadSelect = document.createElement("select");
  downloadSelect.style.cssText = `
    width: 100%;
    padding: 10px;
    border-radius: 8px;
    font-size: 14px;
    border: 1px solid #ddd;
    margin-top: 8px;
    transition: border 0.2s ease;
  `;
  downloadSelect.onfocus = () => {
    downloadSelect.style.border = "1px solid #2575FC";
  };
  downloadSelect.onblur = () => {
    downloadSelect.style.border = "1px solid #ddd";
  };
  downloadSelect.innerHTML = `
    <option value="pdf">PDF</option>
    <option value="html">HTML</option>
    <option value="json">JSON</option>
    <option value="txt">TXT</option>
  `;
  downloadSelectContainer.appendChild(downloadFormatLabel);
  downloadSelectContainer.appendChild(downloadSelect);
  toolbox.appendChild(downloadSelectContainer); // Append to toolbox

  // ========== [DOWNLOAD FUNCTIONALITY START] ==========
  downloadBtn.onclick = () => {
    // Show the format selection options when the user clicks the button
    downloadSelectContainer.style.display = downloadSelectContainer.style.display === "none" ? "block" : "none";
  };

  downloadBtn.addEventListener("click", () => {
    // Reset the download select container if already visible
    downloadSelectContainer.style.display = "block";
  });

  // Handle the download functionality based on selected format
  downloadSelect.addEventListener("change", () => {
    const format = downloadSelect.value;
    const contentClone = document.body.cloneNode(true);
    const toolboxClone = contentClone.querySelector("#toolbox-container");
    if (toolboxClone) toolboxClone.remove(); // Remove the toolbox from the content before downloading

    const filename = document.title.replace(/\s+/g, '_') + '_' + new Date().toISOString().slice(0, 16).replace(/[:T]/g, '-');

    if (format === "pdf") {
      window.print(); // Simulated PDF download (you can improve with actual PDF libraries if needed)
    } else if (format === "html") {
      const blob = new Blob([ "<!DOCTYPE html>" + contentClone.innerHTML ], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename + ".html";
      a.click();
      URL.revokeObjectURL(url);
    } else if (format === "json") {
      const pageData = {
        title: document.title,
        url: window.location.href,
        timestamp: new Date().toISOString(),
        sample: contentClone.innerText.slice(0, 300),
      };
      const blob = new Blob([ JSON.stringify(pageData, null, 2) ], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename + ".json";
      a.click();
      URL.revokeObjectURL(url);
    } else if (format === "txt") {
      const blob = new Blob([ contentClone.innerText ], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename + ".txt";
      a.click();
      URL.revokeObjectURL(url);
    } else {
      alert("Invalid format! Please select pdf, html, json, or txt.");
    }

    // Hide the options after download
    downloadSelectContainer.style.display = "none";
  });

  // ========== [DOWNLOAD FUNCTIONALITY END] ==========
})();