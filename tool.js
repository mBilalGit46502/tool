// smartToolbox.js
(function() {
  // Inject CSS styles
  function addCSS() {
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
      @media print {
        #smartBox { display: none !important; }
      }
    `;
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
  }

  // Create toolbox container and buttons
  function createBox() {
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
    return box;
  }

  // Initialize functionality
  function initToolbox() {
    addCSS();
    const box = createBox();
    const state = {
      speak: false,
      dark: false,
      read: false,
      min: false,
      drag: false,
      off: [0, 0]
    };

    const hide = cb => {
      box.style.display = 'none';
      setTimeout(() => {
        cb();
        box.style.display = 'block';
      }, 300);
    };

    // Helper to get element
    const $ = id => document.getElementById(id);

    // Button actions
    $('btnDownload').onclick = () => hide(() => {
      const t = document.body.innerText;
      const blob = new Blob([t], { type: 'text/plain' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'page.txt';
      a.click();
    });
    $('btnPrint').onclick = () => hide(() => window.print());
    $('btnCopy').onclick = () => navigator.clipboard.writeText(document.body.innerText).then(() => alert('Copied'));
    $('btnTheme').onclick = function() {
      document.body.classList.toggle('darkMode');
      state.dark = !state.dark;
      this.textContent = state.dark ? 'Light Mode' : 'Dark Mode';
    };
    $('btnScroll').onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });
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
    $('btnCount').onclick = () => {
      const t = document.body.innerText;
      alert(`Words: ${t.split(/\s+/).length} | Chars: ${t.length}`);
    };
    $('btnNet').onclick = () => alert(navigator.onLine ? 'Online' : 'Offline');
    $('btnReload').onclick = () => location.reload();
    $('btnFind').onclick = () => {
      const q = prompt('Find:');
      if (!q) return;
      const r = new RegExp(q, 'gi');
      document.body.innerHTML = document.body.innerHTML.replace(r, m => `<mark>${m}</mark>`);
    };
    $('btnBattery').onclick = () => navigator.getBattery().then(b => alert(`Battery: ${Math.round(b.level * 100)}%`));
    $('btnRead').onclick = function() {
      document.body.classList.toggle('readMode');
      state.read = !state.read;
      this.textContent = state.read ? 'ExitRead' : 'ReadMode';
    };
    $('btnInvert').onclick = () => document.body.style.filter = document.body.style.filter ? '' : 'invert(1)';
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
    $('btnGrammar').onclick = function() {
      const sel = window.getSelection().toString().trim();
      if (!sel) return alert('Select text for grammar');
      fetch('https://api.languagetool.org/v2/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `text=${encodeURIComponent(sel)}&language=en-US`
      })
      .then(r => r.json())
      .then(d => {
        if (!d.matches.length) return alert('No issues');
        let msg = '';
        d.matches.forEach((m, i) => {
          msg += `${i+1}. ${m.message}\n→ ${m.replacements.map(r=>r.value).join(', ')}\n\n`;
        });
        alert(msg);
      });
    };
    $('btnTranslit').onclick = function() {
      const txt = prompt('Text'), src = prompt('Src code'), tgt = prompt('Tgt code');
      if (!txt||!src||!tgt) return;
      fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(txt)}&langpair=${src}|${tgt}`)
        .then(r=>r.json())
        .then(d=>alert(`→ ${d.responseData.translatedText}`));
    };
    $('btnHl').onclick = function() {
      const sel = window.getSelection();
      if (!sel.rangeCount) return;
      const rg = sel.getRangeAt(0), sp = document.createElement('span');
      sp.style.background = 'yellow'; sp.textContent = sel.toString();
      rg.deleteContents(); rg.insertNode(sp); sel.removeAllRanges();
    };
    $('btnNotes').onclick = function() {
      const key = 'smartNotes_' + location.href;
      let ta = box.querySelector('textarea');
      if (ta) { ta.remove(); }
      else {
        ta = document.createElement('textarea');
        ta.value = localStorage.getItem(key) || '';
        ta.oninput = () => localStorage.setItem(key, ta.value);
        box.appendChild(ta);
      }
    };
    $('btnInfo').onclick = () => alert(`Title: ${document.title}\nURL: ${location.href}\nTime: ${new Date().toLocaleString()}`);
    $('btnZoom').onclick = function() {
      const z = prompt('Zoom %','100');
      if (z) document.body.style.zoom = z + '%';
    };
    $('btnElem').onclick = () => alert(`Links: ${document.links.length} Images: ${document.images.length} Paragraphs: ${document.getElementsByTagName('p').length}`);
    $('btnSpeed').onclick = () => window.open('https://www.speedtest.net','_blank');

    $('btnShot').onclick = function() {
      alert('Click and drag to select area');
      const ov = document.createElement('div');
      Object.assign(ov.style, { position:'fixed', top:0, left:0, width:'100%', height:'100%', cursor:'crosshair', zIndex:99998 });
      document.body.appendChild(ov);
      let sx, sy, selBox;
      ov.onmousedown = e => {
        sx = e.pageX; sy = e.pageY;
        selBox = document.createElement('div');
        Object.assign(selBox.style, { position:'absolute', border:'2px dashed red', backgroundColor:'rgba(255,0,0,0.2)', left:`${sx}px`, top:`${sy}px`, zIndex:99999 });
        ov.appendChild(selBox);
        ov.onmousemove = ev => {
          const ex = ev.pageX, ey = ev.pageY;
          selBox.style.width = Math.abs(ex-sx) + 'px';
          selBox.style.height = Math.abs(ey-sy) + 'px';
          selBox.style.left = Math.min(ex,sx) + 'px';
          selBox.style.top = Math.min(ey,sy) + 'px';
        };
      };
      ov.onmouseup = ev => {
        ov.onmousemove = null;
        html2canvas(document.body, {
          x: Math.min(ev.pageX,sx),
          y: Math.min(ev.pageY,sy),
          width: Math.abs(ev.pageX-sx),
          height: Math.abs(ev.pageY-sy)
        }).then(canvas => {
          const a = document.createElement('a');
          a.href = canvas.toDataURL('image/png');
          a.download = 'screenshot.png';
          a.click();
        });
        ov.remove();
      };
    };

    $('btnFullShot').onclick = () => {
      html2canvas(document.body).then(canvas => {
        const a = document.createElement('a');
        a.href = canvas.toDataURL('image/png');
        a.download = 'fullpage.png';
        a.click();
      });
    };

    $('btnQR').onclick = () => {
      const u = 'https://chart.googleapis.com/chart?chs=250x250&cht=qr&chl=' + encodeURIComponent(location.href);
      const ov = document.createElement('div');
      Object.assign(ov.style, { position:'fixed', top:0, left:0, width:'100%', height:'100%', backgroundColor:'rgba(0,0,0,0.9)', textAlign:'center', zIndex:100000 });
      const img = document.createElement('img');
      img.src = u; img.style.marginTop = '100px';
      ov.appendChild(img);
      document.body.appendChild(ov);
      ov.onclick = () => ov.remove();
    };

    $('btnEmail').onclick = () => {
      window.location.href = `mailto:?subject=${encodeURIComponent(document.title)}&body=${encodeURIComponent(location.href)}`;
    };

    $('btnSearch').onclick = () => {
      const txt = window.getSelection().toString();
      if (txt) window.open('https://www.google.com/search?q='+encodeURIComponent(txt));
    };

    $('btnFocus').onclick = () => {
      document.querySelectorAll('header, footer, nav, aside').forEach(e => e.style.display = 'none');
    };

    $('btnClear').onclick = () => {
      document.querySelectorAll('span[style*="background"]').forEach(span => {
        const p = span.parentNode;
        while (span.firstChild) p.insertBefore(span.firstChild, span);
        p.removeChild(span);
      });
    };

    $('btnScrollLock').onclick = () => {
      document.body.style.overflow = document.body.style.overflow==='hidden'?'':'hidden';
    };

    $('btnFont').oninput = function() {
      document.body.style.fontSize = this.value + '%';
    };

    $('btnMin').onclick = function() {
      Array.from(box.querySelectorAll('button:not(#btnClose):not(#btnMin),input,textarea,label'))
        .forEach(el => el.style.display = state.min ? 'inline-block' : 'none');
      state.min = !state.min;
      this.textContent = state.min ? 'Expand' : 'Minimal';
    };

    $('btnClose').onclick = () => box.remove();

    // Make draggable
    box.addEventListener('mousedown', e => {
      state.drag = true;
      state.off = [box.offsetLeft - e.clientX, box.offsetTop - e.clientY];
    }, true);
    document.addEventListener('mouseup', () => state.drag = false, true);
    document.addEventListener('mousemove', e => {
      if (state.drag) {
        box.style.left = e.clientX + state.off[0] + 'px';
        box.style.top  = e.clientY + state.off[1] + 'px';
        box.style.bottom = box.style.right = 'auto';
      }
    }, true);
  }

  // Load html2canvas then init
  if (typeof html2canvas === 'undefined') {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
    script.onload = initToolbox;
    document.head.appendChild(script);
  } else {
    initToolbox();
  }
})();