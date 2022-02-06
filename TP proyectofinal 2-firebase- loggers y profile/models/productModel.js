let mongoose;
let db;
let Schema;
let ProductSchema;
let ProductModel;

if (process.env.DB === 'mongodb') {
  const { mongooseLib } = require('../config/mongodb_config.js');
  mongoose = process.env.DB === 'mongodb' ? mongooseLib : {};
  Schema = mongoose.Schema;
  
  ProductSchema = new Schema({
      name: {type: String, required: true},
      thumbnail: String,
      price: String
  }, {collection: 'producto'});
  
  ProductModel = mongoose.model('ProductModel', ProductSchema);
} else {
  const { firebaseDb } = require('../config/firebase_config.js');
  db = firebaseDb;
}

class Product {

  constructor() {
    this.db = process.env.DB;
  }

  async find(id) {

    if(this.db === 'mongodb') {

      // mongoose
      return await ProductModel.findById(id);

    }

    // firebase
    const productRaw = await db.collection('producto').doc(id).get();
    return productRaw.data();

  }

  async findAll() {

    if(this.db === 'mongodb') {

      // mongoose
      return await ProductModel.find()
          .then((docs) => {
            return docs;
          });
    }

    // firebase
    const productosRaw = await db.collection('producto').get();
      const { docs } = productosRaw;
      const productos = docs.map(producto => ({
          id: producto.id,
          ...producto.data()
      }));
      return productos;
  }

  async create(data) {

    if(this.db === 'mongodb') {

      // mongoose
      const doc = new ProductModel({
          name: data.name,
          price: data.price,
          thumbnail: data.thumbnail
      });
      await doc.save();
      return doc;

    }

    // firebase
    return await db.collection("producto")
      .doc(`/${data.id}/`)
      .create({
          name: data.name,
          price: data.price,
          thumbnail: data.thumbnail
      });

  }

  async update(data) {

    if(this.db === 'mongodb') {

      // mongoose
      let updated = {};
      await ProductModel.findByIdAndUpdate(data.id, data).then(doc => updated = doc);
      return updated;

    }

    // firebase
    return await db.collection("producto")
      .doc(`/${data.id}/`)
      .update({
          name: data.name,
          price: data.price,
          thumbnail: data.thumbnail
      });
  }

};

module.exports = { ProductSchema, Product };