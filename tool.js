// smartToolbox.js
(function(){
  // --- Dynamic loader for external libs ---
  function loadScript(url){return new Promise((res,rej)=>{
    const s=document.createElement('script');
    s.src=url; s.onload=res; s.onerror=rej;
    document.head.appendChild(s);
  });}

  // --- Download (txt/json) & PDF ---
  function promptDownload(text){
    const fmt=prompt("Format? txt, json, pdf","txt");
    if(!fmt) return;
    if(fmt==="pdf") return downloadPDF(text);
    if(fmt==="json") return downloadJSON(text);
    const blob=new Blob([text],{type:"text/plain"});
    const a=document.createElement('a');
    a.href=URL.createObjectURL(blob);
    a.download=`download.${fmt}`;
    a.click();
  }
  function downloadJSON(obj){
    const js=JSON.stringify(obj,null,2);
    const blob=new Blob([js],{type:"application/json"});
    const a=document.createElement('a');
    a.href=URL.createObjectURL(blob);
    a.download="download.json";
    a.click();
  }
  function downloadPDF(text){
    const { jsPDF } = window.jspdf;
    const doc=new jsPDF();
    const lines=doc.splitTextToSize(text,180);
    doc.text(lines,10,10);
    doc.save("download.pdf");
  }

  // --- Screenshots ---
  function captureFullPage(){
    html2canvas(document.body).then(c=>{
      const a=document.createElement('a');
      a.href=c.toDataURL("image/png");
      a.download="fullpage.png";
      a.click();
    });
  }
  function captureCroppedArea(){
    const ov=document.createElement('div');
    Object.assign(ov.style,{
      position:"fixed",top:0,left:0,width:"100%",height:"100%",
      cursor:"crosshair",zIndex:99999
    });
    document.body.appendChild(ov);
    let x0,y0,box;
    ov.onmousedown=e=>{
      x0=e.clientX; y0=e.clientY;
      box=document.createElement('div');
      Object.assign(box.style,{
        position:"absolute",border:"2px dashed #fff",
        background:"rgba(255,255,255,0.3)",
        left:`${x0}px`,top:`${y0}px`,zIndex:100000
      });
      ov.appendChild(box);
      ov.onmousemove=ev=>{
        const x1=ev.clientX,y1=ev.clientY;
        const l=Math.min(x1,x0),t=Math.min(y1,y0),
              w=Math.abs(x1-x0),h=Math.abs(y1-y0);
        Object.assign(box.style,{left:`${l}px`,top:`${t}px`,width:`${w}px`,height:`${h}px`});
      };
    };
    ov.onmouseup=e=>{
      ov.onmousemove=null;
      const r=box.getBoundingClientRect();
      html2canvas(document.body,{
        x:r.left,y:r.top,width:r.width,height:r.height
      }).then(c=>{
        const a=document.createElement('a');
        a.href=c.toDataURL("image/png");
        a.download="crop.png";
        a.click();
      });
      ov.remove();
    };
  }

  // --- CSS Injection ---
  function addCSS(){
    const css=`
      #smartBox{position:fixed;bottom:20px;right:20px;
        background:#2c3e50;color:#ecf0f1;padding:15px;
        border-radius:10px;z-index:99998;
        box-shadow:0 8px 20px rgba(0,0,0,0.4);
        font-family:'Segoe UI',sans-serif;
        max-width:360px;cursor:move;overflow:auto;}
      #smartBox h4{margin:0 0 10px;font-size:16px;color:#3498db;}
      #smartBox button{margin:4px 4px 0 0;padding:6px 12px;
        border:none;border-radius:5px;color:#fff;
        font-weight:600;font-size:13px;transition:opacity .3s;}
      #smartBox button:hover{opacity:.8;}
      #smartBox label{display:block;margin:8px 0;
        color:#bdc3c7;font-size:13px;}
      body.darkMode{background:#1a252f!important;color:#ecf0f1!important;}
      body.darkMode *{background:transparent!important;color:inherit!important;}
      body.readMode img,body.readMode video,body.readMode iframe{display:none!important;}
      body.readMode{padding:20px;line-height:1.6;}
      @media print{#smartBox{display:none!important;}}
    `;
    const st=document.createElement('style');
    st.textContent=css;
    document.head.appendChild(st);
  }

  // --- Build Toolbox ---
  function createBox(){
    const box=document.createElement('div');
    box.id="smartBox";
    box.innerHTML=`
      <button id="btnClose">✕</button><h4>Smart Toolbox</h4>
      <button id="btnDownload">Download</button>
      <button id="btnPdf">PDF</button>
      <button id="btnPrint">Print</button>
      <button id="btnCopy">Copy</button>
      <button id="btnTheme">Dark</button>
      <button id="btnScroll">Top</button>
      <button id="btnSpeak">Speak</button>
      <button id="btnCount">Count</button>
      <button id="btnNet">Net</button>
      <button id="btnReload">Reload</button>
      <button id="btnFind">Find</button>
      <button id="btnBattery">Battery</button>
      <button id="btnRead">Read</button>
      <button id="btnInvert">Invert</button>
      <button id="btnTrans">Translate</button>
      <button id="btnGrammar">Grammar</button>
      <button id="btnTranslit">Translit</button>
      <button id="btnHl">Highlight</button>
      <button id="btnNotes">Notes</button>
      <button id="btnInfo">Info</button>
      <button id="btnZoom">Zoom</button>
      <button id="btnElem">Elements</button>
      <button id="btnSpeed">Speed</button>
      <button id="btnCropShot">CropShot</button>
      <button id="btnFullShot">FullShot</button>
      <button id="btnQR">QR Code</button>
      <button id="btnEmail">Email</button>
      <button id="btnSearch">Search</button>
      <button id="btnFocus">Focus</button>
      <button id="btnClear">ClearHL</button>
      <button id="btnScrollLock">ScrollLock</button>
      <label><input id="btnFont" type="range" min="50" max="200" value="100"/>Font%</label>
      <button id="btnMin">Minimal</button>
    `;
    document.body.appendChild(box);
    return box;
  }

  // --- Initialize Toolbox ---
  function init(){
    addCSS();
    const box=createBox();
    const st={speak:false,dark:false,read:false,min:false,drag:false,off:[0,0]};
    const $=id=>document.getElementById(id);
    const hide=cb=>{box.style.display="none";setTimeout(()=>{cb();box.style.display="block";},300);};

    $('btnDownload').onclick = ()=>promptDownload(document.body.innerText);
    $('btnPdf').onclick      = ()=>promptDownload(document.body.innerText);
    $('btnPrint').onclick    = ()=>hide(()=>window.print());
    $('btnCopy').onclick     = ()=>navigator.clipboard.writeText(document.body.innerText).then(()=>alert("Copied"));
    $('btnTheme').onclick    = function(){document.body.classList.toggle("darkMode");st.dark^=1;this.textContent=st.dark?"Light":"Dark";};
    $('btnScroll').onclick   = ()=>window.scrollTo({top:0,behavior:"smooth"});
    $('btnSpeak').onclick    = function(){if(st.speak){speechSynthesis.cancel();st.speak=false;this.textContent="Speak";}else{speechSynthesis.speak(new SpeechSynthesisUtterance(document.body.innerText));st.speak=true;this.textContent="Stop";}};
    $('btnCount').onclick    = ()=>{const t=document.body.innerText;alert("Words:"+t.split(/\s+/).length+" | Chars:"+t.length);};
    $('btnNet').onclick      = ()=>alert(navigator.onLine?"Online":"Offline");
    $('btnReload').onclick   = ()=>location.reload();
    $('btnFind').onclick     = ()=>{const q=prompt("Find:");if(q){document.body.innerHTML=document.body.innerHTML.replace(new RegExp(q,"gi"),m=>`<mark>${m}</mark>`);}};
    $('btnBattery').onclick  = ()=>navigator.getBattery().then(b=>alert("Battery:"+Math.round(b.level*100)+"%"));
    $('btnRead').onclick     = function(){document.body.classList.toggle("readMode");st.read^=1;this.textContent=st.read?"Exit":"Read";};
    $('btnInvert').onclick   = ()=>document.body.style.filter=document.body.style.filter?"":"invert(1)";
    $('btnTrans').onclick    = ()=>{
      const s=window.getSelection().toString().trim();if(!s)return alert("Select text");
      const d=prompt("1:EN→UR,2:UR→EN");if(!d)return;
      const lp=d==="2"?"ur|en":"en|ur";
      fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(s)}&langpair=${lp}`)
        .then(r=>r.json()).then(d=>{const rg=window.getSelection().getRangeAt(0);rg.deleteContents();rg.insertNode(document.createTextNode(d.responseData.translatedText));});
    };
    $('btnGrammar').onclick  = ()=>{
      const s=window.getSelection().toString().trim();if(!s)return alert("Select text");
      fetch("https://api.languagetool.org/v2/check",{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:`text=${encodeURIComponent(s)}&language=en-US`})
        .then(r=>r.json()).then(d=>{if(!d.matches.length)return alert("No issues");let m="";d.matches.forEach((x,i)=>m+=`${i+1}. ${x.message}\n→ ${x.replacements.map(r=>r.value).join(", ")}\n\n`);alert(m);});
    };
    $('btnTranslit').onclick = ()=>{
      const t=prompt("Text"),src=prompt("Src"),tgt=prompt("Tgt");if(!t||!src||!tgt)return;
      fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(t)}&langpair=${src}|${tgt}`)
        .then(r=>r.json()).then(d=>alert("→ "+d.responseData.translatedText));
    };
    $('btnHl').onclick       = ()=>{
      const sel=window.getSelection();if(!sel.rangeCount)return;
      const rg=sel.getRangeAt(0),sp=document.createElement("span");
      sp.style.background="yellow";sp.textContent=sel.toString();
      rg.deleteContents();rg.insertNode(sp);sel.removeAllRanges();
    };
    $('btnNotes').onclick    = ()=>{
      const k="notes_"+location.href;let ta=box.querySelector("textarea");
      if(ta)ta.remove();else{ta=document.createElement("textarea");ta.value=localStorage.getItem(k)||"";ta.oninput=()=>localStorage.setItem(k,ta.value);box.appendChild(ta);}
    };
    $('btnInfo').onclick     = ()=>alert(`Title:${document.title}\nURL:${location.href}\nTime:${new Date().toLocaleString()}`);
    $('btnZoom').onclick     = ()=>{
      const z=prompt("Zoom%","100");if(z)document.body.style.zoom=z+"%";
    };
    $('btnElem').onclick     = ()=>alert(`Links:${document.links.length} Images:${document.images.length} Paras:${document.getElementsByTagName("p").length}`);
    $('btnSpeed').onclick    = ()=>window.open("https://www.speedtest.net","_blank");

    $('btnCropShot').onclick = captureCroppedArea;
    $('btnFullShot').onclick = captureFullPage;
    $('btnQR').onclick       = ()=>{
      const u=`https://chart.googleapis.com/chart?chs=200x200&cht=qr&chl=${encodeURIComponent(location.href)}`;
      const ov=document.createElement("div");
      Object.assign(ov.style,{position:"fixed",top:0,left:0,width:"100%",height:"100%",background:"rgba(0,0,0,0.8)",textAlign:"center",zIndex:100002});
      const img=document.createElement("img");img.src=u;img.style.marginTop="10%";
      ov.appendChild(img);document.body.appendChild(ov);ov.onclick=()=>ov.remove();
    };
    $('btnEmail').onclick    = ()=>window.location.href=`mailto:?subject=${encodeURIComponent(document.title)}&body=${encodeURIComponent(location.href)}`;
    $('btnSearch').onclick   = ()=>{
      const t=window.getSelection().toString();if(t)window.open(`https://www.google.com/search?q=${encodeURIComponent(t)}`);
    };
    $('btnFocus').onclick    = ()=>document.activeElement.blur();
    $('btnClear').onclick    = ()=>document.querySelectorAll("mark").forEach(m=>m.replaceWith(...m.childNodes));
    $('btnScrollLock').onclick=()=>document.body.style.overflow=document.body.style.overflow==="hidden"?"":"hidden";

    $('btnFont').oninput     = function(){document.body.style.fontSize=this.value+"%";};
    $('btnMin').onclick      = function(){
      Array.from(box.querySelectorAll("button:not(#btnClose):not(#btnMin),input,textarea,label"))
        .forEach(el=>el.style.display=st.min?"inline-block":"none");
      st.min=!st.min;this.textContent=st.min?"Expand":"Minimal";
    };
    $('btnClose').onclick    = ()=>box.remove();

    // Draggable
    box.addEventListener("mousedown",e=>{st.drag=true;st.off=[e.clientX-box.offsetLeft,e.clientY-box.offsetTop];});
    document.addEventListener("mouseup",()=>st.drag=false);
    document.addEventListener("mousemove",e=>{if(st.drag){box.style.left=e.clientX-st.off[0]+"px";box.style.top=e.clientY-st.off[1]+"px";}});
  }

  // Load html2canvas & jsPDF, then init
  Promise.all([
    typeof html2canvas==="undefined" ? loadScript("https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js") : Promise.resolve(),
    typeof window.jspdf==="undefined"    ? loadScript("https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js") : Promise.resolve()
  ]).then(init);
})();