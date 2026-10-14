/* Catálogo de ejemplo (prototipo visual). Precios aproximados en euros. */
window.VV = window.VV || {};

VV.store = {
  name: "Velvelatto",
  slogan: "Pendientes bonitos que te hacen ser únic@.",
  email: "hola@velvelatto.es",
  instagram: "@velvelatto",
  freeShipping: 25,
  shipping: 3.5,
};

VV.categories = [
  { id: "aros", name: "Aros", img: "assets/img/arcoiris-pastel.webp" },
  { id: "colgantes", name: "Colgantes", img: "assets/img/gota-cuarzo.webp" },
  { id: "mini", name: "Mini & huggies", img: "assets/img/corazon-nacar.jpg" },
  { id: "divertidos", name: "Divertidos", img: "assets/img/cereza.jpg" },
  { id: "personalizados", name: "Personalizados", img: "assets/img/abalorios.jpg", href: "index.html#personaliza" },
  { id: "packs", name: "Packs regalo", img: "assets/img/margarita.jpg", href: "tienda.html?cat=packs" },
];

VV.colors = [
  { id: "rosa", name: "Rosa", hex: "#DEAFC2" },
  { id: "lavanda", name: "Lavanda", hex: "#A775C9" },
  { id: "menta", name: "Menta", hex: "#BFE3C6" },
  { id: "crema", name: "Crema", hex: "#F3E9CF" },
  { id: "blanco", name: "Blanco nácar", hex: "#F7F3F5" },
  { id: "multi", name: "Arcoíris", hex: "conic-gradient(#DEAFC2,#A775C9,#BFE3C6,#F3E9CF,#DEAFC2)" },
];

VV.products = [
  {
    id: "arcoiris-pastel", name: "Aro Arcoíris Pastel", price: 12, cat: "aros", metal: "oro", colors: ["multi", "rosa", "lavanda", "menta"],
    img: "assets/img/arcoiris-pastel.webp", badge: "Más vendido", rating: 4.9, reviews: 128, packs: true,
    stones: "Cuarzo rosa, amatista, prehnita, aguamarina y piedra luna facetadas",
    desc: "Nuestro aro estrella: piedras naturales facetadas en tonos pastel separadas por diminutas bolitas doradas. Ligero, alegre y combinable con todo.",
  },
  {
    id: "gota-cuarzo", name: "Gota de Cuarzo Rosa", price: 14, cat: "colgantes", metal: "plata", colors: ["rosa", "blanco"],
    img: "assets/img/gota-cuarzo.webp", badge: "Favorito", rating: 4.8, reviews: 86,
    stones: "Cuarzo rosa y cristal de roca facetado",
    desc: "Cadenita fina que dibuja una gota con cuarzo rosa y una piedra central facetada que atrapa la luz. Elegante para una boda o un martes cualquiera.",
  },
  {
    id: "lluvia-amatista", name: "Lluvia de Amatista", price: 15, cat: "colgantes", metal: "plata", colors: ["lavanda"],
    img: "assets/img/lluvia-amatista.jpg", badge: "Edición limitada", rating: 5, reviews: 41,
    stones: "Amatista facetada",
    desc: "Una cascada de amatistas diminutas que se mueve contigo. Largo y ligero, para looks con el pelo recogido.",
  },
  {
    id: "margarita", name: "Margaritas", price: 9, cat: "divertidos", metal: "oro", colors: ["blanco", "crema"],
    img: "assets/img/margarita.jpg", rating: 4.9, reviews: 203, packs: true,
    stones: "Mostacillas de cristal checo",
    desc: "Florecitas tejidas a mano cuenta a cuenta. El pendiente más primaveral de la colección.",
  },
  {
    id: "corazon-nacar", name: "Corazón de Nácar", price: 11, cat: "mini", metal: "oro", colors: ["blanco"],
    img: "assets/img/corazon-nacar.jpg", badge: "Nuevo", rating: 4.7, reviews: 19,
    stones: "Nácar natural",
    desc: "Mini aro dorado con un corazón de nácar iridiscente. Para llevar a diario y no quitártelo nunca.",
  },
  {
    id: "luna-perla", name: "Luna & Perla", price: 12, cat: "colgantes", metal: "oro", colors: ["crema", "blanco"],
    img: "assets/img/luna-perla.jpg", rating: 4.8, reviews: 64,
    stones: "Perla de agua dulce",
    desc: "Una media luna dorada que acuna una perla de agua dulce. Romántico, nocturno y un poquito mágico.",
  },
  {
    id: "menta", name: "Aro Menta", price: 11, cat: "aros", metal: "oro", colors: ["menta"],
    img: "assets/img/menta.jpg", rating: 4.9, reviews: 52, packs: true,
    stones: "Prehnita facetada",
    desc: "La versión fresquita de nuestro aro clásico: prehnita verde menta y bolitas doradas.",
  },
  {
    id: "burbuja", name: "Estrella & Luna", price: 10, cat: "divertidos", metal: "oro", colors: ["rosa", "lavanda"],
    img: "assets/img/burbuja.jpg", badge: "Nuevo", rating: 4.8, reviews: 33, packs: true,
    stones: "Perlas teñidas en rosa y lavanda",
    desc: "Desparejados a propósito: una estrella en una oreja, una luna en la otra. Porque ser únic@ va de eso.",
  },
  {
    id: "cereza", name: "Cerezas", price: 8, cat: "divertidos", metal: "oro", colors: ["rosa"],
    img: "assets/img/cereza.jpg", rating: 4.9, reviews: 147, packs: true,
    stones: "Cristal soplado y mostacillas",
    desc: "Dos cerecitas de cristal brillante con hojita verde. Dulces, divertidos y con mucho rollo.",
  },
  {
    id: "mariposa", name: "Mariposa Lavanda", price: 13, cat: "divertidos", metal: "oro", colors: ["lavanda", "rosa"],
    img: "assets/img/mariposa.jpg", rating: 4.7, reviews: 28,
    stones: "Mostacillas de cristal",
    desc: "Mariposas tejidas a mano con mostacillas lavanda y rosa empolvado. Cada una sale un pelín distinta.",
  },
];

VV.reviews = [
  { name: "Lucía M.", city: "Valencia", text: "Me llegaron en dos días y con un envoltorio precioso. El aro arcoíris es todavía más bonito en persona.", product: "Aro Arcoíris Pastel" },
  { name: "Andrea G.", city: "Madrid", text: "Pedí unos con mi inicial para regalar a mi hermana y lloró. Atención súper cercana por Instagram.", product: "Personalizados" },
  { name: "Alex R.", city: "Sevilla", text: "Tengo la piel sensible y estos no me dan ninguna reacción. Ya voy por mi cuarto par.", product: "Cerezas" },
];
