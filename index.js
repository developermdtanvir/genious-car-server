const express = require('express');
const cors = require('cors');
const { MongoClient } = require("mongodb");
const jwt = require('jsonwebtoken');
const ObjectId = require('mongodb').ObjectId
const port = process.env.port || 5000
require('dotenv').config();




// const payload = {
//     name:'Tanvir',
//     email:'officialtanvir@gmail.com'

// }
// const secret = 'mysecretkey'
// const token = jwt(payload,secret)


// MiddleWare 
const app = express()
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.338egrb.mongodb.net/?retryWrites=true&w=majority`
const client = new MongoClient(uri);
const car_collection = client.db('car_service').collection('service');
const car_order = client.db('car_service').collection('order');
const login_user_collection = client.db('user_login').collection('login')
const product_collection = client.db('product').collection('item')

app.get('/', (req, res) => {
    res.send('My car service server is Ready')
})

function varifyJWT(req, res, next) {
    const authorize = req.headers.autorizetion;
    if (!authorize) {
        res.status(401).send({ messege: 'unauthorize access' })
    }
    const token = authorize.split(' ')[1]
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, decoded) => {
        if (error) {
            res.status(401).send({ messege: 'unauthorize access' })
        }
        req.decoded = decoded
        next()
    })
    console.log(authorize);

}
async function run() {
    try {
        app.post('/service', async (req, res) => {
            const product = req.body;
            const result = await car_collection.insertOne(product);
            res.send(result);
        })

        app.post('/jwt', (req, res) => {
            const user = req.body;
            const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '2 days' })
            res.send({ token });
        })


        // get mehtod : 
        app.get('/service', async (req, res) => {
            const query = {};
            const cursor = car_collection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        })
        app.get('/service/:id', async (req, res) => {
            const { id } = req.params;
            const query = { _id: ObjectId(id) }
            const result = await car_collection.findOne(query)
            res.send(result);
        })

        // put method 
        // get order method :
        app.get('/order', varifyJWT, async (req, res) => {
            console.log(req.headers.autorizetion)
            let query = {};
            if (req.query.email) {
                query = {
                    email: req.query.email
                }
            }
            const cursor = car_order.find(query);
            const result = await cursor.toArray()
            res.send(result);
        })


        // DLETE Single item : - 
        app.delete('/product/:id', async (req, res) => {
            const { id } = req.params;
            const query = { _id: ObjectId(id) }
            const result = await car_collection.deleteOne(query)
            res.send(result);

        })




        // Order post method heare :- 
        app.post('/order', async (req, res) => {
            const orders = req.body;
            const result = await car_order.insertOne(orders);
            res.send(result);
        })

        // delete method :
        app.delete('/order/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await car_order.deleteOne(query);
            res.send(result);
        })

        app.patch('/order/:id', async (req, res) => {
            const id = req.params.id;
            const status = req.body.status;
            const query = { _id: ObjectId(id) };
            const updateDoc = {
                $set: {
                    status: status
                }
            }
            const result = await car_order.updateOne(query, updateDoc);
            res.send(result);
        })
    } finally {

    }
}



run().catch(console.dir);




app.listen(port, () => console.log(`User Listen this port ${port}`))