import { PROJECTS } from "./data.js";

const params = new URLSearchParams(window.location.search);
const slug = params.get("slug");
const index = PROJECTS.findIndex((p) => p.slug === slug);

if (index === -1) {
  window.location.href = "index.html";
} else {
  const project = PROJECTS[index];
  document.title = `${project.title} — YOUR NAME`;

  const hero = document.getElementById("project-hero");
  hero.src = project.hero;
  hero.alt = project.title;

  document.getElementById("project-title").textContent = project.title;
  document.getElementById("project-description").textContent = project.description;
  document.getElementById("project-meta").innerHTML = `
    <div>${project.role}</div>
    <div>${project.year}</div>
  `;

  const mediaContainer = document.getElementById("project-media");
  mediaContainer.innerHTML = project.media.map((m) => {
    const mediaTag = m.type === "video"
      ? `<video src="${m.src}" autoplay loop muted playsinline></video>`
      : `<img src="${m.src}" alt="${project.title}">`;
    return `<figure>${mediaTag}<figcaption>${m.caption}</figcaption></figure>`;
  }).join("");

  const prev = PROJECTS[(index - 1 + PROJECTS.length) % PROJECTS.length];
  const next = PROJECTS[(index + 1) % PROJECTS.length];
  const prevLink = document.getElementById("project-prev");
  const nextLink = document.getElementById("project-next");
  prevLink.href = `project.html?slug=${prev.slug}`;
  prevLink.textContent = `← ${prev.title}`;
  nextLink.href = `project.html?slug=${next.slug}`;
  nextLink.textContent = `${next.title} →`;
}
