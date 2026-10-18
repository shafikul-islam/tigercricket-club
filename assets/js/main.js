/* ============================================================
   BATON ROUGE TIGERS — MAIN SCRIPT
   Renders everything from CLUB (data.js), runs the cricket
   animations, and handles the UI. No libraries — plain
   GitHub Pages friendly.
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
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const BALL_SVG = '<svg viewBox="0 0 100 100" aria-hidden="true"><use href="#ballSym" /></svg>';

  /* ============================================================
     CONTENT
     ============================================================ */
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

  const fb = C.links?.facebook || "#";
  const mail = C.links?.email ? "mailto:" + C.links.email : "#";
  $("#fbLink").href = fb;
  $("#fbLink2").href = fb;
  $("#emailLink").href = mail;
  $("#footerLca").href = C.links?.lca || "#";

  /* Hero background: video > photo > stadium drawn in code */
  const heroBg = $("#heroBg");
  let sceneMode = true;
  if (C.hero?.video) {
    heroBg.classList.add("is-photo");
    heroBg.insertAdjacentHTML("beforeend", `<video src="${C.hero.video}" autoplay muted loop playsinline></video>`);
    sceneMode = false;
  } else if (C.hero?.background) {
    heroBg.classList.add("is-photo");
    heroBg.style.backgroundImage = `url("${C.hero.background}")`;
    sceneMode = false;
  }

  /* ---------- Scoreboard ---------- */
  const statsGrid = $("#statsGrid");
  (C.stats || []).forEach((s) => {
    const box = el("div", "sb");
    const digits = String(s.value).split("").map((d) => `<span class="sb__d" data-d="${d}">0</span>`).join("");
    box.innerHTML = `<div class="sb__label">${s.label}</div><div class="sb__digits">${digits}</div>`;
    statsGrid.appendChild(box);
  });

  // Each tile rolls through digits, then flips onto its real value.
  function rollScoreboard(root) {
    root.querySelectorAll(".sb__d").forEach((tile, i) => {
      const final = tile.dataset.d;
      if (reduceMotion) { tile.textContent = final; return; }
      const stopAt = performance.now() + 500 + i * 110;
      const tick = () => {
        if (performance.now() >= stopAt) {
          tile.textContent = final;
          tile.classList.remove("flip"); void tile.offsetWidth; tile.classList.add("flip");
          return;
        }
        tile.textContent = Math.floor(Math.random() * 10);
        setTimeout(tick, 55);
      };
      tick();
    });
  }

  /* ---------- Squad ---------- */
  const squadGrid = $("#squadGrid");
  (C.squad || []).forEach((p) => {
    const card = el("div", "player");
    let tag = "";
    if (/vice/i.test(p.role)) tag = `<span class="player__tag vc">Vice Captain</span>`;
    else if (/captain/i.test(p.role)) tag = `<span class="player__tag">Captain</span>`;
    card.innerHTML = `
      <div class="player__avatar">${initials(p.name)}</div>
      <div class="player__name">${p.name}</div>
      <div class="player__role">${p.role || "Player"}</div>
      ${tag}
      <span class="player__roll">${BALL_SVG}</span>`;
    squadGrid.appendChild(card);
  });

  // Gentle 3D tilt that follows the cursor
  if (!reduceMotion && window.matchMedia("(hover: hover)").matches) {
    squadGrid.addEventListener("mousemove", (e) => {
      const card = e.target.closest(".player");
      if (!card) return;
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `rotateY(${x * 14}deg) rotateX(${-y * 14}deg) translateY(-4px)`;
    });
    squadGrid.addEventListener("mouseout", (e) => {
      const card = e.target.closest(".player");
      if (card && !card.contains(e.relatedTarget)) card.style.transform = "";
    });
  }

  /* ---------- Results + form guide ---------- */
  const resultsList = $("#resultsList");
  const form = [];
  (C.results || []).forEach((r) => {
    const li = el("li");
    const cls = /won/i.test(r.result) ? "won" : /lost/i.test(r.result) ? "lost" : "tie";
    form.push(cls === "won" ? "w" : cls === "lost" ? "l" : "t");
    const d = new Date(r.date + "T00:00:00");
    const ds = isNaN(d) ? r.date : d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    li.innerHTML = `
      <span class="res-badge ${cls}">${r.result}</span>
      <span class="res-main"><b>vs ${r.opponent}</b><span>${r.score || ""}</span></span>
      <span class="res-date">${ds}</span>`;
    resultsList.appendChild(li);
  });
  if (form.length) {
    $("#formGuide").innerHTML =
      "Form " + form.map((f) => `<i class="${f}">${f.toUpperCase()}</i>`).join("");
  }

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

  /* ---------- Donation tiers (cricket scores) ---------- */
  const tiersEl = $("#donateTiers");
  const picked = $("#tierPicked");
  (C.donate?.tiers || []).forEach((t) => {
    const b = el("button", "tier" + (t.featured ? " tier--featured" : ""));
    b.type = "button";
    const runs = String(t.runs).split("").map((d) => `<span class="sb__d">${d}</span>`).join("");
    b.innerHTML = `
      ${t.featured ? '<span class="tier__ribbon">MOST POPULAR</span>' : ""}
      <div class="tier__runs">${runs}</div>
      <div class="tier__name">${t.name}</div>
      <div class="tier__amt">$${t.amount}</div>
      <div class="tier__funds">${t.funds}</div>`;
    b.addEventListener("click", () => {
      tiersEl.querySelectorAll(".tier").forEach((x) => x.classList.remove("is-picked"));
      b.classList.add("is-picked");
      picked.textContent = `${t.name} — $${t.amount}. Send it with any option below. Thank you, Tiger! 🐯`;
      $("#donateMethods").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
    });
    tiersEl.appendChild(b);
  });

  const donateMethods = $("#donateMethods");
  (C.donate?.methods || []).forEach((m) => {
    if (!m.detail && !m.note) return;
    const n = el("div", "donate__method");
    n.innerHTML = `<b>${m.label}</b><span>${m.detail || m.note}</span>`;
    donateMethods.appendChild(n);
  });

  /* ---------- Join form (opens email until a form service is connected) ---------- */
  const joinForm = $("#joinForm");
  joinForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const subject = encodeURIComponent("Tigers website — " + joinForm.interest.value);
    const body = encodeURIComponent(
      `Name: ${joinForm.name.value}\nEmail: ${joinForm.email.value}\nInterest: ${joinForm.interest.value}\n\n${joinForm.message.value}`
    );
    window.location.href = `mailto:${C.links?.email || ""}?subject=${subject}&body=${body}`;
  });

  /* ============================================================
     LIVE SCORE — set LIVE_FEED_URL to an endpoint returning
     { match, score, status } to go live (see README).
     ============================================================ */
  const LIVE_FEED_URL = "";

  function renderScore(data, isLive) {
    $("#liveScoreBody").innerHTML = `
      <div class="ls-match">${data.match || "Baton Rouge Tigers"}</div>
      <div class="ls-score">${data.score || "TBD"}</div>
      <div>${data.status || ""}</div>`;
    $("#liveScoreNote").textContent = isLive ? "Live feed connected." : "Latest result from the Tigers' season.";
    if (!isLive) $("#liveScore .live-dot").style.animation = "none";
  }
  (function loadLiveScore() {
    const latest = (C.results || [])[0];
    const fallback = latest
      ? { match: "Tigers vs " + latest.opponent, score: latest.score || latest.result, status: latest.result + " · most recent match" }
      : { match: "Baton Rouge Tigers", score: "Season loading", status: "" };
    if (!LIVE_FEED_URL) return renderScore(fallback, false);
    fetch(LIVE_FEED_URL)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => renderScore(d, true))
      .catch(() => renderScore(fallback, false));
  })();

  /* ============================================================
     HERO — "you're the batter": delivery, bat swing, SIX,
     and the ball lands in the Donate button.
     ============================================================ */
  const hero = $("#home");
  const canvas = $("#heroFx");
  const ctx = canvas.getContext("2d");
  const sceneCanvas = $("#heroScene");
  const sctx = sceneCanvas.getContext("2d");
  const flashesEl = $("#heroFlashes");
  const donateBtn = $("#heroDonate");
  const ballTarget = $("#heroBallTarget");

  let W = 0, H = 0, dpr = 1;
  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = hero.clientWidth; H = hero.clientHeight;
    canvas.width = W * dpr; canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (sceneMode) {
      sceneCanvas.width = W * dpr; sceneCanvas.height = H * dpr;
      drawScene();
      placeFlashes();
    }
  }

  const lerp = (a, b, t) => a + (b - a) * t;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const easeIn = (t) => t * t;
  const easeOut = (t) => 1 - (1 - t) * (1 - t);
  const qbez = (a, b, c, t) => (1 - t) * (1 - t) * a + 2 * (1 - t) * t * b + t * t * c;
  // seeded random, so the drawn crowd looks the same on every visit
  function rng(seed) {
    return () => {
      seed = (seed + 0x6d2b79f5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  /* ---- stadium layout, shared by the drawing and the delivery ---- */
  function sceneGeo() {
    const narrow = W < 760;
    const horizon = H * (narrow ? 0.52 : 0.48);
    const far = { x: W * (narrow ? 0.64 : 0.7), y: horizon + H * 0.025 };
    const near = { x: W * (narrow ? 0.82 : 0.84), y: H * 1.02 };
    const farHalf = Math.max(W * (narrow ? 0.022 : 0.016), 5);
    const nearHalf = W * (narrow ? 0.2 : 0.13);
    // a point on the pitch: u = 0 at the bowler's end, 1 at your feet
    const at = (u) => ({ x: lerp(far.x, near.x, u), y: lerp(far.y, near.y, u), half: lerp(farHalf, nearHalf, u) });
    return { narrow, horizon, standTop: horizon * 0.62, far, near, farHalf, nearHalf, at };
  }

  function drawFigure(c, x, y, h, kit) {
    const w = h * 0.3;
    c.save();
    c.translate(x, y);
    c.lineCap = "round";
    c.strokeStyle = kit.pants; c.lineWidth = h * 0.11;
    c.beginPath();
    c.moveTo(-w * 0.22, -h * 0.46); c.lineTo(-w * 0.38, 0);
    c.moveTo(w * 0.22, -h * 0.46); c.lineTo(w * 0.42, -h * 0.02);
    c.stroke();
    c.strokeStyle = kit.shirt; c.lineWidth = h * 0.08;
    c.beginPath();
    c.moveTo(-w * 0.42, -h * 0.74); c.lineTo(-w * 0.62, -h * 0.47);
    c.moveTo(w * 0.42, -h * 0.74); c.lineTo(w * 0.66, -h * 0.5);
    c.stroke();
    c.fillStyle = kit.shirt;
    c.beginPath(); c.ellipse(0, -h * 0.62, w * 0.48, h * 0.19, 0, 0, Math.PI * 2); c.fill();
    c.fillStyle = "#8a5a3c";
    c.beginPath(); c.arc(0, -h * 0.89, h * 0.095, 0, Math.PI * 2); c.fill();
    if (kit.hat) {
      c.fillStyle = kit.hat;
      c.beginPath(); c.ellipse(0, -h * 0.94, h * 0.14, h * 0.04, 0, 0, Math.PI * 2); c.fill();
      c.beginPath(); c.arc(0, -h * 0.93, h * 0.09, Math.PI, 0); c.fill();
    }
    c.restore();
  }

  /* ---- night match under the floodlights, drawn once per resize ---- */
  function drawScene() {
    const c = sctx;
    c.setTransform(dpr, 0, 0, dpr, 0, 0);
    c.clearRect(0, 0, W, H);
    const sg = sceneGeo();
    const hz = sg.horizon, st = sg.standTop;
    const R = rng(42);
    const towers = (sg.narrow ? [0.12, 0.88] : [0.07, 0.33, 0.67, 0.93]).map((tx) => ({ x: tx * W, top: hz * (0.12 + R() * 0.06) }));

    // sky + stars
    let g = c.createLinearGradient(0, 0, 0, hz);
    g.addColorStop(0, "#06030e"); g.addColorStop(0.55, "#1a0b35"); g.addColorStop(1, "#45205e");
    c.fillStyle = g; c.fillRect(0, 0, W, hz);
    for (let i = 0; i < 120; i++) {
      c.fillStyle = `rgba(255,255,255,${0.2 + R() * 0.6})`;
      c.beginPath(); c.arc(R() * W, R() * hz * 0.55, R() * 1.1 + 0.25, 0, Math.PI * 2); c.fill();
    }

    // floodlight halos in the sky
    towers.forEach((t) => {
      const gl = c.createRadialGradient(t.x, t.top, 0, t.x, t.top, H * 0.34);
      gl.addColorStop(0, "rgba(255,246,220,.55)");
      gl.addColorStop(0.22, "rgba(255,220,150,.16)");
      gl.addColorStop(1, "rgba(255,220,150,0)");
      c.fillStyle = gl; c.fillRect(t.x - H * 0.34, t.top - H * 0.34, H * 0.68, H * 0.68);
    });

    // the stands and the crowd
    g = c.createLinearGradient(0, st, 0, hz);
    g.addColorStop(0, "#1d1133"); g.addColorStop(1, "#110a1f");
    c.fillStyle = g; c.fillRect(0, st, W, hz - st);
    c.fillStyle = "#2c1d44"; c.fillRect(0, st - 3, W, 3);
    const crowd = ["#5a4580", "#7a5aa8", "#a08455", "#c9b27a", "#8a3a4a", "#3d3260", "#d8d0ee", "#6b5a3a", "#FDD023"];
    const boardH = Math.max(H * 0.018, 9);
    for (let y = st + 5; y < hz - boardH - 3; y += 4.2) {
      for (let x = R() * 4; x < W; x += 3.4 + R() * 1.6) {
        // seats nearer a floodlight read brighter
        const lit = towers.reduce((m, t) => Math.max(m, 1 - Math.abs(x - t.x) / (W * 0.3)), 0);
        c.globalAlpha = clamp(0.25 + R() * 0.4 + lit * 0.3, 0, 1);
        c.fillStyle = crowd[(R() * crowd.length) | 0];
        c.fillRect(x, y + R() * 1.5, 2.2, 2.6);
      }
    }
    c.globalAlpha = 1;
    c.fillStyle = "rgba(0,0,0,.28)";
    for (let y = st + 26; y < hz - boardH; y += 26) c.fillRect(0, y, W, 1.5);

    // advertising boards along the boundary
    const segs = ["#461D7C", "#FDD023", "#1a1030", "#F26A1B"];
    c.font = `800 ${Math.round(boardH * 0.68)}px Inter, sans-serif`;
    c.textBaseline = "middle";
    for (let i = 0, x = -20; x < W; i++, x += 120) {
      const col = segs[i % segs.length];
      c.fillStyle = col; c.fillRect(x, hz - boardH, 118, boardH);
      c.fillStyle = col === "#FDD023" ? "#2d1152" : col === "#F26A1B" ? "#fff" : "#FDD023";
      c.fillText(i % 2 ? "LCA CRICKET" : "BR TIGERS", x + 12, hz - boardH / 2 + 1);
    }

    // outfield
    g = c.createLinearGradient(0, hz, 0, H);
    g.addColorStop(0, "#123a1b"); g.addColorStop(0.4, "#1f5e2a"); g.addColorStop(1, "#2b7c37");
    c.fillStyle = g; c.fillRect(0, hz, W, H - hz);
    c.save();
    c.beginPath(); c.rect(0, hz, W, H - hz); c.clip();
    // mowing stripes running to the far end
    const vp = { x: sg.far.x, y: hz - H * 0.06 };
    const band = W * 0.09;
    c.fillStyle = "rgba(255,255,255,.045)";
    for (let i = -16; i < 16; i += 2) {
      const x0 = sg.near.x + i * band;
      c.beginPath(); c.moveTo(vp.x, vp.y); c.lineTo(x0, H * 1.05); c.lineTo(x0 + band, H * 1.05); c.closePath(); c.fill();
    }
    // boundary rope + 30-yard circle
    c.strokeStyle = "rgba(255,255,255,.55)"; c.lineWidth = 1.5;
    c.beginPath(); c.ellipse(W * 0.5, hz + 2, W * 0.95, H * 0.03, 0, 0, Math.PI); c.stroke();
    const mid = sg.at(0.3);
    c.setLineDash([6, 9]); c.strokeStyle = "rgba(255,255,255,.17)";
    c.beginPath(); c.ellipse(mid.x, mid.y, W * 0.42, (H - hz) * 0.36, 0, 0, Math.PI * 2); c.stroke();
    c.setLineDash([]);
    // pools of floodlight on the grass
    const pool = c.createRadialGradient(W * 0.62, hz + (H - hz) * 0.3, 0, W * 0.62, hz + (H - hz) * 0.3, W * 0.45);
    pool.addColorStop(0, "rgba(255,250,220,.09)"); pool.addColorStop(1, "rgba(255,250,220,0)");
    c.fillStyle = pool; c.fillRect(0, hz, W, H - hz);
    c.restore();

    // the pitch, in perspective
    const a = sg.far, b = sg.near;
    c.beginPath();
    c.moveTo(a.x - sg.farHalf, a.y); c.lineTo(a.x + sg.farHalf, a.y);
    c.lineTo(b.x + sg.nearHalf, b.y); c.lineTo(b.x - sg.nearHalf, b.y); c.closePath();
    g = c.createLinearGradient(0, a.y, 0, b.y);
    g.addColorStop(0, "#9c8352"); g.addColorStop(1, "#dcc38d");
    c.fillStyle = g; c.fill();
    // scuffs where the ball pitches and the bowler lands
    [[0.42, 0.55], [0.08, 0.5], [0.9, 0.35]].forEach(([u, s]) => {
      const p = sg.at(u);
      c.fillStyle = "rgba(110,85,48,.22)";
      c.beginPath(); c.ellipse(p.x, p.y, p.half * s, Math.max(p.half * 0.12, 1.5), 0, 0, Math.PI * 2); c.fill();
    });
    // creases
    const crease = (u, ext) => {
      const p = sg.at(u);
      c.strokeStyle = "rgba(255,255,255,.92)"; c.lineWidth = lerp(1, 3.2, u);
      c.beginPath(); c.moveTo(p.x - p.half * ext, p.y); c.lineTo(p.x + p.half * ext, p.y); c.stroke();
    };
    crease(0.02, 1.0); crease(0.065, 1.7); crease(0.935, 1.7);
    // stumps at the bowler's end
    const s0 = sg.at(0.02), sh = Math.max(H * 0.03, 10);
    c.strokeStyle = "#f3e6c8"; c.lineWidth = Math.max(1.4, W * 0.0012);
    [-1, 0, 1].forEach((k) => { c.beginPath(); c.moveTo(s0.x + k * s0.half * 0.35, s0.y); c.lineTo(s0.x + k * s0.half * 0.35, s0.y - sh); c.stroke(); });

    // umpire, bowler at the top of his mark, and the fielders
    const opp = { shirt: "#24408e", pants: "#e9eef7", hat: "#16285c" };
    drawFigure(c, a.x - sg.farHalf * 3.2, a.y + 2, H * 0.07, { shirt: "#eeeeee", pants: "#1a1a1a", hat: "#f5f5f5" });
    drawFigure(c, a.x + sg.farHalf * 2.4, a.y + 4, H * 0.078, opp);
    const fielders = sg.narrow
      ? [[0.2, 0.1], [0.42, 0.06], [0.9, 0.16], [0.3, 0.32]]
      : [[0.14, 0.12], [0.3, 0.3], [0.47, 0.07], [0.88, 0.14], [0.56, 0.42], [0.95, 0.4]];
    fielders.forEach(([fx, fy]) => {
      const y = hz + (H - hz) * fy;
      drawFigure(c, fx * W, y, lerp(H * 0.038, H * 0.13, fy), opp);
    });

    // floodlight beams falling on the field
    c.save();
    c.globalCompositeOperation = "lighter";
    towers.forEach((t) => {
      const cx = lerp(t.x, W * 0.6, 0.65);
      const bg = c.createLinearGradient(0, t.top, 0, H);
      bg.addColorStop(0, "rgba(255,244,214,.09)"); bg.addColorStop(1, "rgba(255,244,214,0)");
      c.fillStyle = bg;
      c.beginPath(); c.moveTo(t.x - 12, t.top); c.lineTo(t.x + 12, t.top);
      c.lineTo(cx + W * 0.14, H); c.lineTo(cx - W * 0.14, H); c.closePath(); c.fill();
    });
    c.restore();

    // floodlight towers on the stand roof
    towers.forEach((t) => {
      c.strokeStyle = "#0d0718"; c.lineWidth = 4;
      c.beginPath(); c.moveTo(t.x, t.top + 8); c.lineTo(t.x, st); c.stroke();
      const pw = sg.narrow ? 26 : 40, ph = pw * 0.5;
      c.fillStyle = "#1a1226"; c.fillRect(t.x - pw / 2 - 2, t.top - ph / 2 - 2, pw + 4, ph + 4);
      c.shadowColor = "rgba(255,240,200,.95)"; c.shadowBlur = 18;
      c.fillStyle = "#fff6dc";
      const cw = pw / 5, chh = ph / 2;
      for (let i = 0; i < 5; i++) for (let j = 0; j < 2; j++) c.fillRect(t.x - pw / 2 + i * cw + 1, t.top - ph / 2 + j * chh + 1, cw - 2, chh - 2);
      c.shadowBlur = 0;
    });

    // haze on the horizon + vignette
    g = c.createLinearGradient(0, hz - H * 0.05, 0, hz + H * 0.06);
    g.addColorStop(0, "rgba(190,160,255,0)"); g.addColorStop(0.5, "rgba(190,160,255,.09)"); g.addColorStop(1, "rgba(190,160,255,0)");
    c.fillStyle = g; c.fillRect(0, hz - H * 0.05, W, H * 0.11);
    const vg = c.createRadialGradient(W * 0.55, H * 0.55, Math.min(W, H) * 0.3, W * 0.55, H * 0.55, Math.max(W, H) * 0.85);
    vg.addColorStop(0, "rgba(0,0,0,0)"); vg.addColorStop(1, "rgba(0,0,0,.55)");
    c.fillStyle = vg; c.fillRect(0, 0, W, H);
  }

  // camera flashes popping in the stands
  function placeFlashes() {
    const sg = sceneGeo();
    flashesEl.innerHTML = "";
    if (reduceMotion) return;
    for (let i = 0; i < 18; i++) {
      const sp = document.createElement("span");
      sp.style.left = (Math.random() * 100).toFixed(1) + "%";
      sp.style.top = (((sg.standTop + Math.random() * (sg.horizon - sg.standTop) * 0.85) / H) * 100).toFixed(1) + "%";
      sp.style.setProperty("--d", (4 + Math.random() * 6).toFixed(1) + "s");
      sp.style.setProperty("--delay", (-Math.random() * 9).toFixed(1) + "s");
      flashesEl.appendChild(sp);
    }
  }

  resize();
  let resizeRaf = 0;
  window.addEventListener("resize", () => {
    cancelAnimationFrame(resizeRaf);
    resizeRaf = requestAnimationFrame(resize);
  });

  /* ---- realistic leather ball: shading, rotating seam, stitches ---- */
  function drawBall(x, y, r, spin) {
    ctx.save();
    ctx.translate(x, y);
    ctx.shadowColor = "rgba(0,0,0,.45)";
    ctx.shadowBlur = r * 0.9;
    ctx.shadowOffsetY = r * 0.3;
    const g = ctx.createRadialGradient(-r * 0.35, -r * 0.4, r * 0.08, 0, 0, r * 1.05);
    g.addColorStop(0, "#ff6b4f");
    g.addColorStop(0.5, "#c41d12");
    g.addColorStop(1, "#5e0904");
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill();
    ctx.shadowColor = "transparent";

    ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.clip();
    ctx.rotate(0.5);
    // the seam is a great circle turning around the ball's axis:
    // only the half facing the camera is drawn
    const s = Math.sin(spin);
    const rx = Math.abs(s) * r;
    const left = s < 0;
    ctx.strokeStyle = "rgba(246,231,200,.95)";
    ctx.lineWidth = Math.max(1, r * 0.08);
    ctx.beginPath(); ctx.ellipse(0, 0, Math.max(rx, 0.5), r, 0, -Math.PI / 2, Math.PI / 2, left); ctx.stroke();
    ctx.lineWidth = Math.max(0.8, r * 0.05);
    ctx.setLineDash([r * 0.13, r * 0.11]);
    [-1, 1].forEach((k) => {
      const rr = clamp(rx + k * r * 0.14, 0.5, r);
      ctx.beginPath(); ctx.ellipse(0, 0, rr, r, 0, -Math.PI / 2, Math.PI / 2, left); ctx.stroke();
    });
    ctx.setLineDash([]);
    ctx.restore();

    // specular highlight
    ctx.save();
    ctx.translate(x - r * 0.35, y - r * 0.4);
    const h = ctx.createRadialGradient(0, 0, 0, 0, 0, r * 0.5);
    h.addColorStop(0, "rgba(255,255,255,.45)");
    h.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = h;
    ctx.beginPath(); ctx.arc(0, 0, r * 0.5, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }

  /* ---- English-willow bat: grip, shoulders, blade, sticker ---- */
  function drawBat(px, py, angle, len, alpha) {
    const hL = len * 0.3;           // handle length
    const wH = len * 0.05;          // handle width
    const wB = len * 0.14;          // blade width
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(px, py);
    ctx.rotate(angle);
    ctx.shadowColor = "rgba(0,0,0,.4)";
    ctx.shadowBlur = 18;
    ctx.shadowOffsetY = 10;

    // handle with rubber grip
    const hg = ctx.createLinearGradient(0, -wH / 2, 0, wH / 2);
    hg.addColorStop(0, "#4a4a55"); hg.addColorStop(0.5, "#1d1d22"); hg.addColorStop(1, "#0b0b0e");
    ctx.fillStyle = hg;
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(-wH * 0.4, -wH / 2, hL + wH, wH, wH / 2);
    else ctx.rect(-wH * 0.4, -wH / 2, hL + wH, wH); // older browsers
    ctx.fill();
    ctx.shadowColor = "transparent";
    ctx.strokeStyle = "rgba(255,255,255,.12)";
    ctx.lineWidth = 1.5;
    for (let x = 4; x < hL; x += 9) {
      ctx.beginPath(); ctx.moveTo(x, -wH / 2); ctx.lineTo(x + 5, wH / 2); ctx.stroke();
    }

    // blade outline: shoulders taper from the handle, rounded toe
    const sh = hL + len * 0.07;
    const blade = new Path2D();
    blade.moveTo(hL, -wH * 0.6);
    blade.quadraticCurveTo(hL + len * 0.03, -wB / 2, sh, -wB / 2);
    blade.lineTo(len - wB * 0.35, -wB / 2);
    blade.quadraticCurveTo(len, -wB / 2, len, 0);
    blade.quadraticCurveTo(len, wB / 2, len - wB * 0.35, wB / 2);
    blade.lineTo(sh, wB / 2);
    blade.quadraticCurveTo(hL + len * 0.03, wB / 2, hL, wH * 0.6);
    blade.closePath();

    ctx.shadowColor = "rgba(0,0,0,.4)";
    ctx.shadowBlur = 20; ctx.shadowOffsetY = 12;
    const bg = ctx.createLinearGradient(0, -wB / 2, 0, wB / 2);
    bg.addColorStop(0, "#f6e4ba"); bg.addColorStop(0.45, "#e2c389"); bg.addColorStop(1, "#a97e44");
    ctx.fillStyle = bg;
    ctx.fill(blade);
    ctx.shadowColor = "transparent";

    ctx.save();
    ctx.clip(blade);
    // willow grain
    ctx.strokeStyle = "rgba(120,80,30,.12)";
    ctx.lineWidth = 1;
    for (let y = -wB / 2 + 3; y < wB / 2; y += 4.5) {
      ctx.beginPath(); ctx.moveTo(sh - 10, y); ctx.lineTo(len, y + Math.sin(y) * 1.5); ctx.stroke();
    }
    // club sticker near the toe
    ctx.fillStyle = "#461D7C"; ctx.fillRect(len * 0.8, -wB / 2, len * 0.05, wB);
    ctx.fillStyle = "#FDD023"; ctx.fillRect(len * 0.85, -wB / 2, len * 0.025, wB);
    ctx.restore();

    // maker's text along the blade
    ctx.fillStyle = "rgba(70,29,124,.78)";
    ctx.font = `800 ${Math.round(wB * 0.42)}px Inter, sans-serif`;
    ctx.textBaseline = "middle";
    ctx.fillText("TIGERS", sh + len * 0.1, 1);

    ctx.strokeStyle = "rgba(110,70,20,.45)";
    ctx.lineWidth = 1.2;
    ctx.stroke(blade);
    ctx.restore();
  }

  /* ---- particles: dust, sparks, confetti ---- */
  const parts = [];
  function burst(x, y, n, opts) {
    for (let i = 0; i < n; i++) {
      const a = opts.angle != null ? opts.angle + (Math.random() - 0.5) * opts.spread : Math.random() * Math.PI * 2;
      const sp = lerp(opts.min, opts.max, Math.random());
      parts.push({
        x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp,
        life: 0, max: lerp(opts.life * 0.7, opts.life * 1.3, Math.random()),
        color: opts.colors[(Math.random() * opts.colors.length) | 0],
        size: lerp(opts.size[0], opts.size[1], Math.random()),
        g: opts.gravity, streak: !!opts.streak,
      });
    }
  }
  function drawParts(dt) {
    for (let i = parts.length - 1; i >= 0; i--) {
      const p = parts[i];
      p.life += dt;
      if (p.life >= p.max) { parts.splice(i, 1); continue; }
      p.vy += p.g * dt;
      p.vx *= 0.99;
      p.x += p.vx * dt; p.y += p.vy * dt;
      const a = 1 - p.life / p.max;
      ctx.globalAlpha = a;
      if (p.streak) {
        ctx.strokeStyle = p.color; ctx.lineWidth = p.size; ctx.lineCap = "round";
        ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x - p.vx * 0.035, p.y - p.vy * 0.035); ctx.stroke();
      } else {
        ctx.fillStyle = p.color;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
  }

  /* ---- the shot ---- */
  const T_BOUNCE = 0.45, T_HIT = 0.8, T_FLY = 1.85;
  let shot = null;
  let raf = 0, last = 0;
  let heroVisible = true;
  let autoTimer = 0;

  function geometry() {
    // the delivery comes straight down the drawn pitch at you
    const sg = sceneGeo();
    const narrow = sg.narrow;
    const rel = sg.at(0.02);
    const far = { x: rel.x, y: rel.y - H * 0.035 };   // bowler's release
    const bounce = sg.at(0.42);                       // good length
    const hp = sg.at(0.86);
    const hit = { x: hp.x + W * 0.01, y: hp.y - H * 0.1 }; // meets the bat
    const pivot = { x: Math.min(W * 1.0, hit.x + H * 0.32), y: H * 1.06 };
    const dist = Math.hypot(hit.x - pivot.x, hit.y - pivot.y);
    const hitAngle = Math.atan2(hit.y - pivot.y, hit.x - pivot.x);
    const hr = hero.getBoundingClientRect();
    const tr = ballTarget.getBoundingClientRect();
    const target = { x: tr.left - hr.left + tr.width / 2, y: tr.top - hr.top + tr.height / 2, r: tr.width / 2 };
    const ctrl = { x: lerp(hit.x, target.x, 0.5), y: -H * 0.32 };
    return { far, bounce, hit, pivot, batLen: dist / 0.72, hitAngle, target, ctrl, narrow };
  }

  function startShot() {
    if (shot || reduceMotion) return;
    clearTimeout(autoTimer);
    shot = { start: performance.now(), t: 0, g: geometry(), trail: [], flags: {} };
    loop();
  }

  function scheduleNext() {
    clearTimeout(autoTimer);
    const every = (C.hero?.autoSixEverySeconds || 7) * 1000;
    autoTimer = setTimeout(() => { if (heroVisible && !document.hidden) startShot(); else scheduleNext(); }, every);
  }

  function loop() {
    cancelAnimationFrame(raf);
    last = performance.now();
    const frame = (now) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      ctx.clearRect(0, 0, W, H);
      if (shot) stepShot(dt);
      drawParts(dt);
      if (shot || parts.length) raf = requestAnimationFrame(frame);
      else ctx.clearRect(0, 0, W, H);
    };
    raf = requestAnimationFrame(frame);
  }

  function stepShot(dt) {
    const s = shot, g = s.g, f = s.flags;
    // timeline follows the real clock, so slow devices skip frames
    // instead of playing the shot in slow motion
    s.t = (performance.now() - s.start) / 1000;
    const t = s.t;

    // camera shake right after contact
    const shake = t > T_HIT && t < T_HIT + 0.22 ? (1 - (t - T_HIT) / 0.22) * 6 : 0;
    ctx.save();
    if (shake) ctx.translate((Math.random() - 0.5) * shake, (Math.random() - 0.5) * shake);

    let bx, by, br, spin = t * 26;

    if (t < T_HIT) {
      // 1) delivery: from the bowler, pitches, then rises at the batter (you)
      if (t < T_BOUNCE) {
        const k = easeIn(t / T_BOUNCE);
        bx = lerp(g.far.x, g.bounce.x, k);
        by = lerp(g.far.y, g.bounce.y, k) - Math.sin(k * Math.PI) * H * 0.05;
        br = lerp(3, 9, k);
      } else {
        const k = (t - T_BOUNCE) / (T_HIT - T_BOUNCE);
        bx = lerp(g.bounce.x, g.hit.x, k);
        by = lerp(g.bounce.y, g.hit.y, k) - Math.sin(k * Math.PI) * H * 0.03;
        br = lerp(9, 17, k);
        if (!f.dust) {
          f.dust = true;
          burst(g.bounce.x, g.bounce.y + 6, 14, { min: 30, max: 110, life: 0.6, angle: -Math.PI / 2, spread: 2.2, gravity: 160, size: [1.5, 3.2], colors: ["#d7bd84", "#bf9f63", "#e9dcb6"] });
        }
      }
    } else if (t < T_HIT + T_FLY) {
      // 2) off the middle of the bat and out of the ground
      if (!f.hit) {
        f.hit = true;
        burst(g.hit.x, g.hit.y, 22, { min: 120, max: 340, life: 0.45, angle: -Math.PI * 0.75, spread: 1.6, gravity: 300, size: [1.5, 2.6], colors: ["#fff6d6", "#ffd84a"], streak: true });
      }
      const k = (t - T_HIT) / T_FLY;
      bx = qbez(g.hit.x, g.ctrl.x, g.target.x, k);
      by = qbez(g.hit.y, g.ctrl.y, g.target.y, k);
      br = qbez(17, -1, g.target.r, k);
      spin = t * 34;
      if (!f.six && k > 0.42) {
        f.six = true;
        // fireworks at the top of the flight
        burst(bx, by, 80, { min: 120, max: 420, life: 1.4, gravity: 240, size: [1.6, 3.2], colors: ["#FDD023", "#fff3c4", "#F26A1B", "#b88cff", "#ffffff"], streak: true });
      }
    } else {
      // 3) caught by the Donate button
      if (!f.caught) {
        f.caught = true;
        donateBtn.classList.remove("is-caught"); void donateBtn.offsetWidth; donateBtn.classList.add("is-caught");
        burst(g.target.x, g.target.y, 26, { min: 80, max: 230, life: 0.9, angle: -Math.PI / 2, spread: 2.4, gravity: 380, size: [2, 3.5], colors: ["#FDD023", "#e8402c", "#ffffff"] });
      }
    }

    // flash at contact
    if (t > T_HIT && t < T_HIT + 0.2) {
      const a = 1 - (t - T_HIT) / 0.2;
      const fl = ctx.createRadialGradient(g.hit.x, g.hit.y, 0, g.hit.x, g.hit.y, 120);
      fl.addColorStop(0, `rgba(255,250,230,${0.85 * a})`);
      fl.addColorStop(1, "rgba(255,250,230,0)");
      ctx.fillStyle = fl;
      ctx.fillRect(g.hit.x - 120, g.hit.y - 120, 240, 240);
    }

    // ball + motion trail
    if (bx != null) {
      s.trail.push({ x: bx, y: by, r: br });
      if (s.trail.length > 16) s.trail.shift();
      s.trail.forEach((p, i) => {
        const a = (i / s.trail.length) * 0.32;
        ctx.fillStyle = `rgba(255,${120 + i * 6},90,${a})`;
        ctx.beginPath(); ctx.arc(p.x, p.y, Math.max(p.r * (0.4 + i / s.trail.length * 0.5), 0.5), 0, Math.PI * 2); ctx.fill();
      });
      drawBall(bx, by, Math.max(br, 2.5), spin);
    }

    // the bat swings through the line of the ball
    const swingStart = T_HIT - 0.42, swingEnd = T_HIT + 0.3, fadeEnd = swingEnd + 0.3;
    if (t > swingStart && t < fadeEnd) {
      const back = g.hitAngle + 1.15, through = g.hitAngle - 0.95;
      let ang;
      if (t < T_HIT) ang = lerp(back, g.hitAngle, easeIn((t - swingStart) / (T_HIT - swingStart)));
      else ang = lerp(g.hitAngle, through, easeOut(clamp((t - T_HIT) / (swingEnd - T_HIT), 0, 1)));
      const alpha = t < swingEnd ? 1 : 1 - (t - swingEnd) / (fadeEnd - swingEnd);
      const len = Math.min(g.batLen, g.narrow ? 300 : 460);
      const prev = s.prevAng ?? ang;
      for (let k = 3; k >= 1; k--) drawBat(g.pivot.x, g.pivot.y, lerp(ang, prev, k * 0.9), len, alpha * 0.1);
      drawBat(g.pivot.x, g.pivot.y, ang, len, alpha);
      s.prevAng = ang;
    }

    ctx.restore();

    if (t > T_HIT + T_FLY + 0.1) {
      shot = null;
      scheduleNext();
    }
  }

  if (!reduceMotion) {
    // first six shortly after load (fonts/layout settled)
    window.addEventListener("load", () => setTimeout(startShot, 900));
    hero.addEventListener("click", (e) => {
      if (e.target.closest("a, button")) return;
      startShot();
    });
    new IntersectionObserver((en) => { heroVisible = en[0].isIntersecting; }, { threshold: 0.35 }).observe(hero);
  } else {
    $(".hero__hint").hidden = true;
  }

  /* ============================================================
     UI BEHAVIOUR
     ============================================================ */
  const nav = $("#nav");
  const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 40);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const toggle = $("#navToggle");
  const links = $("#navLinks");
  toggle.addEventListener("click", () => {
    const open = links.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open);
  });
  links.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => links.classList.remove("open")));

  // Reveal on scroll (+ scoreboard roll)
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        en.target.classList.add("in");
        if (en.target.id === "statsGrid") rollScoreboard(en.target);
        io.unobserve(en.target);
      });
    },
    { threshold: 0.15 }
  );
  document.querySelectorAll(".reveal, #statsGrid").forEach((n) => io.observe(n));

  // Pitch dividers: bowl again every time they come back into view
  const pitchIO = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (en.intersectionRatio >= 0.9) en.target.classList.add("in");
        else if (!en.isIntersecting) en.target.classList.remove("in");
      });
    },
    { threshold: [0, 0.9] }
  );
  document.querySelectorAll(".pitchline").forEach((n) => pitchIO.observe(n));
})();
