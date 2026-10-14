/* Velvelatto · lógica compartida (prototipo visual: sin pagos reales) */
(function () {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const fmt = new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" });
  const money = (n) => fmt.format(n);
  const store = {
    get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} },
  };

  /* ---------- Iconos ---------- */
  const P = (d, extra = "") => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ${extra}>${d}</svg>`;
  const icons = {
    search: P('<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>'),
    user: P('<circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/>'),
    bag: P('<path d="M5 8h14l-1 12H6L5 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>'),
    heart: P('<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z"/>'),
    star: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 2.8 2.8 5.8 6.3.9-4.6 4.4 1.1 6.3L12 17.2l-5.6 3 1.1-6.3L2.9 9.5l6.3-.9L12 2.8Z"/></svg>',
    truck: P('<path d="M3 6h11v10H3zM14 10h4l3 3v3h-7"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>'),
    refresh: P('<path d="M4 12a8 8 0 0 1 14-5.3L20 9M20 4v5h-5M20 12a8 8 0 0 1-14 5.3L4 15M4 20v-5h5"/>'),
    lock: P('<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>'),
    chat: P('<path d="M4 5h16v11H8l-4 4V5Z"/><path d="M8 10h8M8 13h5"/>'),
    hand: P('<path d="M8 13V5.5a1.5 1.5 0 0 1 3 0V11M11 10V4.5a1.5 1.5 0 0 1 3 0V11M14 10.5V6a1.5 1.5 0 0 1 3 0v7c0 4-2.5 7-6 7-2.5 0-4-1.2-5.5-3.5L4 13.5a1.5 1.5 0 0 1 2.5-1.7L8 14"/>'),
    sparkle: P('<path d="M12 3c.8 4.2 2.8 6.2 7 7-4.2.8-6.2 2.8-7 7-.8-4.2-2.8-6.2-7-7 4.2-.8 6.2-2.8 7-7Z"/><path d="M19 16c.3 1.5 1 2.2 2.5 2.5-1.5.3-2.2 1-2.5 2.5-.3-1.5-1-2.2-2.5-2.5 1.5-.3 2.2-1 2.5-2.5Z"/>'),
    leaf: P('<path d="M5 19c0-9 5-14 15-14 0 10-5 15-14 15"/><path d="M5 19c3-4 6-6 9-8"/>'),
    mail: P('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>'),
    close: P('<path d="M6 6l12 12M18 6 6 18"/>'),
    menu: P('<path d="M4 7h16M4 12h16M4 17h10"/>'),
    arrow: P('<path d="M5 12h14M13 6l6 6-6 6"/>'),
    check: P('<path d="m5 12 5 5 9-10"/>'),
    filter: P('<path d="M4 6h16M7 12h10M10 18h4"/>'),
    gift: P('<rect x="3" y="8" width="18" height="5" rx="1"/><path d="M5 13v8h14v-8M12 8v13M12 8C10 4 7 4 7 6.5S12 8 12 8Zm0 0c2-4 5-4 5-1.5S12 8 12 8Z"/>'),
    brush: P('<path d="M14 4l6 6-8 8H6v-6l8-8Z"/><path d="M12 6l6 6"/>'),
    instagram: P('<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".8" fill="currentColor"/>'),
    tiktok: P('<path d="M14 3v11a3.5 3.5 0 1 1-3.5-3.5M14 3c.5 2.5 2.5 4.5 5 4.5"/>'),
    pinterest: P('<circle cx="12" cy="12" r="9"/><path d="M11 8.5c3-1 5.5.6 5 3.3-.4 2.4-3 3.3-4.3 2M11.5 10 9 20"/>'),
  };
  const mark = '<svg class="logo__mark" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2c.9 4.6 3.4 7.1 8 8-4.6.9-7.1 3.4-8 8-.9-4.6-3.4-7.1-8-8 4.6-.9 7.1-3.4 8-8Z"/></svg>';
  const fillIcons = (root = document) => $$("[data-icon]", root).forEach((el) => { if (!el.dataset.filled) { el.innerHTML = icons[el.dataset.icon] || ""; el.dataset.filled = 1; } });
  const stars = (n = 5) => `<span class="stars" aria-label="${n} de 5">${icons.star.repeat(Math.round(n))}</span>`;

  /* ---------- Cabecera y pie ---------- */
  const page = document.body.dataset.page;
  const links = [
    ["index.html", "Inicio", "inicio"],
    ["tienda.html", "Tienda", "tienda"],
    ["index.html#personaliza", "Personaliza", ""],
    ["index.html#sobre", "Nosotros", ""],
    ["index.html#contacto", "Contacto", ""],
  ];
  const logo = (tag = true) => `<a class="logo" href="index.html" aria-label="Velvelatto, inicio">${mark}<span class="logo__word">Velvelatto</span>${tag ? '<span class="logo__tag">pendientes</span>' : ""}</a>`;
  const announce = ["Envío gratis desde 25 €", "Usa VELVET10 y llévate un 10% en tu primer pedido", "Hechos a mano en España", "Personaliza colores, cierre e inicial", "Packs regalo con tarjeta escrita a mano"];

  $("#site-header").outerHTML = `
    <div class="announce"><div class="announce__track">${[...announce, ...announce].map((t) => `<span>${t}</span>`).join("")}</div></div>
    <header class="site-header">
      <div class="container header__inner">
        <button class="icon-btn burger" aria-label="Abrir menú" data-open-nav>${icons.menu}</button>
        <nav class="nav" aria-label="Principal">${links.map(([h, t, p]) => `<a href="${h}"${p && p === page ? ' aria-current="page"' : ""}>${t}</a>`).join("")}</nav>
        ${logo()}
        <div class="header__actions">
          <button class="icon-btn" aria-label="Buscar" data-open-search>${icons.search}</button>
          <button class="icon-btn icon-btn--account" aria-label="Mi cuenta" data-proto="Las cuentas de cliente llegarán en la versión real ✦">${icons.user}</button>
          <button class="icon-btn" aria-label="Carrito" data-open-cart>${icons.bag}<span class="cart-count"></span></button>
        </div>
      </div>
    </header>
    <div class="mobile-nav" id="mobile-nav"><div class="mobile-nav__scrim" data-close-nav></div><div class="mobile-nav__panel">
      <button class="icon-btn" aria-label="Cerrar menú" data-close-nav style="justify-self:end;margin:-8px -8px 10px auto">${icons.close}</button>
      ${links.map(([h, t]) => `<a href="${h}" data-close-nav>${t}</a>`).join("")}
      <a class="contact-mail" style="font-size:1rem;border:0;margin-top:auto;font-family:var(--font-body)" href="mailto:${VV.store.email}">${icons.mail}${VV.store.email}</a>
    </div></div>`;

  const perks = [
    ["truck", "Envío gratis", "En pedidos desde 25 €"],
    ["refresh", "Devoluciones fáciles", "14 días para cambiar de idea"],
    ["lock", "Pago seguro", "Tarjeta, Bizum o PayPal"],
    ["chat", "Te ayudamos", "Por email o Instagram"],
  ];
  $("#site-footer").outerHTML = `
    <section class="perks"><div class="container perks__grid">${perks.map(([i, a, b]) => `<div class="trust__item"><span class="trust__icon">${icons[i]}</span><div><strong>${a}</strong><span>${b}</span></div></div>`).join("")}</div></section>
    <footer class="site-footer">
      <div class="container footer__grid">
        <div class="footer__brand">
          ${logo()}
          <p>${VV.store.slogan} Hechos a mano, uno a uno, con piedras naturales y mucho cariño.</p>
          <div class="socials"><a href="#" aria-label="Instagram">${icons.instagram}</a><a href="#" aria-label="TikTok">${icons.tiktok}</a><a href="#" aria-label="Pinterest">${icons.pinterest}</a></div>
        </div>
        <div><h4>Tienda</h4><ul><li><a href="tienda.html">Todos los pendientes</a></li><li><a href="tienda.html?cat=aros">Aros</a></li><li><a href="tienda.html?cat=colgantes">Colgantes</a></li><li><a href="tienda.html?cat=divertidos">Divertidos</a></li><li><a href="index.html#personaliza">Personalizados</a></li></ul></div>
        <div><h4>Ayuda</h4><ul><li><a href="index.html#contacto">Preguntas frecuentes</a></li><li><a href="#" data-proto="Página de envíos (contenido de ejemplo)">Envíos</a></li><li><a href="#" data-proto="Página de devoluciones (contenido de ejemplo)">Cambios y devoluciones</a></li><li><a href="#" data-proto="Guía de cuidados (contenido de ejemplo)">Cuidado de tus pendientes</a></li><li><a href="mailto:${VV.store.email}">${VV.store.email}</a></li></ul></div>
        <div><h4>Newsletter</h4><p style="opacity:.8;font-size:.9rem;margin-bottom:12px">Novedades, drops limitados y un 10% de bienvenida.</p>
          <form class="newsletter" data-fake-form="¡Gracias! Te hemos apuntado a la lista ✦"><input type="email" placeholder="Tu email" required aria-label="Tu email"><button class="btn btn--light btn--sm" type="submit">Unirme</button></form>
        </div>
      </div>
      <div class="footer__giant" aria-hidden="true">Velvelatto</div>
      <div class="container footer__bottom">
        <span>© 2026 Velvelatto · Prototipo visual · Aviso legal · Privacidad · Cookies</span>
        <div class="pay"><span>VISA</span><span>Mastercard</span><span>Bizum</span><span>PayPal</span><span>Apple Pay</span></div>
      </div>
    </footer>

    <div class="drawer" id="cart" aria-hidden="true">
      <div class="drawer__scrim" data-close-cart></div>
      <aside class="drawer__panel" role="dialog" aria-label="Carrito">
        <div class="drawer__head"><h3>Tu cesta</h3><button class="icon-btn" aria-label="Cerrar" data-close-cart>${icons.close}</button></div>
        <div class="ship-bar"><span id="ship-msg"></span><div class="ship-bar__track"><div class="ship-bar__fill" id="ship-fill"></div></div></div>
        <div class="drawer__items" id="cart-items"></div>
        <div class="drawer__foot" id="cart-foot"></div>
      </aside>
    </div>
    <div class="modal" id="modal"><div class="modal__scrim" data-close-modal></div><div class="modal__box" id="modal-box"></div></div>
    <div class="search" id="search"><div class="search__scrim" data-close-search></div><div class="search__box">
      <input class="input" id="search-input" placeholder="Busca pendientes: aro, perla, lavanda…" autocomplete="off">
      <div class="search__results" id="search-results"></div>
    </div></div>
    <div class="toast-wrap" id="toasts"></div>
    <div class="theme-dock" role="group" aria-label="Elegir tema">
      <span class="theme-dock__label">Tema</span>
      <button data-set="bombon"><i></i>Bombón</button>
      <button data-set="velvet"><i></i>Velvet</button>
      <button data-set="nacar"><i></i>Nácar</button>
      <span class="theme-dock__tip">✦ Prueba los 3 diseños: cambia de tema aquí y la web entera se transforma.</span>
    </div>`;

  /* ---------- Toasts ---------- */
  function toast(msg, icon = "check") {
    const t = document.createElement("div");
    t.className = "toast";
    t.innerHTML = `${icons[icon] || ""}<span>${msg}</span>`;
    $("#toasts").append(t);
    setTimeout(() => { t.classList.add("out"); setTimeout(() => t.remove(), 400); }, 2600);
  }

  /* ---------- Modal ---------- */
  function modal(html) {
    $("#modal-box").innerHTML = html;
    fillIcons($("#modal-box"));
    $("#modal").classList.add("is-open");
  }
  const closeModal = () => $("#modal").classList.remove("is-open");

  /* ---------- Carrito ---------- */
  let cart = store.get("vv-cart", []);
  const count = () => cart.reduce((s, i) => s + i.qty, 0);
  const subtotal = () => cart.reduce((s, i) => s + i.qty * i.price, 0);

  function renderCart() {
    store.set("vv-cart", cart);
    $$(".cart-count").forEach((c) => (c.textContent = count() || ""));
    const sub = subtotal();
    const left = Math.max(0, VV.store.freeShipping - sub);
    $("#ship-msg").innerHTML = left > 0 ? `Te faltan <b>${money(left)}</b> para el envío gratis ✦` : "¡Genial! Tu envío es <b>gratis</b> ✦";
    $("#ship-fill").style.width = Math.min(100, (sub / VV.store.freeShipping) * 100) + "%";
    if (!cart.length) {
      $("#cart-items").innerHTML = `<div class="drawer__empty">${icons.bag}<p>Tu cesta está vacía…<br>¡pero tus orejas no tienen por qué estarlo!</p><a class="btn btn--sm" href="tienda.html">Ir a la tienda</a></div>`;
      $("#cart-foot").innerHTML = "";
      return;
    }
    $("#cart-items").innerHTML = cart.map((i) => `
      <div class="line-item" data-key="${i.key}">
        <img src="${i.img}" alt="">
        <div><h4>${i.name}</h4><small>${i.opts || ""}</small>
          <div class="qty"><button data-q="-1" aria-label="Quitar uno">−</button><span>${i.qty}</span><button data-q="1" aria-label="Añadir uno">+</button></div>
        </div>
        <div class="line-item__right"><span class="price">${money(i.price * i.qty)}</span><button class="line-item__remove" data-remove>Quitar</button></div>
      </div>`).join("");
    const ship = left > 0 ? VV.store.shipping : 0;
    $("#cart-foot").innerHTML = `
      <div class="drawer__row"><span>Subtotal</span><span>${money(sub)}</span></div>
      <div class="drawer__row"><span>Envío (España)</span><span>${ship ? money(ship) : "Gratis"}</span></div>
      <div class="drawer__row drawer__row--total"><span>Total</span><span>${money(sub + ship)}</span></div>
      <button class="btn btn--block" data-checkout>${icons.lock}Finalizar compra</button>
      <p class="drawer__note">Pago seguro con tarjeta, Bizum o PayPal</p>`;
  }

  function addToCart(item, sourceImg) {
    const key = item.id + "|" + (item.opts || "");
    const found = cart.find((i) => i.key === key);
    if (found) found.qty += item.qty || 1;
    else cart.push({ ...item, key, qty: item.qty || 1 });
    if (sourceImg) flyToCart(sourceImg, () => bumpCart());
    else bumpCart();
    renderCart();
    toast(`<b>${item.name}</b> añadido a tu cesta`, "bag");
  }
  function bumpCart() {
    $$(".cart-count").forEach((c) => { c.classList.remove("bump"); void c.offsetWidth; c.classList.add("bump"); });
  }
  function flyToCart(img, done) {
    const target = $("[data-open-cart]").getBoundingClientRect();
    const r = img.getBoundingClientRect();
    if (!r.width) return done && done();
    const f = img.cloneNode(true);
    f.setAttribute("class", "fly");
    const size = Math.min(r.width, r.height, 160);
    Object.assign(f.style, { left: r.left + r.width / 2 - size / 2 + "px", top: r.top + r.height / 2 - size / 2 + "px", width: size + "px", height: size + "px" });
    document.body.append(f);
    requestAnimationFrame(() => requestAnimationFrame(() => {
      const dx = target.left + target.width / 2 - (r.left + r.width / 2);
      const dy = target.top + target.height / 2 - (r.top + r.height / 2);
      f.style.transform = `translate(${dx}px, ${dy}px) scale(.12) rotate(25deg)`;
      f.style.opacity = ".4";
    }));
    setTimeout(() => { f.remove(); done && done(); }, 850);
  }
  const openCart = () => { $("#cart").classList.add("is-open"); $("#cart").setAttribute("aria-hidden", "false"); };
  const closeCart = () => { $("#cart").classList.remove("is-open"); $("#cart").setAttribute("aria-hidden", "true"); };

  /* ---------- Favoritos ---------- */
  let favs = store.get("vv-favs", []);

  /* ---------- Tarjeta de producto ---------- */
  const catName = (id) => (VV.categories.find((c) => c.id === id) || {}).name || "";
  function card(p, i = 0) {
    return `
      <article class="card" data-reveal style="--i:${i % 4}" data-id="${p.id}">
        <a class="card__media" href="producto.html?id=${p.id}">
          <img src="${p.img}" alt="${p.name}" loading="lazy">
          ${p.badge ? `<span class="card__badge">${p.badge}</span>` : ""}
        </a>
        <button class="card__fav${favs.includes(p.id) ? " is-on" : ""}" aria-label="Añadir a favoritos" data-fav="${p.id}">${icons.heart}</button>
        <div class="card__body">
          <span class="card__cat">${catName(p.cat)} · ${p.metal === "oro" ? "Baño de oro" : "Plata 925"}</span>
          <h3 class="card__title"><a href="producto.html?id=${p.id}">${p.name}</a></h3>
          <div class="card__rating">${stars(p.rating)}<span>(${p.reviews})</span></div>
          <div class="card__foot"><span class="price">${money(p.price)}</span><button class="btn btn--sm card__add" data-add="${p.id}">${icons.bag}Añadir</button></div>
        </div>
      </article>`;
  }

  /* ---------- Aparición al hacer scroll ---------- */
  const io = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
  }), { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  const observe = (root = document) => $$("[data-reveal]:not(.is-in)", root).forEach((el) => io.observe(el));

  /* Contadores animados */
  const countIO = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (!e.isIntersecting) return;
    const el = e.target, end = parseFloat(el.dataset.count), dec = +el.dataset.decimals || 0, suf = el.dataset.suffix || "";
    const t0 = performance.now();
    const step = (t) => {
      const k = Math.min(1, (t - t0) / 1600), v = end * (1 - Math.pow(1 - k, 3));
      el.textContent = (dec ? v.toFixed(dec).replace(".", ",") : Math.round(v).toLocaleString("es-ES")) + suf;
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
    countIO.unobserve(el);
  }), { threshold: 0.6 });

  /* ---------- Tema ---------- */
  function setTheme(t, animate = true) {
    const apply = () => {
      document.documentElement.setAttribute("data-theme", t);
      store.set("vv-theme", t);
      try { localStorage.setItem("vv-theme", t); } catch (e) {}
      $$(".theme-dock button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.set === t)));
      const meta = $('meta[name="theme-color"]');
      if (meta) meta.content = { bombon: "#FFEDF5", velvet: "#FBF8F6", nacar: "#140D19" }[t];
      const u = new URL(location); u.searchParams.set("tema", t); history.replaceState(null, "", u);
      document.dispatchEvent(new CustomEvent("vv:theme", { detail: t }));
    };
    if (animate && document.startViewTransition && !matchMedia("(prefers-reduced-motion: reduce)").matches) document.startViewTransition(apply);
    else apply();
  }

  /* ---------- Buscador ---------- */
  function renderSearch(q) {
    const n = q.trim().toLowerCase();
    const res = VV.products.filter((p) => !n || (p.name + p.stones + p.cat + p.colors.join(" ")).toLowerCase().includes(n)).slice(0, 6);
    $("#search-results").innerHTML = res.length
      ? res.map((p) => `<a href="producto.html?id=${p.id}"><img src="${p.img}" alt=""><span>${p.name}<br><small style="color:var(--muted)">${p.stones}</small></span><b class="price">${money(p.price)}</b></a>`).join("")
      : `<p style="padding:16px;color:var(--muted)">Nada por aquí… prueba con “aro”, “perla” o “lavanda”.</p>`;
  }

  /* ---------- Eventos globales ---------- */
  document.addEventListener("click", (e) => {
    const t = e.target.closest("button, a");
    if (!t) return;
    if (t.matches("[data-add]")) {
      const p = VV.products.find((x) => x.id === t.dataset.add);
      const img = t.closest(".card")?.querySelector("img");
      addToCart({ id: p.id, name: p.name, price: p.price, img: p.img, opts: p.metal === "oro" ? "Baño de oro · Gancho" : "Plata 925 · Gancho" }, img);
    } else if (t.matches("[data-fav]")) {
      const id = t.dataset.fav;
      favs = favs.includes(id) ? favs.filter((f) => f !== id) : [...favs, id];
      store.set("vv-favs", favs);
      t.classList.toggle("is-on");
      if (t.classList.contains("is-on")) toast("Guardado en favoritos", "heart");
    } else if (t.matches("[data-open-cart]")) openCart();
    else if (t.matches("[data-close-cart]")) closeCart();
    else if (t.matches("[data-q]")) {
      const key = t.closest(".line-item").dataset.key, it = cart.find((i) => i.key === key);
      it.qty += +t.dataset.q;
      if (it.qty < 1) cart = cart.filter((i) => i !== it);
      renderCart();
    } else if (t.matches("[data-remove]")) {
      const key = t.closest(".line-item").dataset.key;
      cart = cart.filter((i) => i.key !== key);
      renderCart();
    } else if (t.matches("[data-checkout]")) {
      closeCart();
      modal(`<span class="modal__icon" data-icon="lock"></span><h3>Aquí iría el pago</h3>
        <p>Esto es un <b>prototipo visual</b>. En la tienda real, este botón llevará a una pasarela segura para pagar con:</p>
        <div class="pay-methods"><span>Tarjeta</span><span>Bizum</span><span>PayPal</span><span>Apple Pay</span></div>
        <p style="font-size:.85rem">El dinero llega directamente a la cuenta de Velvelatto y recibes un email con el seguimiento del envío.</p>
        <button class="btn" data-close-modal>Entendido ✦</button>`);
    } else if (t.matches("[data-close-modal]")) closeModal();
    else if (t.matches("[data-open-nav]")) $("#mobile-nav").classList.add("is-open");
    else if (t.matches("[data-close-nav]")) $("#mobile-nav").classList.remove("is-open");
    else if (t.matches("[data-open-search]")) { $("#search").classList.add("is-open"); renderSearch(""); setTimeout(() => $("#search-input").focus(), 50); }
    else if (t.matches("[data-close-search]")) $("#search").classList.remove("is-open");
    else if (t.matches(".theme-dock button")) setTheme(t.dataset.set);
    else if (t.matches("[data-proto]")) { e.preventDefault(); toast(t.dataset.proto, "sparkle"); }
  });
  // Clic en scrim del buscador (es un div)
  $("#search .search__scrim").addEventListener("click", () => $("#search").classList.remove("is-open"));
  $("#search-input").addEventListener("input", (e) => renderSearch(e.target.value));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") { closeCart(); closeModal(); $("#search").classList.remove("is-open"); $("#mobile-nav").classList.remove("is-open"); }
    if (e.key === "/" && !/input|textarea/i.test(document.activeElement.tagName)) { e.preventDefault(); $("[data-open-search]").click(); }
  });
  document.addEventListener("submit", (e) => {
    const f = e.target.closest("[data-fake-form]");
    if (!f) return;
    e.preventDefault();
    toast(f.dataset.fakeForm || "¡Mensaje enviado! (prototipo, no se ha enviado nada)", "mail");
    f.reset();
  });

  // Cabecera con sombra al hacer scroll
  const header = $(".site-header");
  addEventListener("scroll", () => header.classList.toggle("is-scrolled", scrollY > 10), { passive: true });

  // Inclinación 3D (tarjetas en Nácar + escenario del hero)
  const fine = matchMedia("(pointer: fine)").matches;
  document.addEventListener("pointermove", (e) => {
    if (!fine) return;
    const theme = document.documentElement.dataset.theme;
    if (theme === "nacar") {
      document.body.style.setProperty("--mx", e.clientX + "px");
      document.body.style.setProperty("--my", e.clientY + "px");
    }
    const el = e.target.closest(theme === "nacar" ? ".card, [data-tilt]" : "[data-tilt]");
    $$(".tilting").forEach((x) => { if (x !== el) { x.classList.remove("tilting"); x.style.removeProperty("--rx"); x.style.removeProperty("--ry"); const c = x.querySelector(".hn__card"); c && (c.style.removeProperty("--rx"), c.style.removeProperty("--ry")); } });
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
    const target = el.matches("[data-tilt]") ? el.querySelector(".hn__card") || el : el;
    const k = el.matches("[data-tilt]") ? 18 : 8;
    target.style.setProperty("--rx", (-py * k).toFixed(2) + "deg");
    target.style.setProperty("--ry", (px * k).toFixed(2) + "deg");
    el.classList.add("tilting");
  }, { passive: true });

  /* ---------- Init ---------- */
  fillIcons();
  $$("[data-stars]").forEach((s) => (s.outerHTML = stars(+s.dataset.stars)));
  $$("[data-count]").forEach((el) => countIO.observe(el));
  setTheme(document.documentElement.dataset.theme || "bombon", false);
  renderCart();
  observe();

  window.VV = Object.assign(window.VV, { $, $$, money, icons, stars, card, observe, fillIcons, addToCart, toast, modal, openCart, catName });
})();
