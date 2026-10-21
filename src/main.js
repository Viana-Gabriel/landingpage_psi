// Vite puro, sem framework: este arquivo cuida de toda a interação do
// usuário via JavaScript (nada de checkbox hack, radio+label ou
// <details>/<summary> fazendo o trabalho por baixo dos panos).
import "./style.css";

// ---------------------------------------------------------------------
// Menu mobile
// ---------------------------------------------------------------------
function setupMobileNav() {
  const toggle = document.getElementById("nav-toggle");
  const nav = document.getElementById("nav");

  function closeNav() {
    nav.classList.remove("nav--open");
    toggle.setAttribute("aria-expanded", "false");
  }

  function toggleNav() {
    const isOpen = nav.classList.toggle("nav--open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  }

  toggle.addEventListener("click", toggleNav);

  // Fecha o menu ao clicar em qualquer link de navegação
  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeNav);
  });
}

// ---------------------------------------------------------------------
// Cards de "Como funciona o atendimento"
// ---------------------------------------------------------------------
function setupStepCards() {
  const list = document.getElementById("step-list");
  if (!list) return;

  const cards = Array.from(list.querySelectorAll(".step-card"));

  list.addEventListener("click", (event) => {
    const card = event.target.closest(".step-card");
    if (!card) return;

    cards.forEach((c) => c.classList.toggle("step-card--active", c === card));
  });
}

// ---------------------------------------------------------------------
// Perguntas frequentes (acordeão)
// ---------------------------------------------------------------------
function setupFaq() {
  const list = document.getElementById("faq-list");
  if (!list) return;

  const rows = Array.from(list.querySelectorAll(".faq-row"));

  function openRow(row) {
    const trigger = row.querySelector(".faq-row__trigger");
    row.classList.add("faq-row--open");
    trigger.setAttribute("aria-expanded", "true");
  }

  function closeRow(row) {
    const trigger = row.querySelector(".faq-row__trigger");
    row.classList.remove("faq-row--open");
    trigger.setAttribute("aria-expanded", "false");
  }

  list.addEventListener("click", (event) => {
    const trigger = event.target.closest(".faq-row__trigger");
    if (!trigger) return;

    const row = trigger.closest(".faq-row");
    const wasOpen = row.classList.contains("faq-row--open");

    // Mantém só uma pergunta aberta por vez
    rows.forEach(closeRow);
    if (!wasOpen) openRow(row);
  });
}

// ---------------------------------------------------------------------
// Formulário de newsletter
// ---------------------------------------------------------------------
function setupNewsletterForm() {
  const form = document.getElementById("newsletter-form");
  const success = document.getElementById("newsletter-success");
  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = document.getElementById("newsletter-email").value.trim();
    if (!email) return;

    // Aqui entraria a chamada para o seu serviço de e-mail marketing
    // (Mailchimp, RD Station, etc). Por enquanto, só confirma na tela.
    form.hidden = true;
    success.hidden = false;
  });
}

// ---------------------------------------------------------------------
// Ano do rodapé
// ---------------------------------------------------------------------
function setupFooterYear() {
  document.getElementById("year").textContent = new Date().getFullYear();
}

// ---------------------------------------------------------------------

// ---------------------------------------------------------------------
// Header translúcido ao rolar a página
// ---------------------------------------------------------------------
function setupHeaderScroll() {
  const header = document.querySelector(".header");
  if (!header) return;

  const THRESHOLD = 8;

  function update() {
    header.classList.toggle("header--scrolled", window.scrollY > THRESHOLD);
  }

  update(); // estado correto se a página carregar já rolada
  window.addEventListener("scroll", update, { passive: true });
}


