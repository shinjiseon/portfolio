import { PROJECTS } from "./data.js";

const params = new URLSearchParams(window.location.search);
const slug = params.get("slug");
const index = PROJECTS.findIndex((p) => p.slug === slug);

if (index === -1) {
  window.location.href = "index.html";
} else {
  const project = PROJECTS[index];
  document.title = `${project.title} — Portfolio`;

  document.getElementById("project-title").textContent = project.title;
  document.getElementById("project-category").textContent = project.category;
  document.getElementById("project-summary").textContent = project.description;

  const mediaContainer = document.getElementById("project-media");
  mediaContainer.innerHTML = project.media.map((row) => {
    const itemsHtml = row.items.map((m) => {
      return m.type === "video"
        ? `<video src="${m.src}" autoplay loop muted playsinline></video>`
        : `<img src="${m.src}" alt="${m.caption || project.title}">`;
    }).join("");
    return `<div class="media-row media-row--${row.layout}">${itemsHtml}</div>`;
  }).join("");
}
