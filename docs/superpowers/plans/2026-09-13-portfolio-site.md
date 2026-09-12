# Portfolio Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a static (no framework, no build step) personal portfolio website with a studioheed.com-style home page (horizontal-scrolling project grid), individual project detail pages, and an info page — using placeholder content that is easy to swap for real content later.

**Architecture:** Plain multi-page HTML/CSS/JS. Project data (title, category, images, description, media) lives in a single ES module (`js/data.js`) that both the home page and the project detail page import and render from at load time. No server, no database, no bundler.

**Tech Stack:** HTML5, CSS3, vanilla JavaScript (ES modules). No frameworks, no npm dependencies. Served locally for development via Python's built-in HTTP server (module scripts require `http://`, not `file://`).

**Spec:** [docs/superpowers/specs/2026-09-13-portfolio-site-design.md](../specs/2026-09-13-portfolio-site-design.md)

## Global Constraints

- Background `#0d0d0d`, white text — dark theme throughout, no light-mode variant.
- No frontend framework, no build tool, no server-side code. Files must run as-is when served over plain HTTP.
- All project content lives in one data file (`js/data.js`) so it can be edited without touching markup.
- Every project's `media` entries must support both images/GIFs (`type: "image"`) and short videos (`type: "video"`).
- Desktop-first, but layout must not break below 720px width (basic responsive rules required).
- No automated test framework — verification is done by serving the site and checking it in a browser (per spec's testing section).

---

### Task 1: Base styles and page shells

**Files:**
- Create: `css/style.css`
- Create: `index.html`
- Create: `info.html`
- Create: `project.html`

**Interfaces:**
- Produces: CSS classes `.site-header`, `.site-header__brand`, `.site-header__name`, `.site-header__nav`, `.site-header__contact`, `.intro`, `.site-footer`, `.grid-scroll`, `.grid-item`, `.grid-item__title`, `.grid-item__category`, `.project-hero`, `.project-head`, `.project-meta`, `.project-media`, `.project-nav`, `.info-content` — later tasks' JS and markup rely on these exact class names.
- Produces: element ids `project-grid` (index.html), `project-hero`, `project-title`, `project-description`, `project-meta`, `project-media`, `project-prev`, `project-next` (project.html) — Task 3 and Task 5 JS target these ids.

- [ ] **Step 1: Create `css/style.css` with the full dark theme and layout rules**

```css
:root {
  --bg: #0d0d0d;
  --fg: #ffffff;
  --muted: rgba(255, 255, 255, .55);
  --border: rgba(255, 255, 255, .14);
  --font: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
}
* { box-sizing: border-box; }
html, body { margin: 0; padding: 0; background: var(--bg); color: var(--fg); font-family: var(--font); }
a { color: inherit; text-decoration: none; }
a:hover { opacity: .7; }

.site-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 32px 40px 0;
  font-size: 14px;
}
.site-header__brand { display: flex; gap: 24px; align-items: baseline; }
.site-header__name { font-weight: 700; letter-spacing: .02em; }
.site-header__nav { display: flex; gap: 16px; color: var(--muted); }
.site-header__nav a.is-active { color: var(--fg); }
.site-header__contact { text-align: right; color: var(--muted); line-height: 1.6; }
.site-header__contact a { display: block; }

.intro {
  max-width: 320px;
  margin: 24px 40px 40px;
  color: var(--muted);
  font-size: 13px;
  line-height: 1.6;
}

.site-footer {
  padding: 24px 40px;
  color: var(--muted);
  font-size: 12px;
  border-top: 1px solid var(--border);
  margin-top: 80px;
}

/* Home grid */
.grid-scroll {
  display: flex;
  gap: 16px;
  padding: 0 40px 60px;
  overflow-x: auto;
  cursor: grab;
  scrollbar-width: none;
}
.grid-scroll::-webkit-scrollbar { display: none; }
.grid-scroll.is-dragging { cursor: grabbing; user-select: none; }
.grid-item { flex: 0 0 auto; width: 320px; }
.grid-item img {
  width: 320px;
  height: 220px;
  object-fit: cover;
  border-radius: 4px;
  display: block;
  background: #1a1a1a;
}
.grid-item__title { margin-top: 10px; font-size: 13px; }
.grid-item__category { color: var(--muted); font-size: 12px; }

/* Project detail */
.project-hero { width: 100%; max-height: 70vh; object-fit: cover; display: block; }
.project-head {
  display: flex;
  justify-content: space-between;
  gap: 40px;
  padding: 32px 40px;
  border-bottom: 1px solid var(--border);
}
.project-head h1 { font-size: 22px; margin: 0 0 8px; }
.project-head p { color: var(--muted); font-size: 13px; max-width: 480px; line-height: 1.6; margin: 0; }
.project-meta { color: var(--muted); font-size: 12px; text-align: right; line-height: 1.8; white-space: nowrap; }
.project-media { padding: 40px; display: flex; flex-direction: column; gap: 32px; }
.project-media img, .project-media video { width: 100%; display: block; border-radius: 4px; }
.project-media figcaption { margin-top: 8px; color: var(--muted); font-size: 12px; }
.project-nav {
  display: flex;
  justify-content: space-between;
  padding: 24px 40px;
  border-top: 1px solid var(--border);
  font-size: 13px;
}

/* Info page */
.info-content { max-width: 520px; margin: 24px 40px 80px; font-size: 14px; line-height: 1.8; color: var(--muted); }
.info-content h1 { color: var(--fg); font-size: 20px; margin-bottom: 16px; }
.info-content a { color: var(--fg); text-decoration: underline; }

@media (max-width: 720px) {
  .site-header { flex-direction: column; gap: 12px; padding: 24px 20px 0; }
  .site-header__contact { text-align: left; }
  .intro { margin: 20px 20px 32px; }
  .grid-scroll { padding: 0 20px 40px; }
  .grid-item { width: 220px; }
  .grid-item img { width: 220px; height: 150px; }
  .project-head { flex-direction: column; padding: 24px 20px; gap: 16px; }
  .project-meta { text-align: left; }
  .project-media { padding: 24px 20px; }
  .project-nav { padding: 20px; }
  .info-content { margin: 20px 20px 60px; }
}
```

- [ ] **Step 2: Create `index.html`**

```html
<!doctype html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>YOUR NAME — Portfolio</title>
<link rel="stylesheet" href="css/style.css">
</head>
<body>
<header class="site-header">
  <div class="site-header__brand">
    <a href="index.html" class="site-header__name">YOUR NAME</a>
    <nav class="site-header__nav">
      <a href="index.html" class="is-active">Work</a>
      <a href="info.html">Info</a>
    </nav>
  </div>
  <div class="site-header__contact">
    <a href="mailto:hey@yourmail.com">hey@yourmail.com</a>
    <a href="https://instagram.com" target="_blank" rel="noopener">Instagram</a>
  </div>
</header>

<p class="intro">디자인과 브랜딩을 다루는 개인 포트폴리오입니다. 소개 문구를 이곳에 작성하세요.</p>

<div class="grid-scroll" id="project-grid"></div>

<footer class="site-footer">
  <p>© <span id="year"></span> YOUR NAME</p>
</footer>

<script>document.getElementById("year").textContent = new Date().getFullYear();</script>
</body>
</html>
```

- [ ] **Step 3: Create `info.html`**

```html
<!doctype html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Info — YOUR NAME</title>
<link rel="stylesheet" href="css/style.css">
</head>
<body>
<header class="site-header">
  <div class="site-header__brand">
    <a href="index.html" class="site-header__name">YOUR NAME</a>
    <nav class="site-header__nav">
      <a href="index.html">Work</a>
      <a href="info.html" class="is-active">Info</a>
    </nav>
  </div>
  <div class="site-header__contact">
    <a href="mailto:hey@yourmail.com">hey@yourmail.com</a>
    <a href="https://instagram.com" target="_blank" rel="noopener">Instagram</a>
  </div>
</header>

<div class="info-content">
  <h1>About</h1>
  <p>본인 소개를 이곳에 작성하세요. 경력, 작업 방식, 관심 분야 등을 자유롭게 적을 수 있습니다.</p>
  <p>Email: <a href="mailto:hey@yourmail.com">hey@yourmail.com</a><br>
  Instagram: <a href="https://instagram.com" target="_blank" rel="noopener">@yourname</a></p>
</div>

<footer class="site-footer">
  <p>© <span id="year"></span> YOUR NAME</p>
</footer>

<script>document.getElementById("year").textContent = new Date().getFullYear();</script>
</body>
</html>
```

- [ ] **Step 4: Create `project.html`**

```html
<!doctype html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Project — YOUR NAME</title>
<link rel="stylesheet" href="css/style.css">
</head>
<body>
<header class="site-header">
  <div class="site-header__brand">
    <a href="index.html" class="site-header__name">YOUR NAME</a>
    <nav class="site-header__nav">
      <a href="index.html" class="is-active">Work</a>
      <a href="info.html">Info</a>
    </nav>
  </div>
  <div class="site-header__contact">
    <a href="mailto:hey@yourmail.com">hey@yourmail.com</a>
    <a href="https://instagram.com" target="_blank" rel="noopener">Instagram</a>
  </div>
</header>

<img id="project-hero" class="project-hero" src="" alt="">

<div class="project-head">
  <div>
    <h1 id="project-title"></h1>
    <p id="project-description"></p>
  </div>
  <div class="project-meta" id="project-meta"></div>
</div>

<div class="project-media" id="project-media"></div>

<div class="project-nav">
  <a id="project-prev" href="#"></a>
  <a id="project-next" href="#"></a>
</div>

<footer class="site-footer">
  <p>© <span id="year"></span> YOUR NAME</p>
</footer>

<script>document.getElementById("year").textContent = new Date().getFullYear();</script>
</body>
</html>
```

- [ ] **Step 5: Verify the shells render**

Run: `cd /Users/sinjiseon/Desktop/Workspace/Oase && python3 -m http.server 8000 &`
Then: `curl -s http://localhost:8000/index.html | grep 'project-grid'`
Expected: output contains `<div class="grid-scroll" id="project-grid"></div>`

Repeat the same `curl` pattern for `info.html` (grep `info-content`) and `project.html` (grep `project-hero`). Stop the server afterward with `kill %1`.

- [ ] **Step 6: Commit**

```bash
git add css/style.css index.html info.html project.html
git commit -m "feat: add dark-theme page shells for home, info, project pages"
```

---

### Task 2: Project data

**Files:**
- Create: `js/data.js`

**Interfaces:**
- Produces: `export const PROJECTS` — an array of objects, each shaped as:
  ```js
  {
    slug: string,
    title: string,
    category: string,
    thumb: string,       // URL for home grid thumbnail
    hero: string,        // URL for detail page hero image
    role: string,
    year: string,
    description: string,
    media: [{ type: "image" | "video", src: string, caption: string }]
  }
  ```
  Task 3 (`js/home.js`) and Task 5 (`js/project.js`) import and consume `PROJECTS` with these exact field names.

- [ ] **Step 1: Create `js/data.js` with 5 placeholder projects**

```js
export const PROJECTS = [
  {
    slug: "project-one",
    title: "Project One",
    category: "Brand Identity",
    thumb: "https://picsum.photos/seed/project-one-thumb/800/600",
    hero: "https://picsum.photos/seed/project-one-hero/1600/900",
    role: "Design, Art Direction",
    year: "2026",
    description: "Lorem ipsum is simply dummy text of the printing and typesetting industry. Replace this with a real description of the project.",
    media: [
      { type: "image", src: "https://picsum.photos/seed/project-one-1/1200/900", caption: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." },
      { type: "image", src: "https://picsum.photos/seed/project-one-2/1200/1500", caption: "Sed do eiusmod tempor incididunt ut labore." }
    ]
  },
  {
    slug: "project-two",
    title: "Project Two",
    category: "Packaging",
    thumb: "https://picsum.photos/seed/project-two-thumb/800/600",
    hero: "https://picsum.photos/seed/project-two-hero/1600/900",
    role: "Packaging Design",
    year: "2025",
    description: "Lorem ipsum is simply dummy text of the printing and typesetting industry. Replace this with a real description of the project.",
    media: [
      { type: "image", src: "https://picsum.photos/seed/project-two-1/1200/900", caption: "Ut enim ad minim veniam, quis nostrud exercitation." }
    ]
  },
  {
    slug: "project-three",
    title: "Project Three",
    category: "Campaign",
    thumb: "https://picsum.photos/seed/project-three-thumb/800/600",
    hero: "https://picsum.photos/seed/project-three-hero/1600/900",
    role: "Art Direction, Motion",
    year: "2025",
    description: "Lorem ipsum is simply dummy text of the printing and typesetting industry. Replace this with a real description of the project.",
    media: [
      { type: "image", src: "https://picsum.photos/seed/project-three-1/1200/900", caption: "Duis aute irure dolor in reprehenderit in voluptate." },
      { type: "image", src: "https://picsum.photos/seed/project-three-2/1200/900", caption: "Excepteur sint occaecat cupidatat non proident." }
    ]
  },
  {
    slug: "project-four",
    title: "Project Four",
    category: "Web Design",
    thumb: "https://picsum.photos/seed/project-four-thumb/800/600",
    hero: "https://picsum.photos/seed/project-four-hero/1600/900",
    role: "UI/UX Design",
    year: "2024",
    description: "Lorem ipsum is simply dummy text of the printing and typesetting industry. Replace this with a real description of the project.",
    media: [
      { type: "image", src: "https://picsum.photos/seed/project-four-1/1200/900", caption: "Sunt in culpa qui officia deserunt mollit anim id est laborum." }
    ]
  },
  {
    slug: "project-five",
    title: "Project Five",
    category: "Editorial",
    thumb: "https://picsum.photos/seed/project-five-thumb/800/600",
    hero: "https://picsum.photos/seed/project-five-hero/1600/900",
    role: "Editorial Design",
    year: "2024",
    description: "Lorem ipsum is simply dummy text of the printing and typesetting industry. Replace this with a real description of the project.",
    media: [
      { type: "image", src: "https://picsum.photos/seed/project-five-1/1200/1500", caption: "At vero eos et accusamus et iusto odio dignissimos." },
      { type: "image", src: "https://picsum.photos/seed/project-five-2/1200/900", caption: "Ducimus qui blanditiis praesentium voluptatum." }
    ]
  }
];
```

- [ ] **Step 2: Verify the module loads without syntax errors**

Run: `node --input-type=module -e "import('./js/data.js').then(m => console.log(m.PROJECTS.length, m.PROJECTS[0].slug))"`
Expected: `5 project-one`

- [ ] **Step 3: Commit**

```bash
git add js/data.js
git commit -m "feat: add placeholder project data"
```

---

### Task 3: Home page horizontal-scroll grid

**Files:**
- Create: `js/home.js`
- Modify: `index.html:20` — add `<script type="module" src="js/home.js"></script>` before `</body>`

**Interfaces:**
- Consumes: `PROJECTS` from `js/data.js` (Task 2), element `#project-grid` from `index.html` (Task 1).
- Produces: renders `.grid-item` anchors (matching the CSS classes from Task 1) into `#project-grid`, and wires wheel + pointer-drag horizontal scrolling on that element.

- [ ] **Step 1: Create `js/home.js`**

```js
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
```

- [ ] **Step 2: Wire the script into `index.html`**

In `index.html`, replace:

```html
<script>document.getElementById("year").textContent = new Date().getFullYear();</script>
</body>
```

with:

```html
<script>document.getElementById("year").textContent = new Date().getFullYear();</script>
<script type="module" src="js/home.js"></script>
</body>
```

- [ ] **Step 3: Verify in a real browser**

Run: `cd /Users/sinjiseon/Desktop/Workspace/Oase && python3 -m http.server 8000 &`
Open `http://localhost:8000/index.html` in a browser (or the Claude Browser preview tool).
Expected, checked visually:
- 5 project thumbnails appear in a horizontal row under the intro text.
- Scrolling the mouse wheel while hovering the row moves it left/right (not the page vertically).
- Clicking and dragging left/right inside the row also scrolls it, and the cursor changes to a "grabbing" hand while dragging.
- Clicking a thumbnail navigates to `project.html?slug=<that-project>`.

Stop the server afterward with `kill %1`.

- [ ] **Step 4: Commit**

```bash
git add js/home.js index.html
git commit -m "feat: render home project grid with wheel and drag horizontal scroll"
```

---

### Task 4: Info page content

Already implemented in Task 1, Step 3 (`info.html` is static and needs no JS). This task confirms it independently since it is its own reviewable deliverable.

**Files:**
- Verify: `info.html`

- [ ] **Step 1: Verify Info page renders standalone**

Run: `cd /Users/sinjiseon/Desktop/Workspace/Oase && python3 -m http.server 8000 &`
Open `http://localhost:8000/info.html`.
Expected, checked visually:
- Header shows "Info" as the active (white, not muted) nav item.
- About heading, intro paragraph, and email/Instagram links are visible and styled consistently with the home page (same dark background, same header layout).

Stop the server afterward with `kill %1`.

- [ ] **Step 2: Commit**

Skip if Task 1's commit already includes `info.html` unchanged — no new commit needed here. If any fix was required in Step 1, commit it:

```bash
git add info.html
git commit -m "fix: adjust info page content"
```

---

### Task 5: Project detail page rendering

**Files:**
- Create: `js/project.js`
- Modify: `project.html:29` — add `<script type="module" src="js/project.js"></script>` before `</body>`

**Interfaces:**
- Consumes: `PROJECTS` from `js/data.js` (Task 2); elements `#project-hero`, `#project-title`, `#project-description`, `#project-meta`, `#project-media`, `#project-prev`, `#project-next` from `project.html` (Task 1).
- Produces: fully rendered project detail view driven by the `?slug=` query parameter, with prev/next links cycling through `PROJECTS`.

- [ ] **Step 1: Create `js/project.js`**

```js
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
```

- [ ] **Step 2: Wire the script into `project.html`**

In `project.html`, replace:

```html
<script>document.getElementById("year").textContent = new Date().getFullYear();</script>
</body>
```

with:

```html
<script>document.getElementById("year").textContent = new Date().getFullYear();</script>
<script type="module" src="js/project.js"></script>
</body>
```

- [ ] **Step 3: Verify in a real browser**

Run: `cd /Users/sinjiseon/Desktop/Workspace/Oase && python3 -m http.server 8000 &`
Open `http://localhost:8000/project.html?slug=project-two`.
Expected, checked visually:
- Hero image, title "Project Two", description, role, and year are all populated (not blank).
- The media section below shows 1 image with its caption.
- Bottom nav shows "← Project One" on the left and "Project Three →" on the right, and clicking either navigates to that project's page with its own content.
- Opening `http://localhost:8000/project.html` with no `slug` query param redirects to `index.html`.

Stop the server afterward with `kill %1`.

- [ ] **Step 4: Commit**

```bash
git add js/project.js project.html
git commit -m "feat: render project detail page from slug with prev/next navigation"
```

---

### Task 6: Responsive check and content-replacement README

**Files:**
- Verify: `css/style.css` (the `@media (max-width: 720px)` block from Task 1)
- Create: `README.md`

**Interfaces:**
- None — this task documents and verifies existing behavior; it does not introduce new interfaces.

- [ ] **Step 1: Create `README.md`**

```markdown
# Portfolio Site

정적 HTML/CSS/JS로 만든 개인 포트폴리오 웹사이트입니다.

## 로컬에서 보기

Python이 설치되어 있다면:

\`\`\`bash
python3 -m http.server 8000
\`\`\`

브라우저에서 http://localhost:8000 접속하세요.

(홈/프로젝트 페이지가 JS 모듈(`type="module"`)을 사용하므로, 파일을 더블클릭해서 여는 대신 반드시 위 방법으로 로컬 서버를 통해 실행해야 합니다.)

## 실제 콘텐츠로 교체하기

1. **이름/연락처**: `index.html`, `info.html`, `project.html`에 있는 "YOUR NAME", "hey@yourmail.com", Instagram 링크를 본인 정보로 수정하세요.
2. **소개 문구**: `index.html`의 `.intro` 문단과 `info.html`의 소개 문단을 수정하세요.
3. **프로젝트 콘텐츠**: `js/data.js`의 `PROJECTS` 배열에서 각 프로젝트의 `title`, `category`, `thumb`, `hero`, `role`, `year`, `description`, `media`를 실제 내용으로 교체하세요.
   - 이미지/GIF 파일은 원하는 폴더(예: `images/`)에 넣고 `thumb`, `hero`, `media[].src`에 그 경로를 지정하면 됩니다.
   - 영상 파일을 넣으려면 해당 `media` 항목의 `type`을 `"video"`로 지정하세요. GIF와 이미지는 `type: "image"`를 그대로 사용합니다.
4. 프로젝트를 추가하거나 삭제하려면 `PROJECTS` 배열에 항목을 추가/삭제하면 홈 화면 그리드와 상세 페이지에 자동으로 반영됩니다.
```

- [ ] **Step 2: Verify the responsive layout**

Run: `cd /Users/sinjiseon/Desktop/Workspace/Oase && python3 -m http.server 8000 &`
Open `http://localhost:8000/index.html` in a browser and resize the viewport to 375px wide (or use browser devtools' mobile emulation).
Expected, checked visually:
- Header stacks into a column (brand/nav on top, contact info below it) instead of staying side-by-side.
- Project grid thumbnails shrink to the narrower mobile size and remain horizontally scrollable.
- No horizontal overflow of the page itself (only the intended project grid scrolls sideways).

Repeat the resize check on `info.html` and a `project.html?slug=...` URL.
Stop the server afterward with `kill %1`.

- [ ] **Step 3: Commit**

```bash
git add README.md
git commit -m "docs: add README with local preview and content-replacement instructions"
```

---

### Task 7: Full-site verification pass

**Files:**
- Verify: `index.html`, `info.html`, `project.html`, `css/style.css`, `js/data.js`, `js/home.js`, `js/project.js`

**Interfaces:**
- None — final integration check across all prior tasks.

- [ ] **Step 1: Serve the site and check every page for console errors**

Run: `cd /Users/sinjiseon/Desktop/Workspace/Oase && python3 -m http.server 8000 &`
Open each of the following in a browser and check the developer console:
- `http://localhost:8000/index.html`
- `http://localhost:8000/info.html`
- `http://localhost:8000/project.html?slug=project-one`
- `http://localhost:8000/project.html?slug=project-five`

Expected: no errors logged in the console on any of the four pages.

- [ ] **Step 2: Walk the full navigation path**

From `index.html`:
1. Click the first project thumbnail → lands on its detail page with correct content.
2. Click "Info" in the header → lands on `info.html`.
3. Click "Work" in the header → returns to `index.html`.
4. On a project detail page, click the "next" link 5 times in a row → cycles through all 5 projects and wraps back to the first.

Expected: every step navigates to the correct page with no broken links (no 404s) and no blank content.

- [ ] **Step 3: Stop the local server**

Run: `kill %1`

- [ ] **Step 4: Final commit**

```bash
git add -A
git status
```

If anything is unstaged from fixes made during this task, commit it:

```bash
git commit -m "fix: address issues found in full-site verification pass"
```

If nothing changed, skip the commit — this task was verification-only.
