const cards = document.getElementById('cards')
const items = document.getElementById('items')
const footer = document.getElementById('footer')
// content es para acceder a los documentos.
const templateCard = document.getElementById('template-card').content
const templateFooter = document.getElementById('template-footer').content
const templateCarrito = document.getElementById('template-carrito').content
const fragment = document.createDocumentFragment()
let carrito = {}



// Capturar datos con el DOM 
document.addEventListener('DOMContentLoaded', () => {
    fetchData()
    if(localStorage.getItem('carrito')) {
        carrito = JSON.parse(localStorage.getItem('carrito'))
        pintarCarrito()
    }
})

cards.addEventListener('click', e => {
    addCarrito(e)
})  


items.addEventListener('click', e => {
    btnAccion(e)
})


const fetchData = async() =>{
    try{
     const res = await fetch('/eventos/data.json')
     const data = await res.json()
    //  console.log(data)
     pintarCards(data)
    } catch(error){
        console.log(error)
    }
}


const pintarCards = data =>{
data.forEach(producto =>{
    // console.log(producto) para chequear que este bien.
    templateCard.querySelector('h5').textContent = producto.nombre
    templateCard.querySelector('p').textContent = producto.precio
    templateCard.querySelector('img').setAttribute("src", producto.imagen)
    templateCard.querySelector('.btn').dataset.id = producto.id

    const clone = templateCard.cloneNode(true)
    fragment.appendChild(clone)
})
    cards.appendChild(fragment)

}

const addCarrito = e => {
    // console.log(e.target)
    // console.log(e.target.classList.contains('btn'))
    if(e.target.classList.contains('btn')){
        setCarrito(e.target.parentElement)
    }
    e.stopPropagation()
}

const setCarrito = objeto => {
// console.log(objeto)
const producto = {
    id:objeto.querySelector('.btn').dataset.id,
    nombre: objeto.querySelector('h5').textContent,
    precio: objeto.querySelector('p').textContent,
    cantidad: 1
}

if(carrito.hasOwnProperty(producto.id)){
    producto.cantidad = carrito[producto.id].cantidad + 1
}

carrito[producto.id] = {...producto}
pintarCarrito()
}

const pintarCarrito = () => {
    // console.log(carrito)
    items.innerHTML = ''
Object.values(carrito).forEach(producto => {
templateCarrito.querySelector('th').textContent = producto.id
templateCarrito.querySelectorAll('td')[0].textContent = producto.nombre
templateCarrito.querySelectorAll('td')[1].textContent = producto.cantidad
templateCarrito.querySelector('.btn-info').dataset.id = producto.id
templateCarrito.querySelector('.btn-danger').dataset.id = producto.id
templateCarrito.querySelector('span').textContent = producto.cantidad * producto.precio
const clone = templateCarrito.cloneNode(true)
fragment.appendChild(clone)
    })
items.appendChild(fragment)

pintarFooter()

localStorage.setItem('carrito', JSON.stringify(carrito))

}

const pintarFooter = () => {
footer.innerHTML = ''
if(Object.keys(carrito).length === 0) {

    footer.innerHTML = `<th scope="row" colspan="5">Carrito vacío - comience a comprar!</th>`

    // con el return hacemos que se salga de toda la funcion de abajo
    return
}

const nCantidad = Object.values(carrito).reduce((acceder, {cantidad}) => acceder + cantidad ,0 )

const nPrecio = Object.values(carrito).reduce((acceder, {cantidad, precio}) => acceder + cantidad * precio ,0 )
console.log(nPrecio)

templateFooter.querySelectorAll('td')[0].textContent = nCantidad
templateFooter.querySelector('span').textContent = nPrecio

const clone = templateFooter.cloneNode(true)
fragment.appendChild(clone)
footer.appendChild(fragment)


const btnVaciar = document.getElementById('vaciar-carrito')
btnVaciar.addEventListener('click', () => {

    carrito = {}
    pintarCarrito()
})
}


//  accion de aumentar aprentando el +
const btnAccion = e =>{
    // console.log(e.target)
    if(e.target.classList.contains('btn-info')){
    // console.log(carrito[e.target.dataset.id])
    // carrito[e.targe.dataset.id]  
    const producto = carrito[e.target.dataset.id]
    producto.cantidad++
    carrito[e.target.dataset.id] = {...producto}
    pintarCarrito()
}


if(e.target.classList.contains('btn-danger')){
    const producto = carrito[e.target.dataset.id]
    producto.cantidad--
    if(producto.cantidad === 0) {
        delete carrito[e.target.dataset.id]
    }
    pintarCarrito()
}


e.stopPropagation()
}