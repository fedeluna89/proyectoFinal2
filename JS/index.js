// Agregamos la base de datos de nuestros productos
const productosBD = [{
        id: 1,
        nombre: 'Camiseta Instituto',
        precio: 7000,
        imagen: '../imagenes/tienda/camisetaNegraInstituto.jpg'
    },
    {
        id: 2,
        nombre: 'atenas',
        precio: 6000,
        imagen: '../imagenes/tienda/camisetaAtenas2.jpg'
    },
    {
        id: 3,
        nombre: 'Camiseta Denver',
        precio: 176000,
        imagen: '../imagenes/tienda/denverCamisetaBlanca.jpg'
    },
    {
        id: 4,
        nombre: 'Campera Instituto',
        precio: 9700,
        imagen: '../imagenes/tienda/camperaInstituto.jpeg'
    }

];

// declaramos las variables
let carrito = [];
const divisa = '$';
const DOMitems = document.querySelector('#items');
const DOMcarrito = document.querySelector('#carrito');
const DOMtotal = document.querySelector('#total');
const DOMbotonVaciar = document.querySelector('#btn-vaciar');
const DOMbotonCarrito = document.querySelector('#btn-carrito');
const storage = window.localStorage;

// Funciones para renderizar el carrito
function main() {
    logicaCarro();
    cargarCarritoDeLocalStorage();
    renderizarProductos();
    renderizarCarrito();
    addItemCarrito();
    muestraCarrito();


}

function renderizarProductos() {
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

function addItemCarrito() {
    const DOMbtnadd = document.querySelector('.btn-add');
    DOMbtnadd.addEventListener("click", () => {
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
        })

        Toast.fire({
            icon: 'success',
            title: 'Producto agregado al carrito'
        })
    });
}


function addProductoCarrito(evento) {
    carrito.push(evento.target.getAttribute('marcador'))
    renderizarCarrito();
    guardarCarritoEnLocalStorage();
}

function renderizarCarrito() {
    DOMcarrito.textContent = '';
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
        position: 'top-end',
        icon: 'warning',
        title: 'Ha sido borrado correctamente',
        showConfirmButton: false,
        timer: 1500
    })
    const id = evento.target.dataset.item;
    carrito = carrito.filter((carritoId) => {
        return carritoId !== id;
    });
    renderizarCarrito(),
        guardarCarritoEnLocalStorage()
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
    });
}




function logicaCarro() {
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