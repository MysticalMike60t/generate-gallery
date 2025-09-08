const fs = require("fs");
const path = require("path");

const rootFolder = __dirname;
const supportedExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".bmp"];

function generateHTML(folderPath, relativePath, images, subfolders) {
  const accentColor = "#0cf";
  const accentColorHover = "#00a3ccff";
  const bgColor = "#111";
  const textColor = "#fff";

  const backLink = relativePath ? `<a href="../index.html">⬅ Back</a>` : "";
  const folderLinks = subfolders
    .map((f) => `<li><a href="${f}/index.html">${f}</a></li>`)
    .join("\n");

  const imageElements = images
    .map((img, i) => {
      const fullPath = `${img}`;
      return `
      <div class="img-wrapper">
        <button class="add-to-queue-btn" onclick="addToQueue(event, '${fullPath.replace(
          /'/g,
          "\\'"
        )}')"><svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 12H18M12 6V18" stroke="${textColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
        <div class="loader"></div>
        <img src="${fullPath}" data-src="${fullPath}" alt="" onclick="showImage('${fullPath}')">
      </div>
    `;
    })
    .join("\n");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Gallery - ${relativePath || "Home"}</title>
  <style>
    :root {
      --accent-color: ${accentColor};
      --accent-color-hover: ${accentColorHover};
      --bg-color: ${bgColor};
      --text-color: ${textColor};

      --mosaic-gap: 10px;
    }
    body { font-family: sans-serif; background: var(--bg-color); color: var(--text-color); text-align: center; margin: 0; display: flex; flex-direction: column; align-items: center; overflow-x: hidden; overflow-y: auto; }
    a { color: var(--accent-color); text-decoration: none; transition: 100ms ease all; }
    a:hover { color: var(--accent-color-hover); }
    h1, h2 { margin: 1rem 0; }
    .gallery { column-count: 4; column-gap: var(--mosaic-gap); padding: 20px; }
    @media screen and (max-width: 1300px) { .gallery { column-count: 3; } }
    @media screen and (max-width: 1000px) { .gallery { column-count: 2; } }
    @media screen and (max-width: 650px) { .gallery { column-count: 1; } }
    .img-wrapper { position: relative; margin-bottom: var(--mosaic-gap); }
    .img-wrapper:hover img { border-color: var(--accent-color); }
    .img-wrapper img { width: 300px; height: auto; display: block; border: 3px solid #444; border-radius: 8px; cursor: pointer; transition: 100ms ease all; }
    .loader {
      position: absolute; top: 0; left: 0;
      width: 100%; height: 100%;
      background: rgba(0, 0, 0, 0.6) url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" style="margin:auto;background:none;display:block;" width="40px" height="40px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid"><circle cx="50" cy="50" fill="none" stroke="%23fff" stroke-width="10" r="35" stroke-dasharray="164.93361431346415 56.97787143782138"><animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1s" values="0 50 50;360 50 50" keyTimes="0;1"></animateTransform></circle></svg>') center center no-repeat;
      border-radius: 8px;
    }

    .gallery-controls {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px;
      border-bottom: 1px solid #333;
      position: sticky;
      top: 0;
      background: var(--bg-color);
      z-index: 1000;
    }

    .navigation {
      margin-left: 10px;
    }

    .actions {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      margin-right: 10px;
    }

    .add-to-queue-btn {
      --size: 30px;

      display: flex;
      align-items: center;
      justify-content: center;
      width: var(--size);
      height: var(--size);
      position: absolute;
      top: 5px;
      left: 5px;
      background-color: rgba(0, 0, 0, 0.4);
      color: white;
      border: none;
      border-radius: 5px;
      font-size: 18px;
      cursor: pointer;
      backdrop-filter: blur(5px);
      transition: 100ms ease all;
    }

    .add-to-queue-btn:hover {
      background-color: rgba(0, 0, 0, 0.7);
    }

    .add-to-queue-btn svg {
      width: var(--size);
      height: var(--size);
    }

    .add-to-queue-btn svg:hover path {
      stroke: var(--accent-color);
    }

    .view-queue, .clear-queue {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      background-color: var(--accent-color);
      padding: 5px 20px;
      border-radius: 5px;
      border: none;
      outline: none;
      cursor: pointer;
      transition: 100ms ease all;
    }

    @media screen and (max-width: 600px) {
      .view-queue, .clear-queue {
        font-size: 16px;
      }
    }

    .view-queue:hover, .clear-queue:hover {
      background-color: var(--accent-color-hover);
    }

    .view-queue span, .clear-queue span {
      text-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
    }

    #queuePanelPlaceholder {
      margin-top: 30px;
    }

    #lightbox {
      display: none;
      position: fixed; top: 0; left: 0;
      width: 100%; height: 100%;
      background: rgba(0, 0, 0, 0.95);
      align-items: center; justify-content: center;
      z-index: 9999;
    }

    #lightbox img {
      max-width: 90%;
      max-height: 90%;
      z-index: 2;
    }

    #queuePanel {
      display: none;
      background: #222;
      padding: 10px;
      border-radius: 8px;
      margin: 10px auto;
      max-width: 90%;
      overflow-x: auto;
      white-space: nowrap;
    }

    .folder-links {
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-start;
      align-items: flex-start;
      flex-direction: column;
      gap: 10px;
      width: 100%;
      max-width: 50vw;
      min-width: 600px;
      background: rgb(25, 25, 25);
      list-style: none;
      padding: 10px;
      margin: 0;
      margin-top: 20px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      border-radius: 5px;
    }

    .folder-links li {
      width: calc(100% - 10px);
      text-align: left;
      padding: 5px;
      border-bottom: 1px solid rgb(35, 35, 35);
    }
  </style>
