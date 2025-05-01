javascript:(function() {
  // ===== CSS Injection =====
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
      transition: transform 0.2s ease;
    }
    #smartBox.minimized {
      transform: scale(0.9);
      opacity: 0.9;
    }
    #smartBox button {
      margin: 4px;
      padding: 8px 12px;
      border: none;
      border-radius: 5px;
      background: #3498db;
      color: white;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    #smartBox button:hover {
      opacity: 0.8;
    }
    /* Mobile Responsive */
    @media (max-width: 768px) {
      #smartBox {
        max-width: 95%;
        bottom: 10px;
        right: 10px;
        padding: 10px;
      }
      #smartBox button {
        width: 100%;
        margin: 4px 0;
      }
    }
    /* Modal Styles */
    .smart-modal {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.7);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 100000;
    }
    .modal-content {
      background: white;
      padding: 20px;
      border-radius: 10px;
      max-width: 90%;
      color: #333;
    }
    /* Selection Box */
    .selection-box {
      position: absolute;
      border: 2px solid #e74c3c;
      background: rgba(231, 76, 60, 0.1);
      pointer-events: none;
    }
    /* Dark Mode */
    body.darkMode {
      background: #1a252f !important;
      color: #ecf0f1 !important;
    }
    body.darkMode * {
      background: transparent !important;
      color: inherit !important;
    }
    /* Read Mode */
    body.readMode img,
    body.readMode video,
    body.readMode iframe {
      display: none !important;
    }
    body.readMode {
      padding: 20px;
      line-height: 1.6;
    }
    /* Print Handling */
    @media print {
      #smartBox { display: none !important; }
    }
  `;
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  // ===== Toolbox Creation =====
  const box = document.createElement('div');
  box.id = 'smartBox';
  box.innerHTML = `
    <div class="toolbox-header">
      <button id="btnClose">✕</button>
      <h4>Smart Toolbox</h4>
    </div>
    <div class="toolbox-body">
      <!-- Original Features -->
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
      
      <!-- New Enhanced Features -->
      <button id="btnPassword">Password</button>
      <button id="btnConverter">Converter</button>
      <button id="btnQRScan">QR Scan</button>
      
      <!-- Utilities -->
      <div class="toolbox-footer">
        <input type="range" id="fontSize" min="50" max="200" value="100">
        <button id="btnMin">Minimal</button>
      </div>
    </div>
  `;
  document.body.appendChild(box);

  // ===== State Management =====
  const state = {
    speak: false,
    dark: localStorage.getItem('darkMode') === 'true',
    read: false,
    min: false,
    drag: false,
    position: JSON.parse(localStorage.getItem('toolboxPosition') || '{"x":20,"y":20}'),
    save: function() {
      localStorage.setItem('darkMode', this.dark);
      localStorage.setItem('toolboxPosition', JSON.stringify(this.position));
    }
  };

  // ===== Helper Functions =====
  const $ = id => document.getElementById(id);
  const showModal = (title, content) => {
    const modal = document.createElement('div');
    modal.className = 'smart-modal';
    modal.innerHTML = `
      <div class="modal-content">
        <h3>${title}</h3>
        ${content}
        <button onclick="this.parentElement.parentElement.remove()">Close</button>
      </div>
    `;
    document.body.appendChild(modal);
    return modal;
  };

  const hideTemporarily = (cb, duration = 300) => {
    box.style.opacity = '0';
    setTimeout(() => {
      cb();
      box.style.opacity = '1';
    }, duration);
  };

  // ===== Core Functionality =====
  
  // Fixed Print Function
  $('btnPrint').onclick = () => {
    hideTemporarily(() => {
      const originalStyles = document.head.innerHTML;
      document.head.innerHTML += '<style>@media print{body>*:not(#smartBox){visibility:visible!important}}</style>';
      window.print();
      setTimeout(() => {
        document.head.innerHTML = originalStyles;
      }, 500);
    });
  };

  // Enhanced Download with Multiple Formats
  $('btnDownload').onclick = async () => {
    const format = await new Promise(resolve => {
      const modal = showModal('Download As', `
        <button data-format="txt">Text (.txt)</button>
        <button data-format="pdf">PDF (.pdf)</button>
        <button data-format="html">HTML (.html)</button>
        <button data-format="json">JSON (.json)</button>
      `);
      
      modal.querySelectorAll('button').forEach(btn => {
        btn.onclick = () => {
          modal.remove();
          resolve(btn.dataset.format);
        };
      });
    });

    const content = {
      txt: document.body.innerText,
      html: document.documentElement.outerHTML,
      json: JSON.stringify({
        url: location.href,
        text: document.body.innerText,
        timestamp: new Date().toISOString()
      }, null, 2)
    }[format];

    if (format === 'pdf') {
      if (typeof jsPDF === 'undefined') {
        await new Promise(resolve => {
          const script = document.createElement('script');
          script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
          script.onload = resolve;
          document.head.appendChild(script);
        });
      }
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();
      doc.text(document.body.innerText, 10, 10);
      doc.save('document.pdf');
    } else {
      const blob = new Blob([content], { type: 'text/plain' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `page.${format}`;
      a.click();
    }
  };

  // Mobile-optimized Screenshot
  $('btnShot').onclick = function() {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.5);
      z-index: 99998;
      touch-action: none;
    `;

    let startX, startY, selBox;

    const handleStart = e => {
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      startX = clientX;
      startY = clientY;
      selBox = document.createElement('div');
      selBox.className = 'selection-box';
      selBox.style.left = `${startX}px`;
      selBox.style.top = `${startY}px`;
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
      
      html2canvas(document.body, {
        x: Math.min(startX, clientX),
        y: Math.min(startY, clientY),
        width: Math.abs(clientX - startX),
        height: Math.abs(clientY - startY),
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
    overlay.addEventListener('touchstart', handleStart, { passive: true });
    overlay.addEventListener('mousemove', handleMove);
    overlay.addEventListener('touchmove', handleMove, { passive: true });
    overlay.addEventListener('mouseup', handleEnd);
    overlay.addEventListener('touchend', handleEnd);
    document.body.appendChild(overlay);
  };

  // ===== New Features =====
  
  // Password Generator
  $('btnPassword').onclick = () => {
    const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
    const array = new Uint32Array(12);
    crypto.getRandomValues(array);
    const password = Array.from(array)
      .map(x => charset[x % charset.length])
      .join('');
    showModal('Generated Password', `
      <p>Your secure password:</p>
      <pre style="background:#f5f5f5;padding:10px;border-radius:5px">${password}</pre>
      <button onclick="navigator.clipboard.writeText('${password}')">Copy</button>
    `);
  };

  // Unit Converter
  $('btnConverter').onclick = () => {
    showModal('Unit Converter', `
      <select id="converterType">
        <option value="length">Length</option>
        <option value="temperature">Temperature</option>
      </select>
      <input type="number" id="converterValue" placeholder="Value">
      <div id="converterResult"></div>
      <script>
        document.getElementById('converterValue').oninput = function() {
          const type = document.getElementById('converterType').value;
          const value = parseFloat(this.value);
          let result = '';
          
          if (type === 'length') {
            result = \`\${value} km = \${(value * 0.621371).toFixed(2)} miles\`;
          } else if (type === 'temperature') {
            result = \`\${value}°C = \${(value * 9/5 + 32).toFixed(1)}°F\`;
          }
          
          document.getElementById('converterResult').innerHTML = result;
        };
      </script>
    `);
  };

  // ===== Original Functionality =====
  
  // Dark Mode
  $('btnTheme').onclick = function() {
    document.body.classList.toggle('darkMode');
    state.dark = !state.dark;
    this.textContent = state.dark ? 'Light Mode' : 'Dark Mode';
    state.save();
  };

  // Text-to-Speech
  $('btnSpeak').onclick = function() {
    if (state.speak) {
      speechSynthesis.cancel();
      state.speak = false;
      this.textContent = 'Speak';
    } else {
      const msg = new SpeechSynthesisUtterance(document.body.innerText.slice(0, 2000));
      speechSynthesis.speak(msg);
      state.speak = true;
      this.textContent = 'Stop';
    }
  };

  // Translation
  $('btnTrans').onclick = async function() {
    const sel = window.getSelection().toString().trim();
    if (!sel) return alert('Select text to translate');
    const dir = prompt('1: EN→UR, 2: UR→EN');
    if (!dir) return;
    const lp = dir === '2' ? 'ur|en' : 'en|ur';
    
    try {
      const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(sel)}&langpair=${lp}`);
      const data = await response.json();
      const rg = window.getSelection().getRangeAt(0);
      rg.deleteContents();
      rg.insertNode(document.createTextNode(data.responseData.translatedText));
    } catch (error) {
      alert('Translation failed: ' + error.message);
    }
  };

  // ===== Toolbox Dragging =====
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
    state.position = { x: box.offsetLeft, y: box.offsetTop };
    state.save();
  };

  document.addEventListener('mousemove', moveHandler);
  document.addEventListener('touchmove', moveHandler, { passive: true });

  const endHandler = () => {
    state.drag = false;
    state.save();
  };

  document.addEventListener('mouseup', endHandler);
  document.addEventListener('touchend', endHandler);

  // ===== Initialization =====
  if (typeof html2canvas === 'undefined') {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
    document.head.appendChild(script);
  }

  // Restore position
  box.style.left = `${state.position.x}px`;
  box.style.top = `${state.position.y}px`;
})();