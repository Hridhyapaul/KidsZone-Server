const express = require('express')
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gfisnkk.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri)
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
        // await client.connect();

        const toysCollection = client.db("actionToys").collection("products");
        const galleryCollection = client.db("toyGallery").collection("items");

        // Gallery images
        app.get('/images', async (req, res) => {
            const result = await galleryCollection.find().toArray();
            res.send(result);
        })

        // Toy section
        app.get('/products', async (req, res) => {
            const result = await toysCollection.find().toArray();
            res.send(result);
        })

        app.get('/products/:text', async (req, res) => {
            console.log(req.params.text);
            const options = {
                // Include only the `title` and `imdb` fields in each returned document
                projection: { image: 1, name: 1, price: 1, rating: 1 },
            };
            if (req.params.text == "Marvel" || req.params.text == "Avengers" || req.params.text == "Starwars") {
                const result = await toysCollection.find({ subCategory: req.params.text }, options).toArray();
                return res.send(result)
            }
            const result = await toysCollection.find().toArray();
            res.send(result)
        })

        // app.get('/product/:id', async (req, res) => {
        //     const id = req.params.id;
        //     const query = { _id: new ObjectId(id) }
        //     const result = await toysCollection.findOne(query)
        //     res.send(result)
        // })

        // app.post('/products', async (req, res) => {
        //     const newToy = req.body;
        //     console.log(newToy)
        //     const result = await toysCollection.insertOne(newToy);
        //     res.send(result);
        // })

        // app.get('/myToys/:email', async(req, res) => {
        //     const result = await toysCollection.find({sellerEmail: req.params.email}).toArray();
        //     res.send(result)
        // })

        // app.get('/allToys', async(req, res) => {
        //     const result = await toysCollection.find().toArray();
        //     res.send(result);
        // })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('KidsZone server is running')
})

app.listen(port, () => {
    console.log(`KidsZone server is running on port ${port}`)
})