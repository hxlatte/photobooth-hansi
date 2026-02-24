let currentFilter = "none";
let selectedSticker = null;
let stickerHistory = [];
let dragStickerSrc = null;
let activeDrag = null;

document.addEventListener("mousemove", function(ev){
  if(!activeDrag) return;
  const r = activeDrag.frame.getBoundingClientRect();
  activeDrag.sticker.style.left = (ev.clientX - r.left - activeDrag.offsetX) + "px";
  activeDrag.sticker.style.top  = (ev.clientY - r.top  - activeDrag.offsetY) + "px";
});

document.addEventListener("mouseup", function(){
  if(activeDrag){ activeDrag.sticker.style.cursor = "grab"; activeDrag = null; }
});

//NAVIGATION
function goCamera(){ window.location = "camera.html"; }
function goHome()  { window.location = "home.html"; }

//HOME CAMERA 
function startHomeCamera(){
  const v = document.getElementById("homeCamera");
  if(!v) return;
  navigator.mediaDevices.getUserMedia({video:true}).then(s => v.srcObject = s);
}

//UPLOAD
function openFilePicker(){ document.getElementById("fileInput").click(); }

const fileInput = document.getElementById("fileInput");
if(fileInput){
  fileInput.addEventListener("change", function(){
    const files = this.files;
    if(!files.length) return;
    if(files.length > 3){ alert("Select maximum 3 images"); return; }
    let loaded = 0;
    for(let i = 0; i < files.length; i++){
      const reader = new FileReader();
      const idx = i;
      reader.onload = function(e){
        localStorage.setItem("p"+(idx+1), e.target.result);
        loaded++;
        if(loaded === files.length) window.location = "edit.html";
      };
      reader.readAsDataURL(files[i]);
    }
  });
}

//CAMERA 
let video;
let timer = 3;

function startCamera(){
  video = document.getElementById("video");
  if(!video){ console.log("Video not found"); return; }
  navigator.mediaDevices.getUserMedia({ video: true })
    .then(function(stream){ video.srcObject = stream; video.play(); })
    .catch(function(err){ alert("Camera permission denied"); console.log(err); });
}

function setTimer(t){ timer = t; }

function setFilter(filterValue, btn){
  currentFilter = filterValue;
  if(video) video.style.filter = filterValue;
  document.querySelectorAll(".filters").forEach(b => b.classList.remove("active-filter"));
  if(btn) btn.classList.add("active-filter");
}

// PHOTOBOOTH 
async function startPhotobooth(){
  if(!video){ alert("Camera not ready"); return; }

  // Reset all previews
  for(let i = 1; i <= 3; i++){
    const img = document.getElementById("preview"+i);
    if(img){ img.src = ""; img.style.display = "none"; }
  }

  // Shot 1 — video already in frame1, just countdown and capture
  moveVideoToFrame(1);
  await takeOnePhoto("preview1", 1);

  // Shot 2 — move video to frame2
  moveVideoToFrame(2);
  await takeOnePhoto("preview2", 2);

  // Shot 3 — move video to frame3
  moveVideoToFrame(3);
  await takeOnePhoto("preview3", 3);

  // Hide video after all done
  video.style.display = "none";

  localStorage.setItem("p1", document.getElementById("preview1").src);
  localStorage.setItem("p2", document.getElementById("preview2").src);
  localStorage.setItem("p3", document.getElementById("preview3").src);

  setTimeout(() => window.location = "edit.html", 600);
}

// Move the video element into the given frame so live feed shows there during countdown
function moveVideoToFrame(frameNum){
  const frame = document.getElementById("frame"+frameNum);
  if(!frame) return;
  video.style.display = "block";
  frame.insertBefore(video, frame.firstChild);
}

