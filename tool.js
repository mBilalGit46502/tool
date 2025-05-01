// ========== [DOWNLOAD FUNCTIONALITY COMPONENT] ==========

const toolboxElement = document.getElementById("toolbox");
const downloadBtn = document.getElementById("downloadBtn");
const downloadOptions = document.getElementById("downloadOptions");
const confirmDownload = document.getElementById("confirmDownload");
const cancelDownload = document.getElementById("cancelDownload");
const formatSelect = document.getElementById("downloadFormat");

downloadBtn.addEventListener("click", () => {
  downloadOptions.classList.toggle("hidden");
});

// Cancel Option
cancelDownload.addEventListener("click", () => {
  downloadOptions.classList.add("hidden");
});

// Confirm Download
confirmDownload.addEventListener("click", () => {
  const format = formatSelect.value;
  const content = document.body.cloneNode(true);

  // Hide toolbox from content
  const toolboxClone = content.querySelector("#toolbox");
  if (toolboxClone) toolboxClone.remove();

  if (format === "pdf") {
    // Use print-to-pdf (simple API-free approach)
    toolboxElement.style.display = "none";
    window.print();
    setTimeout(() => (toolboxElement.style.display = ""), 1000);
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
    // Example JSON (customizable later)
    const pageData = {
      title: document.title,
      url: window.location.href,
      date: new Date().toLocaleString(),
      contentPreview: content.innerText.slice(0, 200)
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

  downloadOptions.classList.add("hidden");
});

// ========== [END DOWNLOAD FUNCTIONALITY COMPONENT] ==========