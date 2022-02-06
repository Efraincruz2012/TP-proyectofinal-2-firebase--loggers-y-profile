///////////conexxion a firebase//////////////////

const { db } = require('../config/firebase_config.js');

const productoRef = db.collection("producto");
 
class firebaseDb {

    constructor(db) {
        this.db = db;
    }
//////////////////////////////////////Read All/////////////////////////////////////////////////////////
    async listarAll() {
        
        productoRef.get().then((querysnapshot)=>{

            querysnapshot.forEach(document => {
                
                console.log("estos son todos los documentos",document.data());
                const elems = document.data()
                console.log('colleccion parceda',elems)
                return JSON.parse(elems)
            
            }); 
        }) 
    }
////////////////////////////////////////////CREAR///////////////////////////////////////////////////    
    async create()
    {
        const producto1 = {
            id:5,
            name :"PAPAYA",
            thumbnail: 'https://cdn3.iconfinder.com/data/icons/education-209/64/ruler-triangle-stationary-school-256.png',
        };

        // const producto2 = {
        //     id:3,
        //     name :"Arnadanos",
        //     thumbnail: 'https://cdn3.iconfinder.com/data/icons/education-209/64/ruler-triangle-stationary-school-256.png',
        // }

        db.batch();
        await db.collection("producto").doc(producto1.id.toString()).set(producto1);

    }
////////////////////////////////////UPDATE/////////////////////////////////////////////////        
        async update()
        { 
            try{
                const id = 20
                const doc= productoRef.doc(`${id}`)
                const item= await doc.update({name: 'NARANJA'})
                console.log(' Producto actulizado', id)
               } catch (error){console.log(error)}
            }

//////////////////////////////DELETE///////////////////////////////////////////////////////
        async delete()
        {
            try{
                const id =12
                const doc= productoRef.doc(`${id}`)
                const item= await doc.delete()
                console.log(" Producto Borrado es :",id)
               } catch (error){console.log(error)}
            
        }
//////////////////////////////Read ID///////////////////////////////////////////////////////

        async id()
        {
            try{
                const id = 1
                const doc = productoRef.doc(`${id}`)
                const item = await doc.get()
                const response = item.data()
                console.log(" Producto elegido es : ",id )
            } catch (error){console.log(error)}
            
        }
        
}


///////////////////////////////////
const con = new firebaseDb()
// con.listarAll() 
// con.create()
// con.update()
// con.delete()
// con.id()
///////////////////////////////
module.exports = firebaseDb;