let products = [];
let cart = [];
const presetProducts = document.getElementById("presetsCards");
let carritoCompra = document.getElementById("cart");

const getProducts = async () => {
    const res = await fetch('./js/products.json');
    products = await res.json() 
    imprimirProductos(products);
}

const imprimirProductos = () => {
    products.forEach(
        (product, index) => {
            let card = document.createElement("div");
            card.classList.add("col-md-4", "col-sm-6", "p-3", "image");
    
            card.innerHTML = `
                                <div class="card text-light mb-1 image__zoom">
                                    <a><img src="${product.image}" alt="${product.name}" class="img-fluid"></a>
                                        <div class="card-body">
                                            <div class="h1 mb-3"></a>
    
                                                <p class="lead my-1">
                                                    <a class="text-decoration-none">
                                                        <h2 class="lead my-1">${product.name}</h2>
                                                        <h2 class="lead my-1">$${product.price}</h2>
                                                        <h3 class="lead my-1">${product.cuotas}</h3>
                                                        <span>
                                                            <div class="p-2"> <button class="int__button" style="line-height: 0.3rem;" onClick="agregarAlCarrito(${index})">COMPRAR</button></div>
                                                        </span>
                                                    </a>
                                                </p>
                                            </div>
                                        </div>
                                </div>
                            `;
    
        presetProducts.appendChild(card);
        }
    );
}

const agregarAlCarrito = (index) => {   
    const indiceProducto = cart.findIndex(({id}) => {
        return id === products[index].id
    });

    if (indiceProducto > -1) {
        cart[indiceProducto].cantidad += 1
        actualizarStorage(cart);
        imprimirCarrito();
        badgeCarrito();
        floatBtn();
    } else {
        const agregarProducto = products[index];
        agregarProducto.cantidad = 1;
        cart.push(agregarProducto);
        actualizarStorage(cart);
        imprimirCarrito();
        badgeCarrito();
        floatBtn();
    };

    Toastify({
        text: `${products[index].name} ha sido añadido al carrito.`,
        duration: 3000,
        destination: "https://github.com/apvarun/toastify-js",
        newWindow: true,
        close: true,
        gravity: "bottom",
        position: "right", 
        stopOnFocus: true, 
        style: {
          background: "black",
        },
      }).showToast()
};

const imprimirCarrito = () => {
    let total = 0;
    carritoCompra.innerHTML = "";
    cart = localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")) : [];

    const footer = document.getElementById("footer-modal");
    const footerContent =  `<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Seguir comprando</button>`;
    const footerContentLeft = cart.length ?  `<button type="button" class="btn btn-secondary" onClick="finalizarCompra()">Finalizar compra</button>` : '';
    

    if (cart.length > 0) {
        cart.forEach((product, index) => {
            total = total + product.price * product.cantidad;
            const listaCarrito = document.createElement("div");
            listaCarrito.className = "text-center";
            listaCarrito.innerHTML = 
            `<div class="row">
                <table>
                    <td>
                        <div class=" d-flex align-items-center">
                            <div class="px-3 pb-3"><a><img src="${product.image}" alt="${product.name}" width="48"></a></div>
                            <div class="d-sm-flex"></div>
                            <div class="align-middle px-sm-5"><h2 class="lead my-1">${product.name}</h2></div>
                            <div class="align-middle">Cant. ${product.cantidad}</div>
                        </div>
                    </td>
                    <td>
                        <div class="d-flex align-items-center">
                            <div class="px-4"><h2 class="lead my-1">$${product.price}</h2></div>
                            <div class="">
                                <span>
                                    <div class="p-2"> <a onClick="removeProduct(${index})"><i class="bi bi-trash-fill"></i></a></div>
                                </span>
                            </div>
                        </div>
                    </td>
                </table>
            </div>`

            carritoCompra.appendChild(listaCarrito);
        });
    
        const imprimirTotal = document.createElement("div");
        imprimirTotal.innerHTML = 
        `<div class="p-5"> TOTAL $${total.toFixed(2)}</div>`;

        carritoCompra.appendChild(imprimirTotal);
    } else {
        carritoCompra.classList.remove("cart")
        carritoCompra.innerHTML =
        `<div class="alert alert-light" role="alert">
        El carrito está vacío
        </div>`;
    }

    footer.innerHTML = `${footerContentLeft} ${footerContent}`;
};

