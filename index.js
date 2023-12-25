const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;
const {
    MongoClient,
    ServerApiVersion,
    ObjectId
} = require('mongodb');




// middleware
app.use(cors());
app.use(express.json());




// database connection and functionalties
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xmzsaoq.mongodb.net/?retryWrites=true&w=majority`;





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
        // Establish and verify connection

        //   const userCollection = client.db("realestateDB").collection("properties");
        const userCollection = client.db("taskflow").collection("users"); // working
        const taskCollection = client.db("taskflow").collection("tasks");


        // all post request
        // 1. users collection
        app.post('/users', async (req, res) => {
            const newUser = req.body;
            const result = await userCollection.insertOne(newUser);
            res.json(result);
        });

        // 2. tasks collection
        app.post('/tasks', async (req, res) => {
            const newTask = req.body;
            const result = await taskCollection.insertOne(newTask);
            res.json(result);
        });

        // all get request
        // 1. users collection
        app.get('/users', async (req, res) => {
            const cursor = userCollection.find({});
            const users = await cursor.toArray();
            res.send(users);
        });

        // 2. tasks collection
        app.get('/tasks', async (req, res) => {
            const email = req.query.email;
            const query = {
                useremail: email
            };
            console.log(email)
            const cursor = taskCollection.find(query);
            const tasks = await cursor.toArray();
            res.send(tasks);
        });


        // 3. users collection by id
        app.get('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = {
                _id: ObjectId(id)
            };
            const user = await userCollection.findOne(query);
            res.json(user);
        });

        // 4. tasks collection by id
        app.get('/tasks/:id', async (req, res) => {
            const id = req.params.id;
            const query = {
                _id: new ObjectId(id)
            };
            const task = await taskCollection.findOne(query);
            res.json(task);
        });

        // all delete request
        // 1. users collection by id
        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = {
                _id: new ObjectId(id)
            };
            const result = await userCollection.deleteOne(query);
            res.json(result);
        });

        // 2. tasks collection by id
        app.delete('/tasks/:id', async (req, res) => {
            const id = req.params.id;
            const query = {
                _id: new ObjectId(id)
            };
            const result = await taskCollection.deleteOne(query);
            res.json(result);
        });

        // all update request
        // 1. update request to start a task
        app.put('/tasks/:id/start', async (req, res) => {
            const id = req.params.id;
            const {
                status
            } = req.body;
            const filter = {
                _id: new ObjectId(id)
            };
            const updateDoc = {
                $set: {
                    status: status,
                },
            };
            const result = await taskCollection.updateOne(filter, updateDoc);
            res.json(result);
        });

        // 2. update request to complete a task
        app.put('/tasks/:id/complete', async (req, res) => {
            const id = req.params.id;
            const {
                status
            } = req.body;
            const filter = {
                _id: new ObjectId(id)
            };
            const updateDoc = {
                $set: {
                    status: status,
                },
            };
            const result = await taskCollection.updateOne(filter, updateDoc);
            res.json(result);
        });

        // 3. update task by id
        app.put('/tasks/:id', async (req, res) => {
            const id = req.params.id;
            const {
                positiontitle,
                recemail,
                cname,
                cabout,
                salary,
                streetaddress,
                region,
                postalcode,
                titletask, 
                taskpriority,
                taskdescription,
                status,
                // imageUrl,
                date,
            } = req.body;
        
            const filter = { _id: new ObjectId(id) };
            const updateDoc = {
                $set: {
                    positiontitle,
                    recemail,
                    cname,
                    cabout,
                    salary,
                    streetaddress,
                    region,
                    postalcode,
                    titletask, 
                    taskpriority,
                    taskdescription,
                    status,
                    // imageUrl,
                    date: new Date(date), // Converting to Date object
                },
            };
        
            try {
                const result = await taskCollection.updateOne(filter, updateDoc);
                if (result.modifiedCount === 0) {
                    return res.status(404).json({ message: "No task found with the given ID." });
                }
                res.json({ message: "Task updated successfully.", result });
            } catch (error) {
                console.error(error);
                res.status(500).json({ message: "An error occurred while updating the task." });
            }
        });
        

        // Send a ping to confirm a successful connection
        await client.db("admin").command({
            ping: 1
        });

        console.log("Pinged your deployment. You successfully connected to MongoDB!");

    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }

}

run().catch(console.dir);










// route

app.get('/', (req, res) => {
    res.send('Taskflow`s server is running');
});




// listen

app.listen(port, () => {
    console.log(`Taskflow's server is running on port: ${port}`);
});