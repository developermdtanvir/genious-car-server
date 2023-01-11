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

app.get('/', (req, res) => {
    res.send('My car service server is Ready')
})
async function run() {
    try {
        app.get('/service', async (req, res) => {
            const query = {};
            const cursor = car_collection.find(query)
            const result = await cursor.toArray()
            res.send(result);
        })

        app.get('/service/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await car_collection.findOne(query);
            res.send(result);
        })

        // login user post heare : 
        app.post('/login', async (req, res) => {
            const login = req.body;
            const result = await login_user_collection.insertOne(login);
            res.send(result);
        })

    } finally {

    }
}



run().catch(console.dir);




app.listen(port, () => console.log(`User Listen this port ${port}`))