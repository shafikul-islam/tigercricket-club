/* ============================================================
   BATON ROUGE TIGERS — MAIN SCRIPT
   Renders everything from CLUB (data.js) and runs the UI.
   No libraries — works on plain GitHub Pages.
   ============================================================ */
(function () {
  "use strict";
  const C = window.CLUB || {};
  const $ = (s, el = document) => el.querySelector(s);
  const el = (tag, cls, html) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  };
  const initials = (name) =>
    name.trim().split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  /* ---------- Hero + text bindings ---------- */
  $("#heroTag").textContent = C.subTagline || "";
  $("#heroEyebrow").textContent = C.league || "";
  $("#aboutHeading").textContent = C.about?.heading || "Who We Are";
  $("#aboutBody").innerHTML = (C.about?.body || []).map((p) => `<p>${p}</p>`).join("");
  $("#aboutVision").textContent = C.about?.vision ? "“" + C.about.vision + "”" : "";
  $("#aboutFounded").textContent = C.foundedYear || "";
  $("#donateHeading").textContent = C.donate?.heading || "Support the Tigers";
  $("#donateBody").textContent = C.donate?.body || "";
  $("#footerTag").textContent = C.tagline || "";
  $("#year").textContent = new Date().getFullYear();

  /* Links */
  const fb = C.links?.facebook || "#";
  const mail = C.links?.email ? "mailto:" + C.links.email : "#";
  if ($("#fbLink")) $("#fbLink").href = fb;
  if ($("#fbLink2")) $("#fbLink2").href = fb;
  if ($("#emailLink")) $("#emailLink").href = mail;
  if ($("#footerLca")) $("#footerLca").href = C.links?.lca || "#";

  /* ---------- Stats (count up) ---------- */
  const statsGrid = $("#statsGrid");
  (C.stats || []).forEach((s) => {
    const box = el("div", "stat");
    box.innerHTML = `<div class="stat__num" data-to="${s.value}">0</div><div class="stat__label">${s.label}</div>`;
    statsGrid.appendChild(box);
  });

  function countUp(node) {
    const to = +node.dataset.to;
    const dur = 1400;
    const start = performance.now();
    (function step(now) {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      node.textContent = Math.round(to * eased).toLocaleString();
      if (p < 1) requestAnimationFrame(step);
    })(start);
  }

  /* ---------- Squad ---------- */
  const squadGrid = $("#squadGrid");
  (C.squad || []).forEach((p) => {
    const card = el("div", "player");
    let tag = "";
    if (/captain/i.test(p.role) && !/vice/i.test(p.role)) tag = `<span class="player__tag">Captain</span>`;
    else if (/vice/i.test(p.role)) tag = `<span class="player__tag vc">Vice Captain</span>`;
    card.innerHTML = `
      <div class="player__avatar">${initials(p.name)}</div>
      <div class="player__name">${p.name}</div>
      <div class="player__role">${p.role || "Player"}</div>
      ${tag}`;
    squadGrid.appendChild(card);
  });

  /* ---------- Results ---------- */
  const resultsList = $("#resultsList");
  (C.results || []).forEach((r) => {
    const li = el("li");
    const cls = /won/i.test(r.result) ? "won" : /lost/i.test(r.result) ? "lost" : "tie";
    const d = new Date(r.date + "T00:00:00");
    const ds = isNaN(d) ? r.date : d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    li.innerHTML = `
      <span class="res-badge ${cls}">${r.result}</span>
      <span class="res-main"><b>vs ${r.opponent}</b><span>${r.score || ""}</span></span>
      <span class="res-date">${ds}</span>`;
    resultsList.appendChild(li);
  });

  /* ---------- Gallery ---------- */
  const galleryGrid = $("#galleryGrid");
  (C.gallery || []).forEach((g) => {
    const item = el("div", "gallery__item");
    item.innerHTML = `<img src="${g.src}" alt="${g.caption || "Tigers photo"}" loading="lazy" />
      <div class="gallery__cap">${g.caption || ""}</div>`;
    galleryGrid.appendChild(item);
  });

  /* ---------- Alumni ---------- */
  const alumniGrid = $("#alumniGrid");
  (C.alumni || []).forEach((a) => {
    const n = el("div", "alum");
    n.innerHTML = `<div class="alum__badge">${initials(a.name)}</div><div class="alum__name">${a.name}</div>`;
    alumniGrid.appendChild(n);
  });

  /* ---------- Special thanks ---------- */
  const thanksGrid = $("#thanksGrid");
  (C.contributors || []).forEach((t) => {
    const n = el("div", "thank");
    n.innerHTML = `<div class="thank__name">${t.name}</div><div class="thank__note">${t.note || ""}</div>`;
    thanksGrid.appendChild(n);
  });

  /* ---------- Sponsors ---------- */
  const sponsorsGrid = $("#sponsorsGrid");
  (C.sponsors || []).forEach((s) => {
    const n = el("div", "sponsor");
    const inner = `${s.img ? `<img src="${s.img}" alt="${s.name}" loading="lazy" />` : ""}
      <b>${s.name}</b><span>${s.note || ""}</span>`;
    n.innerHTML = s.url ? `<a href="${s.url}" target="_blank" rel="noopener">${inner}</a>` : inner;
    sponsorsGrid.appendChild(n);
  });

  /* ---------- Donate methods ---------- */
  const donateMethods = $("#donateMethods");
  (C.donate?.methods || []).forEach((m) => {
    if (!m.detail && !m.note) return;
    const n = el("div", "donate__method");
    n.innerHTML = `<b>${m.label}</b><span>${m.detail || m.note}</span>`;
    donateMethods.appendChild(n);
  });

  /* ---------- Join form (placeholder) ---------- */
  const form = $("#joinForm");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = form.name.value || "there";
      const subject = encodeURIComponent("Tigers website — " + form.interest.value);
      const body = encodeURIComponent(
        `Name: ${form.name.value}\nEmail: ${form.email.value}\nInterest: ${form.interest.value}\n\n${form.message.value}`
      );
      // Simple fallback: open the user's email client. Swap for Formspree later.
      window.location.href = `mailto:${C.links?.email || ""}?subject=${subject}&body=${body}`;
    });
  }

  /* ============================================================
     DYNAMIC LIVE SCORE
     ------------------------------------------------------------
     Right now this shows the next/last match from data.js.
     To make it truly live, set LIVE_FEED_URL to an endpoint that
     returns JSON like: { match, score, status }
     (e.g. a cricket API, or your own Google Apps Script).
     See README → "Adding dynamic content".
     ============================================================ */
  const LIVE_FEED_URL = ""; // <-- paste your endpoint here to go live

  function renderScore(data, isLive) {
    const body = $("#liveScoreBody");
    const note = $("#liveScoreNote");
    body.innerHTML = `
      <div class="ls-match">${data.match || "Baton Rouge Tigers"}</div>
      <div class="ls-score">${data.score || "TBD"}</div>
      <div>${data.status || ""}</div>`;
    note.textContent = isLive ? "Live feed connected." : "Showing latest result — connect a live feed in data.js / README.";
    if (!isLive) $("#liveScore .live-dot").style.animation = "none";
  }

  function loadLiveScore() {
    // Fallback from static data
    const latest = (C.results || [])[0];
    const fallback = latest
      ? { match: "Tigers vs " + latest.opponent, score: latest.result + " — " + (latest.score || ""), status: "Most recent result" }
      : { match: "Baton Rouge Tigers", score: "Season loading", status: "" };

    if (!LIVE_FEED_URL) {
      renderScore(fallback, false);
      return;
    }
    fetch(LIVE_FEED_URL)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => renderScore(d, true))
      .catch(() => renderScore(fallback, false));
  }
  loadLiveScore();

  /* ============================================================
     UI BEHAVIOUR
     ============================================================ */
  // Nav scroll state
  const nav = $("#nav");
  const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 40);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // Mobile menu
  const toggle = $("#navToggle");
  const links = $("#navLinks");
  toggle?.addEventListener("click", () => {
    const open = links.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open);
  });
  links?.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => links.classList.remove("open"))
  );

  // Reveal on scroll + count-up trigger
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        en.target.classList.add("in");
        en.target.querySelectorAll?.("[data-to]").forEach(countUp);
        io.unobserve(en.target);
      });
    },
    { threshold: 0.15 }
  );
  document.querySelectorAll(".reveal, #statsGrid").forEach((n) => io.observe(n));
})();