async function takeOnePhoto(id, frameNum){
  await showCountdown(frameNum);

  const vw = video.videoWidth  || 640;
  const vh = video.videoHeight || 480;
  const frameRatio = 190 / 140;
  const videoRatio = vw / vh;

  let srcX, srcY, srcW, srcH;
  if(videoRatio > frameRatio){
    srcH = vh;
    srcW = Math.round(vh * frameRatio);
    srcX = Math.round((vw - srcW) / 2);
    srcY = 0;
  } else {
    srcW = vw;
    srcH = Math.round(vw / frameRatio);
    srcX = 0;
    srcY = Math.round((vh - srcH) / 2);
  }

  const canvas = document.createElement("canvas");
  canvas.width  = srcW;
  canvas.height = srcH;
  const ctx = canvas.getContext("2d");
  ctx.filter = currentFilter;
  ctx.translate(canvas.width, 0);
  ctx.scale(-1, 1);
  ctx.drawImage(video, srcX, srcY, srcW, srcH, 0, 0, canvas.width, canvas.height);

  const img = document.getElementById(id);
  img.src = canvas.toDataURL();
  img.style.display = "block";
}
//countdown shown inside the frame 
function showCountdown(frameNum){
  return new Promise(resolve => {
    // Move countdownBox into the active frame
    const box = document.getElementById("countdownBox");
    if(!box){ resolve(); return; }
    const frame = document.getElementById("frame"+frameNum);
    if(frame) frame.appendChild(box);

    let t = timer;
    const interval = setInterval(() => {
      box.innerText = t;
      t--;
      if(t < 0){
        clearInterval(interval);
        box.innerText = "";
        resolve();
      }
    }, 1000);
  });
}

//photo strripp one
function loadPhotos(){
  ["photo1","photo2","photo3"].forEach((id, i) => {
    const img = document.getElementById(id);
    const src = localStorage.getItem("p"+(i+1));
    if(img && src) img.src = src;
  });
}

//DOWNLOAD 
function downloadStrip(){
  const strip = document.getElementById("finalStrip");
  const stickers = strip.querySelectorAll(".sticker-on-frame");

  const promises = Array.from(stickers).map(img => {
    return new Promise(resolve => {
      if(img.src.startsWith("data:")){ resolve(); return; }
      const c = document.createElement("canvas");
      const t = new Image();
      t.crossOrigin = "anonymous";
      t.onload = () => {
        c.width = t.width; c.height = t.height;
        c.getContext("2d").drawImage(t,0,0);
        img.src = c.toDataURL();
        resolve();
      };
      t.onerror = resolve;
      t.src = img.src;
    });
  });

  Promise.all(promises).then(() => {
    html2canvas(strip, {
      scale: 2, useCORS: true, allowTaint: true, backgroundColor: "#000000"
    }).then(canvas => {
      const a = document.createElement("a");
      a.download = "photobooth.png";
      a.href = canvas.toDataURL("image/png");
      a.click();
    });
  });
}

//stickers
function selectSticker(src){
  selectedSticker = src;
  document.querySelectorAll(".sticker-btn").forEach(b => {
    b.classList.remove("selected");
    if(b.getAttribute("src") === src) b.classList.add("selected");
  });
}

function dragStart(e, src){
  dragStickerSrc = src;
  selectedSticker = src;
  e.dataTransfer.setData("text/plain", src);
}

function dropSticker(e, layerIdx){
  e.preventDefault();
  const src = dragStickerSrc || e.dataTransfer.getData("text/plain");
  if(!src) return;
  const frame = document.getElementById("layer"+layerIdx).parentElement;
  const rect  = frame.getBoundingClientRect();
  placeStickerImg(layerIdx, src, e.clientX - rect.left, e.clientY - rect.top);
  dragStickerSrc = null;
}

function clickPlaceSticker(e, layerIdx){
  if(e.target.classList.contains("sticker-on-frame")) return;
  if(!selectedSticker) return;
  const frame = document.getElementById("layer"+layerIdx).parentElement;
  const rect  = frame.getBoundingClientRect();
  placeStickerImg(layerIdx, selectedSticker, e.clientX - rect.left, e.clientY - rect.top);
}

function placeStickerImg(layerIdx, src, x, y){
  const layer = document.getElementById("layer"+layerIdx);
  const frame = layer.parentElement;

  const sticker = document.createElement("img");
  sticker.src = src;
  sticker.className = "sticker-on-frame";
  sticker.style.left = x + "px";
  sticker.style.top  = y + "px";

  sticker.addEventListener("mousedown", function(ev){
    ev.stopPropagation();
    ev.preventDefault();
    const r = frame.getBoundingClientRect();
    activeDrag = {
      sticker, frame,
      offsetX: ev.clientX - r.left - parseFloat(sticker.style.left),
      offsetY: ev.clientY - r.top  - parseFloat(sticker.style.top)
    };
    sticker.style.cursor = "grabbing";
  });

  sticker.addEventListener("dblclick", function(ev){
    ev.stopPropagation();
    sticker.remove();
    stickerHistory = stickerHistory.filter(h => h !== sticker);
  });

  layer.appendChild(sticker);
  stickerHistory.push(sticker);
}

function undoLastSticker(){
  const last = stickerHistory.pop();
  if(last) last.remove();
}