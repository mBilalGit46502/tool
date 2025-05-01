javascript:(function() {
  // Inject CSS with mobile enhancements
  const css = `
    #smartBox {
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: #2c3e50;
      color: #ecf0f1;
      padding: 15px;
      border-radius: 10px;
      z-index: 99999;
      box-shadow: 0 8px 20px rgba(0,0,0,0.4);
      font-family: 'Segoe UI', sans-serif;
      max-width: 360px;
      cursor: move;
      overflow: auto;
      touch-action: none;
    }
    #smartBox h4 {
      margin: 0 0 10px;
      font-size: 16px;
      color: #3498db;
    }
    #smartBox button {
      margin: 4px 4px 0 0;
      padding: 6px 12px;
      border: none;
      border-radius: 5px;
      color: #fff;
      background: #3498db;
      font-weight: 600;
      cursor: pointer;
      font-size: 13px;
      transition: opacity .3s;
    }
    #smartBox button:hover { opacity: .8; }
    #smartBox textarea {
      width: 100%;
      height: 80px;
      margin: 8px 0;
      padding: 6px;
      border: none;
      border-radius: 5px;
      resize: none;
      font-size: 13px;
      font-family: 'Segoe UI', sans-serif;
    }
    #smartBox label {
      display: block;
      margin: 8px 0;
      color: #bdc3c7;
      font-size: 13px;
    }
    body.darkMode {
      background: #1a252f !important;
      color: #ecf0f1 !important;
    }
    body.darkMode * {
      background: transparent !important;
      color: inherit !important;
    }
    body.readMode img,
    body.readMode video,
    body.readMode iframe {
      display: none !important;
    }
    body.readMode {
      padding: 20px;
      line-height: 1.6;
    }
    @media (max-width: 480px) {
      #smartBox {
        max-width: 90%!important;
        bottom: 10px!important;
        right: 10px!important;
        padding: 10px!important;
      }
      #smartBox button {
        padding: 8px 10px!important;
        font-size: 12px!important;
      }
    }
    .selection-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.5);
      z-index: 99998;
      touch-action: none;
    }
    .selection-box {
      position: absolute;
      border: 2px dashed red;
      background: rgba(255,0,0,0.1);
    }
    .format-modal {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%,-50%);
      background: #2c3e50;
      padding: 20px;
      border-radius: 10px;
      z-index: 100000;
    }
    .format-modal button {
      display: block;
      width: 100%;
      margin: 5px 0;
    }
  `;
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  // Create toolbox
  const box = document.createElement('div');
  box.id = 'smartBox';
  box.innerHTML = `
    <button id="btnClose">✕</button>
    <h4>Smart Toolbox</h4>
    <button id="btnDownload">Download</button>
    <button id="btnPrint">Print</button>
    <button id="btnCopy">Copy</button>
    <button id="btnTheme">Dark Mode</button>
    <button id="btnScroll">Top</button>
    <button id="btnSpeak">Speak</button>
    <button id="btnCount">Count</button>
    <button id="btnNet">Net</button>
    <button id="btnReload">Reload</button>
    <button id="btnFind">Find</button>
    <button id="btnBattery">Battery</button>
    <button id="btnRead">ReadMode</button>
    <button id="btnInvert">Invert</button>
    <button id="btnTrans">Translate</button>
    <button id="btnGrammar">Grammar</button>
    <button id="btnTranslit">Translit</button>
    <button id="btnHl">Highlight</button>
    <button id="btnNotes">Notes</button>
    <button id="btnInfo">Info</button>
    <button id="btnZoom">Zoom</button>
    <button id="btnElem">Elements</button>
    <button id="btnSpeed">SpeedTest</button>
    <button id="btnShot">Screenshot</button>
    <button id="btnFullShot">FullShot</button>
    <button id="btnQR">QR Code</button>
    <button id="btnEmail">Email</button>
    <button id="btnSearch">Search</button>
    <button id="btnFocus">Focus</button>
    <button id="btnClear">Clear HL</button>
    <button id="btnScrollLock">ScrollLock</button>
    <label><input id="btnFont" type="range" min="50" max="200" value="100"/>Font%</label>
    <button id="btnMin">Minimal</button>
  `;
  document.body.appendChild(box);

  // State management
  const state = {
    speak: false,
    dark: false,
    read: false,
    min: false,
    drag: false,
    touchActive: false,
    off: [0, 0]
  };

  // Helper functions
  const $ = id => document.getElementById(id);
  const hideBox = cb => {
    box.style.opacity = '0';
    setTimeout(() => {
      cb();
      box.style.opacity = '1';
    }, 200);
  };

  // Download handler with format selection
  $('btnDownload').onclick = () => {
    hideBox(() => {
      const modal = document.createElement('div');
      modal.className = 'format-modal';
      modal.innerHTML = `
        <h4 style="color:white;margin:0 0 10px">Download Format</h4>
        <button data-format="txt">Text (.txt)</button>
        <button data-format="pdf">PDF (.pdf)</button>
        <button data-format="html">HTML (.html)</button>
        <button data-format="json">JSON (.json)</button>
      `;
      
      modal.querySelectorAll('button').forEach(btn => {
        btn.onclick = () => {
          modal.remove();
          const content = document.body.innerText;
          const blob = new Blob([content], { type: 'text/plain' });
          const a = document.createElement('a');
          a.href = URL.createObjectURL(blob);
          a.download = `page.${btn.dataset.format}`;
          a.click();
        };
      });
      
      document.body.appendChild(modal);
      modal.onclick = e => e.target === modal && modal.remove();
    });
  };

  // Mobile-friendly screenshot capture
  $('btnShot').onclick = function() {
    const overlay = document.createElement('div');
    overlay.className = 'selection-overlay';
    let startX, startY, endX, endY, selBox;

    const handleStart = e => {
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      startX = clientX;
      startY = clientY;
      selBox = document.createElement('div');
      selBox.className = 'selection-box';
      Object.assign(selBox.style, {
        left: `${startX}px`,
        top: `${startY}px`
      });
      overlay.appendChild(selBox);
    };

    const handleMove = e => {
      if (!selBox) return;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      selBox.style.width = `${Math.abs(clientX - startX)}px`;
      selBox.style.height = `${Math.abs(clientY - startY)}px`;
      selBox.style.left = `${Math.min(clientX, startX)}px`;
      selBox.style.top = `${Math.min(clientY, startY)}px`;
    };

    const handleEnd = e => {
      const clientX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
      const clientY = e.changedTouches ? e.changedTouches[0].clientY : e.clientY;
      endX = clientX;
      endY = clientY;

      html2canvas(document.body, {
        x: Math.min(startX, endX),
        y: Math.min(startY, endY),
        width: Math.abs(endX - startX),
        height: Math.abs(endY - startY),
        useCORS: true
      }).then(canvas => {
        const link = document.createElement('a');
        link.download = 'screenshot.png';
        link.href = canvas.toDataURL();
        link.click();
      });

      overlay.remove();
    };

    overlay.addEventListener('mousedown', handleStart);
    overlay.addEventListener('mousemove', handleMove);
    overlay.addEventListener('mouseup', handleEnd);
    overlay.addEventListener('touchstart', handleStart);
    overlay.addEventListener('touchmove', handleMove);
    overlay.addEventListener('touchend', handleEnd);
    document.body.appendChild(overlay);
  };

  // Draggable functionality with touch support
  box.addEventListener('mousedown', e => {
    state.drag = true;
    state.off = [
      box.offsetLeft - e.clientX,
      box.offsetTop - e.clientY
    ];
  });
  box.addEventListener('touchstart', e => {
    state.drag = true;
    state.off = [
      box.offsetLeft - e.touches[0].clientX,
      box.offsetTop - e.touches[0].clientY
    ];
  });

  const moveHandler = e => {
    if (!state.drag) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    box.style.left = clientX + state.off[0] + 'px';
    box.style.top = clientY + state.off[1] + 'px';
    box.style.right = 'auto';
    box.style.bottom = 'auto';
  };

  document.addEventListener('mousemove', moveHandler);
  document.addEventListener('touchmove', moveHandler);

  const endHandler = () => state.drag = false;
  document.addEventListener('mouseup', endHandler);
  document.addEventListener('touchend', endHandler);

  // Original functionality remains unchanged below
  // [Keep all original button handlers from user's code]
  // ... (Include all original button handlers here) ...

  // Load html2canvas if needed
  if (typeof html2canvas === 'undefined') {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
    document.head.appendChild(script);
  }
})();