</head>
<body>

<div class="gallery-controls">
  <div class="navigation">
    ${backLink}
  </div>
  <div class="actions">
    <button class="view-queue" onclick="toggleQueue()"><span>📂</span> View Queue</button>
    <button class="clear-queue" onclick="clearQueue()"><span>🗑️</span> Clear Queue</button>
  </div>
</div>

<div id="queuePanelPlaceholder"></div>

<h1>Gallery - ${relativePath || "Home"}</h1>
${
  folderLinks.length > 0
    ? `<h2>Folders</h2><ul class="folder-links">${folderLinks}</ul>`
    : ""
}
<div class="gallery">${imageElements}</div>

<div id="lightbox" onclick="clickOutsideLightbox(event)">
  <img src="" alt=""/>
</div>

<script>
  const queue = [];
  const queuePanelPlaceholder = document.getElementById("queuePanelPlaceholder");
  const queuePanel = document.createElement("div");

  let currentIndex = -1;
  let hasRenderedQueue = false;
  let toggledQueue = false;

  function addToQueue(event, src) {
    event.stopPropagation(); // Prevent triggering the image click event
    if (!queue.includes(src)) {
      queue.push(src);
      if (toggledQueue) renderQueue();
    }
  }

  function showImage(src) {
    const lightbox = document.getElementById("lightbox");
    const img = lightbox.querySelector("img");
    img.src = src;
    lightbox.style.display = "flex";
  }

  function nextImage() {
    if (queue.length && currentIndex < queue.length - 1) {
      currentIndex++;
      showImage(queue[currentIndex]);
    }
  }

  function prevImage() {
    if (queue.length && currentIndex > 0) {
      currentIndex--;
      showImage(queue[currentIndex]);
    }
  }

  function closeLightbox() {
    document.getElementById("lightbox").style.display = "none";
  }

  function clickOutsideLightbox(event) {
    if (event.target.id === "lightbox") {
      closeLightbox();
    }
  }

  window.addEventListener("keydown", e => {
    if (e.key === "ArrowRight") nextImage();
    else if (e.key === "ArrowLeft") prevImage();
    else if (e.key === "Escape") closeLightbox();
  });

  // Remove loader on image load
  document.querySelectorAll(".img-wrapper img").forEach(img => {
    img.addEventListener("load", () => {
      img.previousElementSibling?.remove();
    });
  });

  function toggleQueue() {
    toggledQueue = !toggledQueue;
    if (!hasRenderedQueue) {
      queuePanel.id = "queuePanel";
      queuePanelPlaceholder.appendChild(queuePanel);
      hasRenderedQueue = true;
    }
    const panel = document.getElementById("queuePanel");
    if (toggledQueue) {
      panel.style.display = "block";
      renderQueue();
    } else {
      panel.style.display = "none";
    }
  }

  function clearQueue() {
    queue.length = 0;
    currentIndex = -1;
    document.getElementById("lightbox").style.display = "none";
    renderQueue();
  }

  function renderQueue() {
    const panel = document.getElementById("queuePanel");
    panel.innerHTML = queue.map((src, i) => {
      return '<img src="' + src + '" style="height:60px; margin:5px; border:' + (i === currentIndex ? '3px solid #0cf' : '1px solid #666') + '; border-radius:5px; cursor:pointer;" onclick="showFromQueue(' + i + ')">';
    }).join("");
  }

  function showFromQueue(i) {
    if (queue[i]) {
      currentIndex = i;
      showImage(queue[i]);
    }
  }

  let touchStartX = 0;
  let touchEndX = 0;

  function handleGesture() {
    if (touchEndX < touchStartX - 50) nextImage(); // Swipe left
    if (touchEndX > touchStartX + 50) prevImage(); // Swipe right
  }

  const lightbox = document.getElementById("lightbox");
  lightbox.addEventListener("touchstart", e => {
    touchStartX = e.changedTouches[0].screenX;
  });

  lightbox.addEventListener("touchend", e => {
    touchEndX = e.changedTouches[0].screenX;
    handleGesture();
  });

</script>
</body>
</html>`;
}

function buildGallery(currentPath, relativePath = "") {
  const entries = fs.readdirSync(currentPath, { withFileTypes: true });

  const images = entries
    .filter(
      (entry) =>
        entry.isFile() &&
        supportedExtensions.includes(path.extname(entry.name).toLowerCase())
    )
    .map((entry) => entry.name);

  const subfolders = entries
    .filter((entry) => entry.isDirectory())
    .filter((entry) => !entry.name.startsWith("."))
    .map((entry) => entry.name);

  const html = generateHTML(currentPath, relativePath, images, subfolders);
  fs.writeFileSync(path.join(currentPath, "index.html"), html);

  for (const sub of subfolders) {
    buildGallery(path.join(currentPath, sub), path.join(relativePath, sub));
  }
}

buildGallery(rootFolder);
console.log("✅ Interactive gallery with queue and lightbox generated.");
