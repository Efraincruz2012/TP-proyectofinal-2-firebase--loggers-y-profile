const { Router } = require('express');
const ControladorCarrito = require('../../Daos/ControladorDaoCarrito');
const ControladorProducto = require('../../Daos/ControladorDaoProducto');

const routerCarrito = Router();

const carritoController = new ControladorCarrito();

const Contcar = require("../../Daos/contcar.js")

const car = new Contcar('./db/carts.txt')


///////////////////////////////firebase /////////////////////////////
/* 
const admin = require("firebase-admin");
const serviceAccount = require("C:/Curso Desarrolador BAckend/TP/db/misgrullas.json")
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const db =admin.firestore();
const car = new Contcar(db)
 */
//////////////////////////// GET/POST/DELETE/////////////////////////


routerCarrito.get('/', async (req, res) => {
    req.loggerBase(req);
    const carritos = await carritoController.listarAll();
    res.send(carritos);
    
})

routerCarrito.post('/', async (req, res) => {
    req.loggerBase(req);
    await carritoController.create();
    return res.status(204).json();

})

routerCarrito.post('/product', async (req, res) => {
    req.loggerBase(req);
    await carritoController.addProductToCar(req.body.id_producto, req.body.id_carrito);
    res.redirect('/');

})

 
routerCarrito.post('/', async (req, res) => {
    req.loggerBase(req);
    const CAR = await car.listarAll()

    const  Unew = req.body
   
    console.log(Unew)
    CAR.push(Unew)         // enpuja a la ultima posicion del array , el contenido del body, que pasa a la palabra.
    car.guardar(Unew)

    res.send({ agregada: Unew, posicion: CAR.length - 1 })
})


routerCarrito.delete('/:id',async (req, res) => {
    req.loggerBase(req);
    const CAR = await car.listarAll()
    const { id } = req.params
   
    const newCar = CAR.find(e => e.id == id);
    car.borrar(id);
    res.send({ borrada: newCar })
})



routerCarrito.get('/:id/productos', async (req, res) => {
    req.loggerBase(req);
    const CAR = await car.listarAll()
    const { id } = req.params

    const PRODUCTOS=CAR.find(e => e.id == id).payload.items;
    res.send ( PRODUCTOS);

    
})


routerCarrito.post('/:id/productos', async (req, res) => {
    req.loggerBase(req);
    const CAR = await car.listarAll()

    const  proIng =req.body  
    const { id } = req.params;
    let CarB=CAR.find(e => e.id == id);
    let PRODUCTOS=CarB.payload.items;
    PRODUCTOS.push(proIng)
    CarB.payload.items=PRODUCTOS;
    car.actualizar(CarB)
    res.send ( CarB);

    
})

routerCarrito.delete('/:id/productos/:id_prod', async (req, res) => {
    req.loggerBase(req);
    const CAR = await car.listarAll()

    const  proIng =req.body  
    const { id ,id_prod} = req.params;
     
    let CarB=CAR.find(e => e.id == id);
    
    let PRODUCTOS=CarB.payload.items;
    PRODUCTOS=PRODUCTOS.filter( e => e.productId != id_prod)
    CarB.payload.items=PRODUCTOS;
    car.actualizar(CarB)
    res.send ( CarB);

 
})


routerCarrito.use(function(req, res) {
    // Invalid request
    const { originalUrl, method } = req
    req.loggerWarning(`Ruta ${method} ${originalUrl} no implementada`);
});


exports.routerCarrito = routerCarrito; 