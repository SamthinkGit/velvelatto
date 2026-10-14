# Velvelatto · prototipo de tienda

> *Pendientes bonitos que te hacen ser únic@.*

Prototipo **visual** de la tienda online de Velvelatto (pendientes hechos a mano y personalizables). No hay pagos reales: el carrito, el buscador, los filtros y el personalizador funcionan en el navegador, y el botón "Finalizar compra" muestra dónde iría la pasarela de pago (tarjeta, Bizum, PayPal).

## 3 temas para elegir

Hay un selector flotante abajo a la izquierda (o `?tema=` en la URL):

| Tema | URL | Estilo |
| --- | --- | --- |
| **Bombón** | `/?tema=bombon` | Dulce y pop: bordes ondulados, rosa chicle, letras que rebotan (inspirado en la 3ª referencia) |
| **Velvet** | `/?tema=velvet` | Elegante y editorial: serif, arcos, honeydew y malva (organización tipo Velvetique) |
| **Nácar** | `/?tema=nacar` | Nocturno e iridiscente: degradados de la paleta, cristal, brillos |

Para dejar uno fijo, cambia el valor por defecto `"bombon"` en `assets/js/theme-boot.js` (y opcionalmente oculta `.theme-dock` en `base.css`).

## Páginas

- `index.html`: portada (hero, categorías, promo, favoritos, **personalizador de pendientes**, sobre nosotros, opiniones, FAQ y contacto)
- `tienda.html`: catálogo con filtros (precio, categoría, metal, color) y orden
- `producto.html?id=…`: ficha con galería, zoom y opciones de personalización con precio en vivo

## Estructura

```
assets/css/base.css     estructura y componentes comunes
assets/css/themes.css   los 3 temas (colores, tipografías, formas, heros)
assets/js/data.js       catálogo de ejemplo (productos, precios, opiniones)
assets/js/app.js        cabecera, pie, carrito, buscador, tema, animaciones
assets/js/home.js       portada + personalizador SVG
assets/js/shop.js       filtros de la tienda
assets/js/product.js    ficha de producto
```

Web estática, sin dependencias ni build. En local: `python3 -m http.server` y abrir `http://localhost:8000`.

## Despliegue en Vercel

Importa el repo en Vercel → Framework preset **Other** → sin comando de build ni output directory. Listo.

Contacto de ejemplo: hola@velvelatto.es · Imágenes de producto: 2 fotos reales + variantes generadas con IA.
