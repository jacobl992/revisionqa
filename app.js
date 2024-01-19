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

//serve static
app.use(express.static('public'));

//routes
    //home page:
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
});

    //backend api
app.get('/qacodes', async (request, response) => {
    try {
        const db = await connectToMongo()
        const qas = db.collection('questions_and_answers')
        const result = await qas.find({}).project({qacode: 1, _id: 0}).toArray()
        if (result.length > 0) {
            response.json({
                message: "Successfully retrieved qacodes",
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

app.post('/addQA', async (request, response) => {
    try {
        const db = await connectToMongo()
        const qas = db.collection('questions_and_answers')
        //get request body
        const newQandA = request.body
        const result = await qas.insertOne(newQandA)
        if (result.insertedId !== null) {
            response.status(201).json({
                message: "Successfully added question and answer"
            });
        } else {
            response.status(400).send({
                message: "Invalid question and answer",
                data: []
            })
        }
    } catch {
        response.status(500).send({
            message: 'Unexpected error'
        });
    }
})

app.listen(port);
