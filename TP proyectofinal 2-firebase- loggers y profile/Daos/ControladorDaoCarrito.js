const Carrito = require('../models/carritoModel.js');

class ControladorCarrito {

    constructor(ruta) {
        this.ruta = ruta
    }


    async listarAll() {

        const carritoModel = new Carrito();
        return await carritoModel.findAll();

    }

    async create() {

      const carritoModel = new Carrito();
      return await carritoModel.create();

    }

    async addProductToCar(productId, carritoId) {

        const carritoModel = new Carrito();
        return await carritoModel.addProduct({productId, carritoId});

    }

}

module.exports = ControladorCarrito