function setupServicesCarousel() {
  const track = document.querySelector("#servicos .cards-row");
  const dotsBox = document.getElementById("servicos-dots");
  if (!track || !dotsBox) return;

  const cards = Array.from(track.querySelectorAll(".service-card"));

  const dots = cards.map((card, i) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.setAttribute("aria-label", `Ir para o card ${i + 1} de ${cards.length}`);
    dot.addEventListener("click", () => {
      track.scrollTo({ left: card.offsetLeft - track.offsetLeft - 24, behavior: "smooth" });
    });
    dotsBox.appendChild(dot);
    return dot;
  });

  function update() {
    const step = cards[0].offsetWidth + 16;
    const index = Math.min(cards.length - 1, Math.round(track.scrollLeft / step));
    dots.forEach((d, i) => d.setAttribute("aria-current", String(i === index)));
  }

  track.addEventListener("scroll", update, { passive: true });
  update();
}
// ---------------------------------------------------------------------
// Arraste com mouse para carrosséis com rolagem nativa
// ---------------------------------------------------------------------
function setupDragScroll(track) {
  if (!track) return;

  let pointerId = null;
  let startX = 0;
  let startScroll = 0;
  let targetScroll = 0;
  let dragging = false;
  let suppressClick = false;
  let frameId = 0;

  function render() {
    frameId = 0;
    track.scrollLeft = targetScroll;
  }

  function finish() {
    if (pointerId === null) return;

    const capturedId = pointerId;
    pointerId = null;

    if (frameId) {
      cancelAnimationFrame(frameId);
      render();
    }

    if (dragging) {
      dragging = false;
      track.classList.remove("is-dragging");
    }

    if (track.hasPointerCapture(capturedId)) {
      track.releasePointerCapture(capturedId);
    }
  }

  track.addEventListener("pointerdown", (event) => {
    // Toque e caneta continuam com o comportamento nativo.
    if (
      event.pointerType !== "mouse" ||
      event.button !== 0 ||
      pointerId !== null
    ) {
      return;
    }

    // Preserva links, botões e campos dentro dos cards.
    if (
      event.target.closest(
        "a, button, input, textarea, select, [contenteditable]"
      )
    ) {
      return;
    }

    pointerId = event.pointerId;
    startX = event.clientX;
    startScroll = track.scrollLeft;
    targetScroll = startScroll;
    suppressClick = false;
  });

  track.addEventListener("pointermove", (event) => {
    if (event.pointerId !== pointerId) return;

    const deltaX = event.clientX - startX;

    // Pequenos movimentos não são tratados como arraste.
    if (!dragging) {
      if (Math.abs(deltaX) < 6) return;

      dragging = true;
      suppressClick = true;

      track.classList.add("is-dragging");
      track.setPointerCapture(pointerId);
    }

    event.preventDefault();

    targetScroll = startScroll - deltaX;

    // No máximo uma atualização pendente por frame.
    if (!frameId) {
      frameId = requestAnimationFrame(render);
    }
  });

  function handleEnd(event) {
    if (event.pointerId === pointerId) finish();
  }

  track.addEventListener("pointerup", handleEnd);
  track.addEventListener("pointercancel", handleEnd);
  track.addEventListener("lostpointercapture", handleEnd);

  // Antes de iniciar o arraste, o mouse pode sair sem captura.
  track.addEventListener("pointerleave", (event) => {
    if (!dragging) handleEnd(event);
  });

  // Evita o arraste nativo de imagens interferindo no gesto.
  track.addEventListener("dragstart", (event) => {
    if (pointerId !== null) event.preventDefault();
  });

  // Não dispara cliques acidentais depois de arrastar.
  track.addEventListener(
    "click",
    (event) => {
      if (!suppressClick || event.detail === 0) return;

      event.preventDefault();
      event.stopPropagation();
      suppressClick = false;
    },
    true
  );
}

setupMobileNav();
setupHeaderScroll();
setupStepCards();
setupFaq();
setupNewsletterForm();
setupFooterYear();
setupServicesCarousel();
setupDragScroll(
  document.querySelector("#depoimentos .testimonials-carousel")
);
