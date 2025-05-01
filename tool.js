
(function () {
  // ========== [DOWNLOAD COMPONENT START] ==========

  // Create UI
  const toolbox = document.createElement("div");
  toolbox.id = "toolbox-download";
  toolbox.style.cssText = `
  position: fixed; top: 50%; right: 0;
  transform: translateY(-50%);
  background: #fff; padding: 12px; border-radius: 10px 0 0 10px;
  box-shadow: 0 0 10px rgba(0,0,0,0.15); z-index: 9999;
  font-family: sans-serif;
`;

  toolbox.innerHTML = `
    <button id="downloadBtn">Download</button>
    <div id="downloadOptions" style="display:none; margin-top: 10px;">
      <label>Select format:</label><br/>
      <select id="downloadFormat">
        <option value="pdf">PDF</option>
        <option value="html">HTML</option>
        <option value="json">JSON</option>
      </select><br/>
      <button id="confirmDownload">Confirm</button>
      <button id="cancelDownload">Cancel</button>
    </div>
  `;

  document.body.appendChild(toolbox);

  // ========== [EVENT HANDLERS START] ==========
  const downloadBtn = document.getElementById("downloadBtn");
  const downloadOptions = document.getElementById("downloadOptions");
  const formatSelect = document.getElementById("downloadFormat");
  const confirmBtn = document.getElementById("confirmDownload");
  const cancelBtn = document.getElementById("cancelDownload");

  downloadBtn.onclick = () => {
    downloadOptions.style.display = "block";
  };

  cancelBtn.onclick = () => {
    downloadOptions.style.display = "none";
  };

  confirmBtn.onclick = () => {
    const format = formatSelect.value;

    // Clone body for safe manipulation
    const content = document.body.cloneNode(true);
    const toolboxClone = content.querySelector("#toolbox-download");
    if (toolboxClone) toolboxClone.remove(); // hide toolbox in downloads

    if (format === "pdf") {
      // Simple way to let browser print
      toolbox.style.display = "none";
      window.print();
      setTimeout(() => (toolbox.style.display = ""), 1000);
    }

    else if (format === "html") {
      const htmlBlob = new Blob(["<!DOCTYPE html>" + content.innerHTML], {
        type: "text/html",
      });
      const url = URL.createObjectURL(htmlBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "page.html";
      a.click();
      URL.revokeObjectURL(url);
    }

    else if (format === "json") {
      const pageData = {
        title: document.title,
        url: window.location.href,
        timestamp: new Date().toISOString(),
        contentSample: content.innerText.slice(0, 300),
      };
      const jsonBlob = new Blob([JSON.stringify(pageData, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(jsonBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "page.json";
      a.click();
      URL.revokeObjectURL(url);
    }

    downloadOptions.style.display = "none";
  };
  // ========== [EVENT HANDLERS END] ==========

  // ========== [DOWNLOAD COMPONENT END] ==========
})();