const removeProduct = (index) => {
    cart.splice (index, 1);
    actualizarStorage(cart);
    imprimirCarrito();
    badgeCarrito();
    floatBtn();
}

const finalizarCompra = () => {
    carritoCompra.innerHTML = "";
    const compraFinalizada = 
    `<p class="px-4">¡Tus productos fueron procesados! Completa tus datos para el envío en el siguiente formulario.</p>
    <div class="px-4"> 
        <button class="submit int__button" style="line-height: 0.9rem;" onClick="imprimirFormulario()">Formulario</button>
    </div>`;

    carritoCompra.innerHTML = compraFinalizada;
}



const imprimirFormulario = () => {
    carritoCompra.innerHTML = "";
    const formulario = 
    `<div class="text-center my-5">
        <h1 class="px-4">Completa tus datos para el envío</h1>
        <h3 class="lead my-md-4 text-center">
            Los productos te serán enviados por mail en un lapso de 24 horas hábiles.
        </h3>

        <form action="" id="form">
            <div class="justify-content-start text-start height padding__top">
                <div class="card py-3">
                    <div class="p-3 px-4 py-2">
                        <span class="font-weight-normal quote">Nombre</span>
                        <input type="text" id="nombreCliente" class="form-control mb-2" placeholder="Tu nombre" required/> 
                        <span class="font-weight-normal quote">Mail</span> 
                        <input type="email" class="form-control mb-2" placeholder="nombre@dominio.com" required/>
                    </div>
                    <div class="px-4"> 
                        <button class="submit int__button" style="line-height: 0.9rem;" onClick="mensajeFinal()">Enviar</button>
                    </div>
                </div>
            </div>
        </form>
    </div>`;

    removeCartLS();
    carritoCompra.innerHTML = formulario;
}


const mensajeFinal = () => {
    carritoCompra.innerHTML = ""
    let mensaje = `<p>¡Gracias por tu compra! Pronto recibirás tus productos.</p>`;

    carritoCompra.innerHTML = mensaje;
    const footer = document.getElementById("footer-modal");
    footer.innerHTML = "";
    const footerContent = `<button type="button" class="btn btn-secondary" data-bs-dismiss="modal" onClick="imprimirCarrito(); badgeCarrito(); floatBtn();">Salir</button>`;
    footer.innerHTML = footerContent
}

const actualizarStorage = (cart) => {
    localStorage.setItem("cart", JSON.stringify(cart));
}

const calcularCantProductos = () => {
    return cart.reduce((total, elemento) => total + elemento.cantidad, 0);
}

const badgeCarrito = () => {
    const iconoCarrito = document.getElementById("iconoCarrito");
    const badge  = 
    `<button type="button" class="btn btn-primary position-relative" data-bs-toggle="modal" data-bs-target="#staticBackdrop">                      
        <a class="text-decoration-none" target="_blank">
            <i class="bi bi-cart-fill fs-6"></i>
        </a> 
        <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger zIndex">
            ${calcularCantProductos()}
            <span class="visually-hidden">unread messages</span>
        </span>
    </button>`;

    iconoCarrito.innerHTML = badge
};

const floatBtn = () => {
    const floatButton = document.getElementById("floatButton");
    const notificacion = `<button type="button" class="btn btn-primary position-relative" data-bs-toggle="modal" data-bs-target="#staticBackdrop">                      
    <a class="text-decoration-none" target="_blank">
        <i class=" py-2 bi bi-cart-fill fs-3 float my-float iconSize"></i>
    </a> 
    <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger zIndex">
        ${calcularCantProductos()}
        <span class="visually-hidden">unread messages</span>
    </span>
    </button>`;

    floatButton.innerHTML = notificacion
};

removeCartLS = () => {
    localStorage.removeItem("cart");
};

getProducts()
imprimirCarrito(); 
floatBtn();
badgeCarrito();
