const fs = require('fs');
const { Product } = require('../models/productModel.js');

class ControladorProducto {

    constructor(ruta) {
        this.ruta = ruta
        this.productModel = new Product();
    }

    async listar(id) {

        return await this.productModel.find(id);

    }

    async listarAll() {

        return await this.productModel.findAll();

    }

    async createProduct(data) {

        return await this.productModel.create(data);

    }

    async updateProduct(data) {

        return await this.productModel.update(data);

    }



    async guardar(elem) {
        const elems = await this.listarAll()

        let newId
        if (elems.length == 0) {
            newId = 1
        } else {
            newId = elems[ elems.length - 1 ].id + 1
        }

        const newElem = { ...elem, id: newId }
        elems.push(newElem)

        try {
            await fs.promises.writeFile(this.ruta, JSON.stringify(elems, null, 2))
            return newId
        } catch (error) {
            throw new Error(`Error al guardar: ${error}`)
        }
    }

    async actualizar(elem) {
        const elems = await this.listarAll()
        const index = elems.findIndex(e => e.id == elem.id)
        if (index == -1) {
            throw new Error(`Error al actualizar: no se encontró el id ${elem.id}`)
        } else {
            elems[ index ] = elem
            try {
                await fs.promises.writeFile(this.ruta, JSON.stringify(elems, null, 2))
            } catch (error) {
                throw new Error(`Error al borrar: ${error}`)
            }
        }
    }

    async borrar(id) {
        const elems = await this.listarAll()
        const index = elems.findIndex(e => e.id == id)
        if (index == -1) {
            throw new Error(`Error al borrar: no se encontró el id ${id}`)
        }

        elems.splice(index, 1)
        try {
            await fs.promises.writeFile(this.ruta, JSON.stringify(elems, null, 2))
        } catch (error) {
            throw new Error(`Error al borrar: ${error}`)
        }
    }

    async borrarAll() {
        try {
            await fs.promises.writeFile(this.ruta, JSON.stringify([], null, 2))
        } catch (error) {
            throw new Error(`Error al borrar todo: ${error}`)
        }
    }
}
///////////////////////////////////

///////////////////////////////
module.exports = ControladorProducto