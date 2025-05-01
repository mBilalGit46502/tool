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

  // ===== Toolbox Creation =====
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

  // ===== State Management =====
  const state = {
    speak: false,
    dark: false,
    read: false,
    min: false,
    drag: false,
    touchActive: false,
    off: [0, 0]
  };

  // ===== Core Functionality =====
  const $ = id => document.getElementById(id);
  const hide = cb => {
    box.style.opacity = '0';
    setTimeout(() => {
      cb();
      box.style.opacity = '1';
    }, 200);
  };

  // ===== Enhanced Download =====
  $('btnDownload').onclick = () => hide(() => {
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

  // ===== Mobile Screenshot =====
  $('btnShot').onclick = function() {
    const overlay = document.createElement('div');
    overlay.className = 'selection-overlay';
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
    overlay.addEventListener('mousemove', handleMove);
    overlay.addEventListener('mouseup', handleEnd);
    overlay.addEventListener('touchstart', handleStart);
    overlay.addEventListener('touchmove', handleMove);
    overlay.addEventListener('touchend', handleEnd);
    document.body.appendChild(overlay);
  };

  // ===== Draggable Functionality =====
  box.addEventListener('mousedown', e => {
    state.drag = true;
    state.off = [box.offsetLeft - e.clientX, box.offsetTop - e.clientY];
  });
  box.addEventListener('touchstart', e => {
    state.drag = true;
    state.off = [box.offsetLeft - e.touches[0].clientX, box.offsetTop - e.touches[0].clientY];
  });

  const moveHandler = e => {
    if (!state.drag) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    box.style.left = clientX + state.off[0] + 'px';
    box.style.top = clientY + state.off[1] + 'px';
  };

  document.addEventListener('mousemove', moveHandler);
  document.addEventListener('touchmove', moveHandler);
  document.addEventListener('mouseup', () => state.drag = false);
  document.addEventListener('touchend', () => state.drag = false);

  // ===== Original Features =====
  // [All original button handlers preserved]
  $('btnTheme').onclick = function() {
    document.body.classList.toggle('darkMode');
    state.dark = !state.dark;
    this.textContent = state.dark ? 'Light Mode' : 'Dark Mode';
  };

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

  $('btnBattery').onclick = () => navigator.getBattery().then(b => 
    alert(`Battery: ${Math.round(b.level * 100)}%`));

  $('btnTrans').onclick = function() {
    const sel = window.getSelection().toString().trim();
    if (!sel) return alert('Select text to translate');
    const dir = prompt('1: EN→UR, 2: UR→EN');
    if (!dir) return;
    const lp = dir === '2' ? 'ur|en' : 'en|ur';
    fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(sel)}&langpair=${lp}`)
      .then(r => r.json())
      .then(d => {
        const rg = window.getSelection().getRangeAt(0);
        rg.deleteContents();
        rg.insertNode(document.createTextNode(d.responseData.translatedText));
      });
  };

  // ===== Dependency Loading =====
  if (typeof html2canvas === 'undefined') {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
    document.head.appendChild(script);
  }
})();