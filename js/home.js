import { PROJECTS } from "./data.js";

const track = document.getElementById("marquee-track");
const viewport = document.getElementById("marquee-viewport");

const COPIES = 4;
const items = [];

function buildItem(project, copyIndex) {
  const el = document.createElement("a");
  el.className = "marquee-item";
  el.href = `project.html?slug=${project.slug}`;
  el.dataset.slug = project.slug;
  el.innerHTML = `
    <div class="marquee-item__media">
      <img src="${project.thumb}" alt="${project.title}" loading="${copyIndex === 0 ? "eager" : "lazy"}">
    </div>
    <div class="marquee-item__caption">
      <div class="marquee-item__title">${project.title}</div>
      <div class="marquee-item__category">${project.category}</div>
    </div>
  `;
  return el;
}

for (let copy = 0; copy < COPIES; copy++) {
  PROJECTS.forEach((project) => {
    const el = buildItem(project, copy);
    track.appendChild(el);
    items.push(el);
  });
}

// --- Measure the width of one full pass through PROJECTS (for seamless looping) ---
let singleSetWidth = 0;

function measureSetWidth() {
  const n = PROJECTS.length;
  if (items.length < n + 1) return;
  const first = items[0].getBoundingClientRect();
  const afterSet = items[n].getBoundingClientRect();
  const width = afterSet.left - first.left;
  if (width > 0) singleSetWidth = width;
}

const ro = new ResizeObserver(() => measureSetWidth());
items.slice(0, PROJECTS.length + 1).forEach((el) => ro.observe(el));
window.addEventListener("load", measureSetWidth);
measureSetWidth();

// --- Motion model: ambient drift + wheel/drag boost that eases back to ambient speed ---
let offset = 0;
const BASE_SPEED = 40; // px/sec ambient drift
let velocity = BASE_SPEED;
let lastTime = null;

let isDragging = false;
let dragMoved = false;
let lastPointerX = 0;
let lastPointerTime = 0;

function onWheel(e) {
  if (Math.abs(e.deltaY) < 1) return;
  e.preventDefault();
  velocity += e.deltaY * 1.5;
  velocity = Math.max(-800, Math.min(800, velocity));
}

function onPointerDown(e) {
  isDragging = true;
  dragMoved = false;
  lastPointerX = e.clientX;
  lastPointerTime = performance.now();
  viewport.classList.add("is-dragging");
}

function onPointerMove(e) {
  if (!isDragging) return;
  const now = performance.now();
  const dx = e.clientX - lastPointerX;
  if (Math.abs(dx) > 3) dragMoved = true;
  const dt = Math.max(1, now - lastPointerTime) / 1000;
  offset -= dx;
  velocity = -dx / dt;
  lastPointerX = e.clientX;
  lastPointerTime = now;
}

function onPointerUp() {
  isDragging = false;
  viewport.classList.remove("is-dragging");
}

function onTrackClick(e) {
  if (dragMoved) {
    e.preventDefault();
    dragMoved = false;
  }
}

document.addEventListener("wheel", onWheel, { passive: false });
document.addEventListener("pointerdown", onPointerDown);
window.addEventListener("pointermove", onPointerMove);
window.addEventListener("pointerup", onPointerUp);
track.addEventListener("click", onTrackClick, true);

// --- Entrance animation: reveal image + caption whenever an item enters the viewport ---
const io = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    entry.target.classList.toggle("is-revealed", entry.isIntersecting);
  });
}, { root: viewport, threshold: 0.01 });

items.forEach((el) => io.observe(el));

function tick(time) {
  if (lastTime === null) lastTime = time;
  const dt = (time - lastTime) / 1000;
  lastTime = time;

  if (!isDragging) {
    velocity += (BASE_SPEED - velocity) * Math.min(1, dt * 2);
    offset += velocity * dt;
  }

  if (singleSetWidth > 0) {
    if (offset >= singleSetWidth) offset -= singleSetWidth;
    if (offset < 0) offset += singleSetWidth;
  }

  track.style.transform = `translateX(${-offset}px)`;

  requestAnimationFrame(tick);
}

requestAnimationFrame(tick);
