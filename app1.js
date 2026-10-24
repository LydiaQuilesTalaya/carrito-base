// La clase guarda los productos y hace los cálculos.
class Carrito {
  constructor(productos, moneda = "€") {
    this.productos = productos;
    this.moneda = moneda;
    for (const producto of productos) {
      producto.price = Number(producto.price);
      producto.quantity = 1;
      producto.subtotal = Number((producto.price * producto.quantity).toFixed(2));
    }
  }

  obtenerInformacionProducto(sku) {
    return this.productos.find(producto => producto.SKU === sku);
  }

  actualizarUnidades(sku, unidades) {
    const producto = this.obtenerInformacionProducto(sku);
    producto.quantity = Math.max(0, unidades);
    producto.subtotal = Number((producto.price * producto.quantity).toFixed(2));
  }

  obtenerCarrito() {
    const products = this.productos.filter(producto => producto.quantity > 0);
    let total = 0;
    for (const producto of products) total += producto.subtotal;
    return { products, total: Number(total.toFixed(2)), currency: this.moneda };
  }
}

let carrito;
const tabla = document.querySelector("#productos");
const resumen = document.querySelector("#resumen");
const total = document.querySelector("#total");
const estado = document.querySelector("#estado");

function dinero(numero) {
  return numero.toFixed(2) + " " + carrito.moneda;
}

//NUEVO: Función para mostrar el resumen del carrito cuando escribimos en el input de cantidad.
function mostrarResumen() {
  const datos = carrito.obtenerCarrito();
  mostrarYCalcularGastosEnvio(datos);
  resumen.replaceChildren();
  for (const producto of datos.products) {
    const item = document.createElement("li");
    item.textContent = `${producto.quantity} x ${producto.title}: ${dinero(producto.subtotal)}`;
    resumen.append(item);
  }
  total.textContent = dinero(datos.total);
}

function mostrarYCalcularGastosEnvio(datos) {
  const gastosEnvio = document.querySelector("#gastosEnvio");
  gastosEnvio.textContent = datos.total > 50 ? "Gratis" : "5.99 €";
  if (datos.total < 50) {
    datos.total += 5.99;
  }
}

// Una sola función dibuja toda la pantalla.
function mostrar() {
  tabla.replaceChildren();

  for (const producto of carrito.productos) {
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td><img class="imagenProducto" alt=""></td>
      <td><strong></strong><small></small></td>
      <td class="cantidad">
        <button type="button" class="menos" aria-label="Quitar una unidad">−</button>
        <input type="text" inputmode="numeric" value="0" aria-label="Cantidad">
        <button type="button" class="mas" aria-label="Añadir una unidad">+</button>
      </td>
      <td class="precio"></td><td class="subtotal"></td>
      <td><button type="button" class="eliminar" aria-label="Quitar del carrito">🗑️</button></td>
    `;
    const imagen = fila.querySelector(".imagenProducto");
    imagen.src = producto.image;
    imagen.alt = producto.title;
    fila.querySelector("strong").textContent = producto.title;
    fila.querySelector("small").textContent = "REF: " + producto.SKU;
    fila.querySelector("input").value = producto.quantity;
    fila.querySelector(".precio").textContent = dinero(producto.price);
    fila.querySelector(".subtotal").textContent = dinero(producto.subtotal);
    fila.querySelector(".menos").onclick = () => cambiar(producto.SKU, -1);
    fila.querySelector(".mas").onclick = () => cambiar(producto.SKU, 1);
    tabla.append(fila);

    //NUEVO: Sólo vamos a permitir dígitos en el input de cantidad y cuando el usuario introduzca 
    //un número, se eliminará el cero para no mostrar cifras como 01.
    const cantidad = fila.querySelector("input");
    cantidad.addEventListener("input", (evento) => {
      const soloDigitos = evento.target.value.replace(/\D/g, "");
      if (evento.target.value !== soloDigitos) evento.target.value = soloDigitos;
       evento.target.value = Number(String(evento.target.value).slice(0));
    });

    //NUEVO: Actualizamos el carrito.
    cantidad.addEventListener("input", () => {
      const unidades = Math.max(0, parseInt(cantidad.value, 10) || 0);
      carrito.actualizarUnidades(producto.SKU, unidades);
      fila.querySelector(".subtotal").textContent = dinero(producto.subtotal);
      mostrarResumen();
    });

    fila.querySelector(".eliminar").addEventListener("click", () => {
    carrito.productos = carrito.productos.filter(
    articulo => articulo.SKU !== producto.SKU
  );
  mostrar();
});
  }

  mostrarResumen();
}

// Cada botón cambia una cantidad y vuelve a dibujar la pantalla.
function cambiar(sku, cambio) {
  const producto = carrito.obtenerInformacionProducto(sku);
  carrito.actualizarUnidades(sku, producto.quantity + cambio);
  mostrar();
}

//Pedimos los productos e iniciamos el carrito.
const URL_API = "api.php";
//const URL_API = "api-inexistente.php"; //Para fingir el error de la API.

async function iniciar() {
  try {
    const respuesta = await fetch(URL_API);
    if (!respuesta.ok) throw new Error("HTTP " + respuesta.status);
    const datos = await respuesta.json();
    carrito = new Carrito(datos.products, datos.currency);
    mostrar();
    estado.classList.remove("error");
    estado.classList.add("correcto");
    estado.textContent = "🚚 Envío gratis en pedidos de 50 € o más";
  } catch (error) {
    estado.classList.remove("correcto");
    estado.classList.add("error");
    estado.textContent = "No se pudieron cargar los productos: " + error.message;
  }
}

iniciar();
