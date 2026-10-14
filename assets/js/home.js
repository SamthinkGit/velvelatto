/* Portada: categorías, favoritos, personalizador, opiniones e Instagram */
(function () {
  const { $, $$, money, card, observe, stars, icons, addToCart, toast } = VV;

  /* ---------- Categorías ---------- */
  const countFor = (c) => c.id === "personalizados" ? "A tu gusto" : c.id === "packs" ? `${VV.products.filter((p) => p.packs).length} combinables` : `${VV.products.filter((p) => p.cat === c.id).length} modelos`;
  $("#cats").innerHTML = VV.categories.map((c, i) => `
    <a class="cat-card" href="${c.href || `tienda.html?cat=${c.id}`}" data-reveal style="--i:${i}">
      <span class="cat-card__media"><img src="${c.img}" alt="" loading="lazy"></span>
      <span class="cat-card__name">${c.name}</span>
      <span class="cat-card__count">${countFor(c)}</span>
    </a>`).join("");

  /* ---------- Favoritos con pestañas ---------- */
  const lists = {
    best: [...VV.products].sort((a, b) => b.reviews - a.reviews).slice(0, 4),
    new: VV.products.filter((p) => ["Nuevo", "Edición limitada"].includes(p.badge)).concat(VV.products.filter((p) => p.id === "luna-perla")).slice(0, 4),
    cheap: VV.products.filter((p) => p.price < 11).slice(0, 4),
  };
  const grid = $("#best-grid"), tabs = $("#best-tabs"), pill = $(".tabs__pill", tabs);
  function movePill() {
    const b = $('[aria-selected="true"]', tabs);
    pill.style.width = b.offsetWidth + "px";
    pill.style.transform = `translateX(${b.offsetLeft}px)`;
  }
  function showTab(name, first) {
    const paint = () => { grid.innerHTML = lists[name].map(card).join(""); observe(grid); };
    if (first) return paint();
    $$(".card", grid).forEach((c) => c.classList.add("is-hiding"));
    setTimeout(paint, 280);
  }
  tabs.addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (!b || b.getAttribute("aria-selected") === "true") return;
    $$("button", tabs).forEach((x) => x.setAttribute("aria-selected", String(x === b)));
    movePill();
    showTab(b.dataset.tab);
  });
  showTab("best", true);
  requestAnimationFrame(movePill);
  addEventListener("resize", movePill);
  document.addEventListener("vv:theme", () => setTimeout(movePill, 60));
  document.fonts && document.fonts.ready.then(movePill);

  /* ---------- Opiniones e Instagram ---------- */
  $("#reviews").innerHTML = VV.reviews.map((r, i) => `
    <article class="review" data-reveal style="--i:${i}">
      ${stars(5)}
      <p>${r.text}</p>
      <footer><span class="avatar">${r.name[0]}</span><div><b>${r.name}</b><small>${r.city} · ${r.product}</small></div></footer>
    </article>`).join("");
  $("#insta").innerHTML = ["hero-modelo.jpg", "margarita.jpg", "taller.jpg", "cereza.jpg", "luna-perla.jpg", "mariposa.jpg"]
    .map((f, i) => `<a href="#" data-proto="Aquí enlazaría al Instagram de Velvelatto" data-reveal="zoom" style="--i:${i}"><img src="assets/img/${f}" alt="" loading="lazy">${icons.instagram}</a>`).join("");

  /* =========================================================
     Personalizador de pendientes (SVG)
     ========================================================= */
  const STONES = {
    cuarzo: { name: "Cuarzo rosa", c: ["#FFE9F0", "#F2B3C8", "#D98AA6"] },
    fresa: { name: "Cuarzo fresa", c: ["#FFE0E6", "#F48FAA", "#D2627F"] },
    amatista: { name: "Amatista", c: ["#F3E6FF", "#C79FE6", "#9C72C4"] },
    prehnita: { name: "Prehnita", c: ["#F1FFEC", "#C2E6BE", "#8DBF8A"] },
    aguamarina: { name: "Aguamarina", c: ["#EEF6FF", "#B5D2F2", "#82A8D6"] },
    citrino: { name: "Citrino suave", c: ["#FFFBEA", "#F5E5B2", "#D9C27E"] },
    luna: { name: "Piedra luna", c: ["#FFFFFF", "#EEEAF2", "#C9C1D3"] },
  };
  const METALS = { oro: ["#FFF1B8", "#E2BC5C", "#A87F27"], plata: ["#FFFFFF", "#D6D6DE", "#8E8E9C"] };
  const N = 10, R = 100, CX = 150, CY = 205;
  const presets = {
    arcoiris: ["cuarzo", "amatista", "citrino", "prehnita", "fresa", "luna", "prehnita", "aguamarina", "cuarzo", "amatista"],
    fresa: ["fresa", "cuarzo", "luna", "fresa", "cuarzo", "luna", "fresa", "cuarzo", "luna", "fresa"],
    lavanda: ["amatista", "aguamarina", "luna", "amatista", "aguamarina", "luna", "amatista", "aguamarina", "luna", "amatista"],
  };
  const state = { metal: "oro", closure: "gancho", initial: "", active: "cuarzo", beads: presets.arcoiris.slice() };
  const svg = $("#builder-svg");

  const grad = (id, [a, b, c]) => `<radialGradient id="${id}" cx="35%" cy="30%" r="75%"><stop offset="0" stop-color="${a}"/><stop offset=".55" stop-color="${b}"/><stop offset="1" stop-color="${c}"/></radialGradient>`;
  const hexPts = (x, y, r) => Array.from({ length: 6 }, (_, k) => { const a = Math.PI / 3 * k + Math.PI / 6; return `${(x + r * Math.cos(a)).toFixed(1)},${(y + r * Math.sin(a)).toFixed(1)}`; }).join(" ");

  function closureSVG(m) {
    const s = `stroke="url(#metal)" stroke-width="4" fill="none" stroke-linecap="round"`;
    if (state.closure === "aro") return `<circle cx="${CX}" cy="62" r="26" ${s}/><circle cx="${CX}" cy="92" r="6" ${s} stroke-width="3"/>`;
    if (state.closure === "clip") return `<rect x="${CX - 22}" y="30" width="44" height="34" rx="14" fill="url(#metal)"/><rect x="${CX - 14}" y="38" width="28" height="18" rx="9" fill="${m[0]}" opacity=".55"/><rect x="${CX - 4}" y="62" width="8" height="18" rx="3" fill="url(#metal)"/><circle cx="${CX}" cy="92" r="6" ${s} stroke-width="3"/>`;
    return `<path d="M${CX} 84 L${CX} 52 C ${CX} 14, ${CX + 52} 10, ${CX + 56} 44 C ${CX + 58} 62, ${CX + 44} 76, ${CX + 34} 86" ${s}/>
      <rect x="${CX - 6}" y="56" width="12" height="16" rx="3" fill="url(#metal)"/>
      ${[59, 63, 67].map((y) => `<line x1="${CX - 6}" x2="${CX + 6}" y1="${y}" y2="${y}" stroke="${m[2]}" stroke-width="1"/>`).join("")}
      <circle cx="${CX}" cy="78" r="6.5" fill="url(#metalBall)"/><circle cx="${CX}" cy="92" r="6" ${s} stroke-width="3"/>`;
  }

  function render(popIndex = -1) {
    const m = METALS[state.metal];
    let defs = `<defs>${grad("metalBall", m)}<linearGradient id="metal" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${m[0]}"/><stop offset=".5" stop-color="${m[1]}"/><stop offset="1" stop-color="${m[2]}"/></linearGradient>`;
    Object.entries(STONES).forEach(([k, v]) => (defs += grad("st-" + k, v.c)));
    defs += `</defs>`;
    let out = defs + closureSVG(m);
    out += `<circle cx="${CX}" cy="${CY}" r="${R}" fill="none" stroke="url(#metal)" stroke-width="2"/>`;
    // separadores dorados
    for (let i = 0; i < N; i++) {
      const a = (-90 + i * (360 / N)) * Math.PI / 180;
      out += `<circle cx="${(CX + R * Math.cos(a)).toFixed(1)}" cy="${(CY + R * Math.sin(a)).toFixed(1)}" r="6" fill="url(#metalBall)"/>`;
    }
    // piedras facetadas
    state.beads.forEach((b, i) => {
      const a = (-90 + (i + 0.5) * (360 / N)) * Math.PI / 180;
      const x = CX + R * Math.cos(a), y = CY + R * Math.sin(a);
      out += `<g class="slot${i === popIndex ? " pop" : ""}" data-slot="${i}" role="button" aria-label="Piedra ${i + 1}: ${STONES[b].name}">
        <circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="18" fill="url(#st-${b})"/>
        <polygon points="${hexPts(x, y, 10)}" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="1"/>
        <path d="M${(x - 10).toFixed(1)} ${(y - 5).toFixed(1)} L${(x - 17).toFixed(1)} ${(y - 2).toFixed(1)} M${(x + 10).toFixed(1)} ${(y + 5).toFixed(1)} L${(x + 17).toFixed(1)} ${(y + 2).toFixed(1)} M${x.toFixed(1)} ${(y - 10).toFixed(1)} L${(x + 3).toFixed(1)} ${(y - 17).toFixed(1)}" stroke="#fff" stroke-opacity=".4" stroke-width="1"/>
        <ellipse cx="${(x - 6).toFixed(1)}" cy="${(y - 7).toFixed(1)}" rx="5" ry="3.2" fill="#fff" opacity=".75" transform="rotate(-30 ${(x - 6).toFixed(1)} ${(y - 7).toFixed(1)})"/>
      </g>`;
    });
    if (state.initial) {
      const y0 = CY + R;
      out += `<circle cx="${CX}" cy="${y0 + 13}" r="5" fill="none" stroke="url(#metal)" stroke-width="2.5"/>
        <circle cx="${CX}" cy="${y0 + 38}" r="20" fill="url(#metal)"/>
        <circle cx="${CX}" cy="${y0 + 38}" r="16" fill="none" stroke="${m[0]}" stroke-opacity=".7"/>
        <text x="${CX}" y="${y0 + 45}" text-anchor="middle" font-family="Georgia, serif" font-size="20" font-style="italic" fill="${m[2]}">${state.initial}</text>`;
    }
    svg.setAttribute("viewBox", `0 0 300 ${state.initial ? 380 : 330}`);
    svg.innerHTML = out;
    $("#builder-price").textContent = money(price());
  }
  const price = () => 12 + (state.metal === "plata" ? 2 : 0) + (state.closure === "clip" ? 2 : 0) + (state.initial ? 2 : 0);

  // Paleta de piedras
  $("#b-stones").innerHTML = Object.entries(STONES).map(([k, v]) =>
    `<button class="swatch" data-stone="${k}" aria-pressed="${k === state.active}" aria-label="${v.name}" title="${v.name}" style="background:radial-gradient(circle at 35% 30%, ${v.c[0]}, ${v.c[1]} 55%, ${v.c[2]})"></button>`).join("");
  $("#b-stones").addEventListener("click", (e) => {
    const b = e.target.closest("[data-stone]");
    if (!b) return;
    state.active = b.dataset.stone;
    $$("[data-stone]").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    $("#b-stone-name").textContent = STONES[state.active].name + " · toca el pendiente";
  });
  svg.addEventListener("click", (e) => {
    const g = e.target.closest("[data-slot]");
    if (!g) return;
    const i = +g.dataset.slot;
    state.beads[i] = state.active;
    render(i);
  });
  // Presets con efecto cascada
  $("#b-presets").innerHTML += `<button class="chip" data-preset="all">🎨 Todo de este color</button>`;
  $("#b-presets").addEventListener("click", (e) => {
    const b = e.target.closest("[data-preset]");
    if (!b) return;
    const keys = Object.keys(STONES);
    const target = b.dataset.preset === "random" ? Array.from({ length: N }, () => keys[Math.floor(Math.random() * keys.length)])
      : b.dataset.preset === "all" ? Array(N).fill(state.active) : presets[b.dataset.preset];
    target.forEach((s, i) => setTimeout(() => { state.beads[i] = s; render(i); }, i * 70));
  });
  const single = (id, attr) => $(id).addEventListener("click", (e) => {
    const b = e.target.closest(`[data-${attr}]`);
    if (!b) return;
    state[attr] = b.dataset[attr];
    $$(`[data-${attr}]`, $(id)).forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    render();
  });
  single("#b-metal", "metal");
  single("#b-closure", "closure");
  $("#b-initial").addEventListener("input", (e) => {
    state.initial = e.target.value.trim().slice(0, 1).toUpperCase();
    e.target.value = state.initial;
    render();
  });
  $("#b-add").addEventListener("click", () => {
    const clone = svg.cloneNode(true);
    clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    clone.removeAttribute("class");
    const img = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(new XMLSerializer().serializeToString(clone));
    const closureName = { gancho: "Gancho", aro: "Mini aro", clip: "Clip sin agujero" }[state.closure];
    const opts = [state.metal === "oro" ? "Baño de oro" : "Plata 925", closureName, state.initial && `Inicial ${state.initial}`, "Diseño a medida"].filter(Boolean).join(" · ");
    addToCart({ id: "custom-" + state.beads.join("-"), name: "Mi aro personalizado", price: price(), img, opts }, svg);
  });
  render();
})();
