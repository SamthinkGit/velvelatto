/* Tienda: filtros, orden y rejilla */
(function () {
  const { $, $$, card, observe, catName, fillIcons } = VV;
  const cats = VV.categories.filter((c) => !["personalizados"].includes(c.id));
  const params = new URLSearchParams(location.search);
  const state = { cats: new Set(params.get("cat") ? [params.get("cat")] : []), metals: new Set(), colors: new Set(), min: 5, max: 20, sort: "featured" };

  const inCat = (p, c) => (c === "packs" ? p.packs : p.cat === c);

  // Construir filtros
  $("#cat-filter").innerHTML = cats.map((c) => `<label class="check"><input type="checkbox" name="cat" value="${c.id}"${state.cats.has(c.id) ? " checked" : ""}>${c.id === "packs" ? "Combinables en pack" : c.name}<em>${VV.products.filter((p) => inCat(p, c.id)).length}</em></label>`).join("");
  $("#metal-oro").textContent = VV.products.filter((p) => p.metal === "oro").length;
  $("#metal-plata").textContent = VV.products.filter((p) => p.metal === "plata").length;
  $("#color-filter").innerHTML = VV.colors.map((c) => `<button class="swatch" data-color="${c.id}" aria-pressed="false" title="${c.name}" aria-label="${c.name}" style="background:${c.hex}"></button>`).join("");

  function filtered() {
    let list = VV.products.filter((p) =>
      (!state.cats.size || [...state.cats].some((c) => inCat(p, c))) &&
      (!state.metals.size || state.metals.has(p.metal)) &&
      (!state.colors.size || p.colors.some((c) => state.colors.has(c))) &&
      p.price >= state.min && p.price <= state.max);
    const by = {
      "price-asc": (a, b) => a.price - b.price,
      "price-desc": (a, b) => b.price - a.price,
      rating: (a, b) => b.rating - a.rating || b.reviews - a.reviews,
      new: (a, b) => (b.badge === "Nuevo") - (a.badge === "Nuevo"),
    }[state.sort];
    return by ? [...list].sort(by) : list;
  }

  function renderSelected() {
    const chips = [];
    if (state.min > 5 || state.max < 20) chips.push(["price", "", `${state.min} € – ${state.max} €`]);
    state.cats.forEach((c) => chips.push(["cat", c, c === "packs" ? "Packs" : catName(c)]));
    state.metals.forEach((m) => chips.push(["metal", m, m === "oro" ? "Baño de oro" : "Plata 925"]));
    state.colors.forEach((c) => chips.push(["color", c, VV.colors.find((x) => x.id === c).name]));
    $("#selected").innerHTML = chips.map(([t, v, l]) => `<button data-unset="${t}" data-v="${v}">${l} ✕</button>`).join("");
  }

  let first = true;
  function render() {
    const list = filtered();
    const grid = $("#shop-grid");
    const paint = () => {
      grid.innerHTML = list.length
        ? list.map(card).join("") + `
          <a class="card card--cta" href="index.html#personaliza" data-reveal style="--i:${list.length % 4}">
            <span data-icon="brush"></span>
            <h3>¿No encuentras el tuyo?</h3>
            <p>Diseña tu propio pendiente eligiendo piedras, metal y cierre.</p>
            <span class="btn btn--sm">Diseñar ahora</span>
          </a>`
        : `<div class="empty-state"><span data-icon="sparkle" style="width:48px;height:48px;color:var(--accent)"></span><p>Ningún pendiente coincide con esos filtros… ¡todavía!</p><button class="btn btn--sm" id="empty-clear">Borrar filtros</button></div>`;
      fillIcons(grid);
      observe(grid);
    };
    if (first) { paint(); first = false; }
    else { $$(".card", grid).forEach((c) => c.classList.add("is-hiding")); setTimeout(paint, 260); }
    $("#count").textContent = `${list.length} ${list.length === 1 ? "resultado" : "resultados"}`;
    const pct = Math.round((list.length / VV.products.length) * 100);
    $("#progress").innerHTML = `<span style="font-size:.85rem;color:var(--muted)">Estás viendo ${list.length} de ${VV.products.length} pendientes</span><div class="ship-bar__track" style="width:220px"><div class="ship-bar__fill" style="width:${pct}%"></div></div>`;
    renderSelected();
    // Barra de rango
    const a = ((state.min - 5) / 15) * 100, b = ((state.max - 5) / 15) * 100;
    Object.assign($("#range-fill").style, { left: a + "%", right: 100 - b + "%" });
    $("#min-label").textContent = state.min + " €";
    $("#max-label").textContent = state.max + " €";
  }

  // Eventos
  $("#filters").addEventListener("change", (e) => {
    const i = e.target;
    if (i.name === "cat") i.checked ? state.cats.add(i.value) : state.cats.delete(i.value);
    if (i.name === "metal") i.checked ? state.metals.add(i.value) : state.metals.delete(i.value);
    render();
  });
  $("#color-filter").addEventListener("click", (e) => {
    const b = e.target.closest("[data-color]");
    if (!b) return;
    const c = b.dataset.color;
    state.colors.has(c) ? state.colors.delete(c) : state.colors.add(c);
    b.setAttribute("aria-pressed", String(state.colors.has(c)));
    render();
  });
  const minI = $("#min-price"), maxI = $("#max-price");
  const onRange = () => {
    let lo = +minI.value, hi = +maxI.value;
    if (lo > hi - 1) { if (document.activeElement === minI) lo = hi - 1; else hi = lo + 1; }
    minI.value = state.min = lo; maxI.value = state.max = hi;
    render();
  };
  minI.addEventListener("input", onRange);
  maxI.addEventListener("input", onRange);
  $("#sort").addEventListener("change", (e) => { state.sort = e.target.value; render(); });

  function clearAll() {
    state.cats.clear(); state.metals.clear(); state.colors.clear(); state.min = 5; state.max = 20;
    $$("#filters input[type=checkbox]").forEach((i) => (i.checked = false));
    $$("#color-filter .swatch").forEach((s) => s.setAttribute("aria-pressed", "false"));
    minI.value = 5; maxI.value = 20;
    render();
  }
  $("#clear-all").addEventListener("click", clearAll);
  document.addEventListener("click", (e) => {
    if (e.target.closest("#empty-clear")) clearAll();
    const u = e.target.closest("[data-unset]");
    if (u) {
      const { unset, v } = u.dataset;
      if (unset === "price") { state.min = 5; state.max = 20; minI.value = 5; maxI.value = 20; }
      if (unset === "cat") { state.cats.delete(v); $(`#cat-filter input[value="${v}"]`).checked = false; }
      if (unset === "metal") { state.metals.delete(v); $(`input[name=metal][value="${v}"]`).checked = false; }
      if (unset === "color") { state.colors.delete(v); $(`[data-color="${v}"]`).setAttribute("aria-pressed", "false"); }
      render();
    }
    if (e.target.closest("[data-open-filters]")) { $("#filters").classList.add("is-open"); $(".filter-close").hidden = false; }
    if (e.target.closest("[data-close-filters]")) $("#filters").classList.remove("is-open");
  });

  render();
})();
