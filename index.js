const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app =express();
const port = process.env.PORT || 5000 ;

app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.y5comcm.mongodb.net/?retryWrites=true&w=majority`;



// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const database = client.db("ProductsDb");
    const productCollection = database.collection("products");
    const userCollection = database.collection("user");
    const cartCollection = database.collection("cart");


    // ------products api-------

    app.get('/products', async(req , res) => {
        const cursor = productCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    })

    app.get('/products/:brand', async(req , res) => {
        const brand = req.params.brand;   
        const cursor = productCollection.find({ brand });
        const result = await cursor.toArray();
        res.send(result);
    })


    app.get('/products/:brand/:id' , async(req , res) => {
        const brand = req.params.brand;
        const id =req.params.id;
        const query = {_id : new ObjectId(id)};
        const result = await productCollection.findOne(query);
        res.send(result);
    })

    app.post('/products', async(req , res) =>{
        const id =req.params.id;
        const product = req.body;
        const result = await productCollection.insertOne(product);
        res.send(result);
    })


    app.put('/products/:brand/:id', async(req ,res) => {
        const id =req.params.id;
        const product = req.body;
        const filter = {_id : new ObjectId(id)};
        const options = {upsert : true};
        const updateProduct = { $set : {
            name : product.name,
            photo : product.photo,
            price : product.price,
            type : product.type,
            brand : product.brand,          
            rating : product.rating,
            description : product.description
        }}
        const result = await productCollection.updateOne(filter , updateProduct , options);
        res.send(result);
    })

// user api.........................................user

app.get('/users', async(req , res) => {
  const cursor = userCollection.find();
  const result = await cursor.toArray();
  res.send(result);
})


app.post('/users', async(req , res) =>{
  const id =req.params.id;
  const user = req.body;
  const result = await userCollection.insertOne(user);
  res.send(result);
})


// ----------------------cart api-------------

app.get('/cart', async(req , res) => {
  const cursor = cartCollection.find();
  const result = await cursor.toArray();
  res.send(result);
})

app.post('/cart', async(req , res) =>{
  const id =req.params.id;
  const cartProduct = req.body;
  const result = await cartCollection.insertOne(cartProduct);
  res.send(result);
})

app.delete('/cart/:id' , async(req , res) => {
  const id = req.params.id;
  const query = {_id : new ObjectId(id)};
  const result =await cartCollection.deleteOne(query);
  res.send(result);
})



    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);








// app.get('/' , (req , res) =>{
//     res.send('abcd running');
// })

app.listen(port , () => {
    console.log(`server running on port : ${port}`);
})