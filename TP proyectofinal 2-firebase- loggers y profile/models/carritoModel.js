let mongoose;
let db;
let Schema;
let CarritoSchema;
let CarritoModel;

let { Product, ProductSchema } = require('../models/productModel.js');

if (process.env.DB === 'mongodb') {
  const { mongooseLib } = require('../config/mongodb_config.js');
  mongoose = process.env.DB === 'mongodb' ? mongooseLib : {};
  Schema = mongoose.Schema;
  
  CarritoSchema = new Schema({
      id: String,
      productos: [{type: ProductSchema}]
    }, {collection: 'carrito'});
  CarritoModel = mongoose.model('CarritoModel', CarritoSchema);
} else {
  const { firebaseDb, FieldValue } = require('../config/firebase_config.js');
  db = firebaseDb;
}


class Carrito {

  constructor() {
    this.db = process.env.DB;
    this.product = new Product();
  }

  async find(id) {

    if(this.db === 'mongodb') {

      // mongoose
      return await this.product.find(id);

    }

    // firebase
    const productRaw = await db.collection('producto').doc(id).get();
    return productRaw.data();

  }

  async findAll() {

    if(this.db === 'mongodb') {

      // mongoose
      return await CarritoModel.find()
          .then((docs) => {
            return docs;
          });
    }

    // firebase
    const carritosRaw = await db.collection('carrito').get();
      const { docs } = carritosRaw;
      const carritos = docs.map(carrito => ({
          id: carrito.id,
          ...carrito.data()
      }));
      return carritos;
  }

  async create() {

    if(this.db === 'mongodb') {

      // mongoose
      const doc = new CarritoModel();
      await doc.save();
      return doc;

    }

    // firebase
    return await db.collection("carrito").create({});

  }

  async addProduct(data) {

    // mongoose
    const producto = await this.product.find(data.productId);

    if (this.db === 'mongodb') {

      // Busco el carrito
      let doc = await CarritoModel.findById(data.carritoId);

      // le añado el producto y lo guardo
      doc.overwrite({ productos: [...doc.productos, producto], ...doc});
      await doc.save();

      return true;
    }

    //firebase
    const batch = db.batch();
    
    // actualizar lista de productos del carrito
    const carritoRef = await db.collection('carrito').doc(`/${data.carritoId}/`);
    batch.update(carritoRef, {productos: FieldValue.arrayUnion(producto)});

    // Ejecutar la operación
    await batch.commit();
    
    return true;

  }

};

module.exports = Carrito;