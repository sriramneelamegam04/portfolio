/* Portfolio scripts: project loader, modal, image viewer, contact population, reveal animations */

let currentCarouselIndex = 0;
let currentCarouselImages = [];

// Load projects.json and render grid
async function loadProjects() {
  try {
    const res = await fetch("projects.json");
    if (!res.ok) throw new Error("projects.json not found or path incorrect");
    const data = await res.json();
    const grid = document.getElementById("projects-grid");
    const tmpl = document.getElementById("proj-tmpl").content;

    grid.innerHTML = ""; // clear old

    data.forEach((p) => {
      const clone = document.importNode(tmpl, true);

      // Thumbnail → first screenshot
      const thumb = clone.querySelector(".proj-thumb");
      let firstImg =
        p.screenshots?.[0] || p.images?.[0] || "images/default_thumb.jpg";
      thumb.src = firstImg;
      thumb.alt = `${p.name} thumbnail`;
      thumb.addEventListener("click", () => openModal(p));

      // Text info
      clone.querySelector(".proj-title").textContent = p.name;
      clone.querySelector(".proj-tagline").textContent = p.tagline || "";
      clone.querySelector(".proj-desc").textContent = p.short || "";
      const techEl = clone.querySelector(".proj-tech");
      if (p.tech && p.tech.length) {
        techEl.innerHTML = p.tech
          .map((t) => `<span class="tech-badge">${t}</span>`)
          .join(" ");
      } else {
        techEl.textContent = "";
      }

      // GitHub link
      const viewCode = clone.querySelector(".view-code");
      if (p.github) viewCode.href = p.github;
      else viewCode.style.display = "none";   

      // Details button
      const detailsBtn = clone.querySelector(".details-btn");
      detailsBtn.addEventListener("click", () => openModal(p));

      // Make card visible with animation
      requestAnimationFrame(() => {
        clone.firstElementChild.classList.add("show");
      });

      grid.appendChild(clone);
    });

    // Populate contact section with top projects
    populateContactList(data);
    console.log("Projects loaded:", data.length);
  } catch (err) {
    console.error("Error loading projects.json:", err);
  }
}

// -------- MODAL + CAROUSEL --------
function openModal(project) {
  const modal = document.getElementById("proj-modal");
  modal.classList.remove("hidden");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden"; // lock scroll on modal open

  document.getElementById("modal-title").textContent = project.name;
  document.getElementById("modal-long").textContent =
    project.long || project.short || "";

  const screens = document.getElementById("modal-screens");
  screens.innerHTML = "";
  screens.style.position = "relative"; // so carousel btns position absolute works

  currentCarouselImages = project.screenshots?.length
    ? project.screenshots
    : project.images || [];
  currentCarouselIndex = 0;

  if (currentCarouselImages.length === 0) {
    screens.textContent = "No screenshots available";
    return;
  }

  // Add first image
  const img = document.createElement("img");
  img.src = currentCarouselImages[currentCarouselIndex];
  img.alt = project.name;
  img.classList.add("modal-img");
  img.addEventListener("click", () => openImageViewer(img.src));
  screens.appendChild(img);

  // Carousel buttons
  if (currentCarouselImages.length > 1) {
    const prevBtn = document.createElement("button");
    prevBtn.textContent = "⟨";
    prevBtn.className = "carousel-btn prev";
    prevBtn.addEventListener("click", () => changeCarousel(-1));
    screens.appendChild(prevBtn);

    const nextBtn = document.createElement("button");
    nextBtn.textContent = "⟩";
    nextBtn.className = "carousel-btn next";
    nextBtn.addEventListener("click", () => changeCarousel(1));
    screens.appendChild(nextBtn);
  }
}

function changeCarousel(direction) {
  currentCarouselIndex += direction;
  if (currentCarouselIndex < 0)
    currentCarouselIndex = currentCarouselImages.length - 1;
  if (currentCarouselIndex >= currentCarouselImages.length)
    currentCarouselIndex = 0;
  const img = document.querySelector("#modal-screens .modal-img");
  if (img) img.src = currentCarouselImages[currentCarouselIndex];
}

function closeModal() {
  const modal = document.getElementById("proj-modal");
  modal.classList.add("hidden");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = ""; // unlock scroll
}

// -------- FULLSCREEN IMAGE VIEWER --------
function openImageViewer(src) {
  const viewer = document.getElementById("img-viewer");
  const iv = document.getElementById("iv-img");
  iv.src = src;
  viewer.classList.remove("hidden");
}
function closeImageViewer() {
  const viewer = document.getElementById("img-viewer");
  viewer.classList.add("hidden");
  document.getElementById("iv-img").src = "";
}

// -------- CONTACT PROJECT LIST --------
function populateContactList(data) {
  const ul = document.getElementById("contact-projects");
  if (!ul) return;
  ul.innerHTML = "";
  data.slice(0, 5).forEach((p) => {
    const li = document.createElement("li");
    li.textContent = `${p.name} — ${p.tagline || p.short || ""}`;
    ul.appendChild(li);
  });
}

// -------- ANIMATED REVEAL ON SCROLL --------
function setupReveal() {
  const els = document.querySelectorAll(".reveal");
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) e.target.classList.add("is-visible");
      });
    },
    { threshold: 0.15 }
  );
  els.forEach((el) => io.observe(el));
}

// Wire up close buttons
document.addEventListener("click", (e) => {
  if (
    e.target.matches("#modal-close") ||
    e.target.matches(".proj-modal .modal-overlay")
  )
    closeModal();
  if (
    e.target.matches("#iv-close") ||
    e.target.matches(".img-viewer .iv-overlay")
  )
    closeImageViewer();
});

// ESC key close support
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeModal();
    closeImageViewer();
  }
});

// Init
window.addEventListener("DOMContentLoaded", () => {
  loadProjects();
  setupReveal();
});
