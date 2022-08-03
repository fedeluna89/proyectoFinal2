// declaramos las variables
let carrito = [];
let productosBD = [];
const divisa = '$';
const DOMitems = document.querySelector('#items');
const DOMbotonCarrito = document.querySelector('#btn-carrito');
const storage = window.localStorage;

// Funciones para renderizar el carrito
function main() {
    cargarCarritoDeLocalStorage();
    renderizarProductos();
    muestraCarrito();
}

async function renderizarProductos() {
    const productosRespuesta = await fetch('/products.json')
    productosBD = await productosRespuesta.json()


    productosBD.forEach((info) => {
        const miNodo = document.createElement('div');
        miNodo.classList.add('card', 'col-sm-4');
        const miNodoCardBody = document.createElement('div');
        miNodoCardBody.classList.add('card-body');
        const miNodoTitle = document.createElement('h5');
        miNodoTitle.classList.add('card-title');
        miNodoTitle.textContent = info.nombre;
        const miNodoImagen = document.createElement('img');
        miNodoImagen.classList.add('img-fluid');
        miNodoImagen.setAttribute('src', info.imagen);
        const miNodoPrecio = document.createElement('p');
        miNodoPrecio.classList.add('card-text');
        miNodoPrecio.textContent = `${divisa}${info.precio}`;
        const miNodoBoton = document.createElement('button');
        miNodoBoton.classList.add('btn', 'btn-primary', 'btn-add', `botonTienda`);
        miNodoBoton.textContent = 'Añadir';
        miNodoBoton.setAttribute('marcador', info.id);
        miNodoBoton.addEventListener('click', addProductoCarrito);
        miNodoCardBody.appendChild(miNodoImagen);
        miNodoCardBody.appendChild(miNodoTitle);
        miNodoCardBody.appendChild(miNodoPrecio);
        miNodoCardBody.appendChild(miNodoBoton);
        miNodo.appendChild(miNodoCardBody);
        DOMitems.appendChild(miNodo);
    });
}

function addProductoCarrito(evento) {
    carrito.push(evento.target.getAttribute('marcador'))
    guardarCarritoEnLocalStorage();

    Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
    });

    Swal.fire({
        position: "center",
        icon: "success",
        title: "Agregaste a carrito",
        showConfirmButton: false,
        timer: 2000,
    });

    const DOMCartItems = document.querySelector('.cart-items')
    DOMCartItems.textContent = carrito.length
}

function renderizarCarrito() {
    const DOMcarrito = document.querySelector('#carrito');
    const DOMtotal = document.querySelector('#total');

    const carritoSinDuplicados = [...new Set(carrito)];
    carritoSinDuplicados.forEach((item) => {
        const miItem = productosBD.filter((itemBaseDatos) => {
            return itemBaseDatos.id === parseInt(item);
        });
        const numeroUnidadesItem = carrito.reduce((total, itemId) => {
            return itemId === item ? total += 1 : total;
        }, 0);
        const miNodo = document.createElement('li');
        miNodo.classList.add('list-group-item', 'text-right', 'mx-2');
        miNodo.textContent = `${numeroUnidadesItem} x ${miItem[0].nombre} - ${divisa}${miItem[0].precio}`;
        const miBoton = document.createElement('button');
        miBoton.classList.add('btn', 'btn-danger', 'mx-5');
        miBoton.textContent = 'X';
        miBoton.style.marginLeft = '1rem';
        miBoton.dataset.item = item;
        miBoton.addEventListener('click', borrarItemCarrito);
        miNodo.appendChild(miBoton);
        DOMcarrito.appendChild(miNodo);
    });
    DOMtotal.textContent = calcularTotal();
}

function borrarItemCarrito(evento) {
    Swal.fire({
        position: 'center',
        icon: 'warning',
        title: 'Ha sido borrado correctamente',
        showConfirmButton: false,
        timer: 1500
    })
    const id = evento.target.dataset.item;
    carrito = carrito.filter((carritoId) => {
        return carritoId !== id;
    });
    
    guardarCarritoEnLocalStorage()
    const DOMCartItems = document.querySelector('.cart-items')
    DOMCartItems.textContent = carrito.length

}

function calcularTotal() {
    return carrito.reduce((total, item) => {
        const miItem = productosBD.filter((itemBaseDatos) => {
            return itemBaseDatos.id === parseInt(item);
        });
        return total + miItem[0].precio;
    }, 0).toFixed(0);
}


function muestraCarrito() {
    DOMbotonCarrito.addEventListener("click", () => {
        Swal.fire({

            //html: `<ul class="list-group">${DOMcarrito.innerHTML}</ul>`,
            html: `            <h2>Tu Carrito</h2>
            <!-- Elementos del carrito -->
            <ul id="carrito" class="list-group"></ul>
            <hr>
            <!-- Precio total -->
            <p class="text-right">Total: $<span id="total"></span></p>
            <button id="btn-vaciar" class="btn btn-danger">Vaciar</button>`,
            showConfirmButton: false,
            showCancelButton: true,
            cancelButtonText: 'Cerrar',
            cancelButtonColor: '#d33',
            position: 'top-end',
            showClass: {
                popup: `
        animate__animated
        animate__fadeInRight
        animate__faster
    `
            },
            hideClass: {
                popup: `
        animate__animated
        animate__fadeOutRight
        animate__faster
    `
            },
            grow: 'column',
            width: 500,
            showConfirmButton: false,
            showCloseButton: true
        })
        renderizarCarrito()
        logicaCarro()
    });
}




function logicaCarro() {
    const DOMbotonVaciar = document.querySelector('#btn-vaciar');

    DOMbotonVaciar.addEventListener("click", () => {
        Swal.fire({
            title: "¿Estás seguro que querés vaciar tu carrito?",
            showDenyButton: true,
            confirmButtonText: 'Sí, estoy seguro',
            denyButtonText: `Cancelar`,
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                vaciarCarrito();
            } else if (result.isDenied) {
                Swal.fire({})
            }
        })
    });
}

function vaciarCarrito() {
    carrito = [];
    renderizarCarrito();
    localStorage.clear();
    const DOMCartItems = document.querySelector('.cart-items')
    DOMCartItems.textContent = carrito.length
}

function guardarCarritoEnLocalStorage() {
    storage.setItem('carrito', JSON.stringify(carrito));
}

function cargarCarritoDeLocalStorage() {
    if (storage.getItem('carrito') !== null) {
        carrito = JSON.parse(storage.getItem('carrito'));
    }
}

// Inicio del programa
main();