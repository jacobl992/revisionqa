const express = require('express')
const {MongoClient, ObjectId} = require('mongodb')

const app = express()
const port = 3000
app.use(express.json())

//db connection
async function connectToMongo() {
    const connection = await MongoClient.connect("mongodb://root:password@localhost:27017")
    return connection.db('revision')
}

// app.get('/', async (request, response) => {
//         const db = await connectToMongo()
//         const products = db.collection('questions_and_answers')
//         const result = await products.insertOne({type: "answer", body: "RMBD have relationships between tables, have null fields and defined table structures, DODBs do not need any of these, it is highly flexible and useful for rapid development and prototyping.", qacode: 2})
//         if (result.insertedID !== null) {
//             response.send('it worked')
//         } else {
//             response.send('it broke')
//         }
//     }
// )

//serve static
app.use(express.static('public'));



//routes
    //home page:
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
});

    //backend api
app.get('/qa', async (request, response) => {

    const qaParams = request.query

    function filterProducts(qaParams) {
        const filter = {};

        if (qaParams && qaParams.qacode) {
            filter.qacode = parseInt(qaParams.qacode);
        }
        return filter;
    }

    try {
        const db = await connectToMongo()
        const qas = db.collection('questions_and_answers')
        const result = await qas.find(filterProducts(qaParams)).toArray()
        if (result.length > 0) {
            response.json({
                message: "Successfully retrieved question and answer",
                data: result
            });
            response.status(200);
        } else {
            response.send({
                message: "Unexpected error",
                data: []
            })
        }
    } catch {
        response.status(500).send('Unexpected error');
    }
})

app.listen(port);
