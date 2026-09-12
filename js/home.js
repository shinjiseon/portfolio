import { PROJECTS } from "./data.js";

const grid = document.getElementById("project-grid");

grid.innerHTML = PROJECTS.map((p) => `
  <a class="grid-item" href="project.html?slug=${p.slug}">
    <img src="${p.thumb}" alt="${p.title}" loading="lazy">
    <div class="grid-item__title">${p.title}</div>
    <div class="grid-item__category">${p.category}</div>
  </a>
`).join("");

grid.addEventListener("wheel", (e) => {
  if (e.deltaY === 0) return;
  e.preventDefault();
  grid.scrollLeft += e.deltaY;
}, { passive: false });

let isDragging = false;
let startX = 0;
let startScrollLeft = 0;

grid.addEventListener("pointerdown", (e) => {
  isDragging = true;
  grid.classList.add("is-dragging");
  startX = e.clientX;
  startScrollLeft = grid.scrollLeft;
});

window.addEventListener("pointermove", (e) => {
  if (!isDragging) return;
  grid.scrollLeft = startScrollLeft - (e.clientX - startX);
});

window.addEventListener("pointerup", () => {
  isDragging = false;
  grid.classList.remove("is-dragging");
});
