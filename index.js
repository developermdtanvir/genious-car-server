const express = require('express');
const cors = require('cors');
const { MongoClient } = require("mongodb");
const ObjectId = require('mongodb').ObjectId
const port = process.env.port || 5000


const uri = `mongodb+srv://admin1:KcpagiArOAa8SKBR@cluster0.338egrb.mongodb.net/?retryWrites=true&w=majority`

console.log(process.env.DB_PASSWORD);
const app = express()
app.use(cors());
app.use(express.json());

const client = new MongoClient(uri);
const car_collection = client.db('car_service').collection('service');
const login_user_collection = client.db('user_login').collection('login')
const product_collection = client.db('product').collection('item')

app.get('/', (req, res) => {
    res.send('My car service server is Ready')
})
async function run() {
    try {
        app.post('/product', async (req, res) => {
            const product = req.body;
            const result = await product_collection.insertOne(product);
            res.send(result);
            console.log(result.insertedId);
        })


        // get mehtod : 
        app.get('/product', async (req, res) => {
            const query = {};
            const cursor = product_collection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        })

    } finally {

    }
}



run().catch(console.dir);




app.listen(port, () => console.log(`User Listen this port ${port}`))