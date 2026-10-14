/* Ficha de producto con personalización */
(function () {
  const { $, $$, money, card, observe, stars, catName, addToCart } = VV;
  const id = new URLSearchParams(location.search).get("id");
  const p = VV.products.find((x) => x.id === id) || VV.products[0];
  document.title = `${p.name} · Velvelatto`;

  const opts = { metal: p.metal, closure: "Gancho", color: p.colors[0], initial: "", gift: false, qty: 1 };

  // Galería
  const shots = [[p.img, p.name], ["assets/img/hero-modelo.jpg", "Así quedan puestos"], ["assets/img/abalorios.jpg", "Materiales"], ["assets/img/taller.jpg", "Hechos a mano en el taller"]];
  const main = $("#main-img img");
  main.src = p.img; main.alt = p.name;
  $("#thumbs").innerHTML = shots.map(([src, alt], i) => `<button aria-pressed="${i === 0}" aria-label="${alt}" data-src="${src}"><img src="${src}" alt=""></button>`).join("");
  $("#thumbs").addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (!b) return;
    $$("#thumbs button").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    main.style.opacity = 0;
    setTimeout(() => { main.src = b.dataset.src; main.style.opacity = 1; }, 200);
  });
  // Zoom siguiendo el ratón
  const box = $("#main-img");
  box.addEventListener("click", () => box.classList.toggle("is-zoom"));
  box.addEventListener("mousemove", (e) => {
    const r = box.getBoundingClientRect();
    main.style.transformOrigin = `${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`;
  });
  box.addEventListener("mouseleave", () => box.classList.remove("is-zoom"));

  // Información
  $("#crumb-name").textContent = p.name;
  $("#p-cat").textContent = `${catName(p.cat)} · ${p.badge || "Hecho a mano"}`;
  $("#p-name").textContent = p.name;
  $("#p-rating").innerHTML = `${stars(p.rating)}<span>${String(p.rating).replace(".", ",")} · ${p.reviews} opiniones</span>`;
  $("#p-desc").textContent = p.desc;
  $("#p-meta").innerHTML = ["✦ Hecho a mano", "✦ Hipoalergénico", "✦ Personalizable", "✦ Pieza única"].map((t) => `<span>${t}</span>`).join("");
  $("#p-details").innerHTML = [`Piedras: ${p.stones}`, "Ganchos de acero inoxidable 316L (hipoalergénicos)", "Baño de oro de 18k o plata de ley 925", "Peso ligero: unos 3 g por pendiente", "Se entregan en bolsita de algodón y cajita reciclada"].map((t) => `<li>${t}</li>`).join("");

  // Colores
  const colorList = [...p.colors.map((c) => VV.colors.find((x) => x.id === c)), ...VV.colors.filter((c) => !p.colors.includes(c.id))].slice(0, 6);
  $("#p-colors").innerHTML = colorList.map((c) => `<button class="swatch" data-c="${c.id}" aria-pressed="${c.id === opts.color}" title="${c.name}" aria-label="${c.name}" style="background:${c.hex}"></button>`).join("");
  $("#p-colors").addEventListener("click", (e) => {
    const b = e.target.closest("[data-c]");
    if (!b) return;
    opts.color = b.dataset.c;
    $$("#p-colors .swatch").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    update();
  });
  $$("[data-opt]").forEach((g) => {
    $$(".chip", g).forEach((c) => c.setAttribute("aria-pressed", String(c.dataset.v === opts[g.dataset.opt])));
    g.addEventListener("click", (e) => {
      const b = e.target.closest(".chip");
      if (!b) return;
      opts[g.dataset.opt] = b.dataset.v;
      $$(".chip", g).forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
      update();
    });
  });
  $("#p-initial").addEventListener("input", (e) => { opts.initial = e.target.value.trim().slice(0, 1).toUpperCase(); e.target.value = opts.initial; update(); });
  $("#p-gift").addEventListener("change", (e) => { opts.gift = e.target.checked; update(); });
  document.addEventListener("click", (e) => {
    const q = e.target.closest("[data-pq]");
    if (!q) return;
    opts.qty = Math.max(1, Math.min(10, opts.qty + +q.dataset.pq));
    $("#p-qty").textContent = opts.qty;
    update();
  });

  const unit = () => p.price + (opts.metal === "plata" && p.metal !== "plata" ? 2 : 0) + (opts.closure === "Clip sin agujero" ? 2 : 0) + (opts.initial ? 2 : 0) + (opts.gift ? 1.5 : 0);
  let shown = unit();
  function animateNumber(el, from, to) {
    const t0 = performance.now();
    const step = (t) => { const k = Math.min(1, (t - t0) / 400); el.textContent = money(from + (to - from) * k); if (k < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  }
  function update() {
    const u = unit();
    animateNumber($("#p-price"), shown, u);
    shown = u;
    $("#p-total").textContent = money(u * opts.qty);
    $("#color-name").textContent = VV.colors.find((c) => c.id === opts.color).name;
  }
  $("#p-price").textContent = money(shown);
  update();

  $("#p-add").addEventListener("click", () => {
    const desc = [opts.metal === "oro" ? "Baño de oro" : "Plata 925", opts.closure, VV.colors.find((c) => c.id === opts.color).name, opts.initial && `Inicial ${opts.initial}`, opts.gift && "Para regalo"].filter(Boolean).join(" · ");
    addToCart({ id: p.id, name: p.name, price: unit(), img: p.img, opts: desc, qty: opts.qty }, main);
  });

  // Relacionados
  const related = VV.products.filter((x) => x.id !== p.id).sort((a, b) => (b.cat === p.cat) - (a.cat === p.cat) || b.reviews - a.reviews).slice(0, 4);
  $("#related").innerHTML = related.map(card).join("");
  observe($("#related"));
})();
