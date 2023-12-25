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
            const cursor = taskCollection.find({});
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
                _id: ObjectId(id)
            };
            const task = await taskCollection.findOne(query);
            res.json(task);
        });

        // all delete request
        // 1. users collection by id
        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = {
                _id: ObjectId(id)
            };
            const result = await userCollection.deleteOne(query);
            res.json(result);
        });

        // 2. tasks collection by id
        app.delete('/tasks/:id', async (req, res) => {
            const id = req.params.id;
            const query = {
                _id: ObjectId(id)
            };
            const result = await taskCollection.deleteOne(query);
            res.json(result);
        });


        // // all put request
        // // 1. users collection by id
        // app.put('/users/:id', async (req, res) => {
        //     const id = req.params.id;
        //     const updatedUser = req.body;
        //     const filter = {
        //         _id: ObjectId(id)
        //     };
        //     const options = {
        //         upsert: true
        //     };
        //     const updateDoc = {
        //         $set: {
        //             name: updatedUser.name,
        //             email: updatedUser.email,
        //             password: updatedUser.password,
        //             role: updatedUser.role,
        //             tasks: updatedUser.tasks
        //         },
        //     };
        //     const result = await userCollection.updateOne(filter, updateDoc, options);
        //     res.json(result);
        // });

        // // 2. tasks collection by id
        // app.put('/tasks/:id', async (req, res) => {
        //     const id = req.params.id;
        //     const updatedTask = req.body;
        //     const filter = {
        //         _id: ObjectId(id)
        //     };
        //     const options = {
        //         upsert: true
        //     };
        //     const updateDoc = {
        //         $set: {
        //             title: updatedTask.title,
        //             description: updatedTask.description,
        //             status: updatedTask.status,
        //             assignedTo: updatedTask.assignedTo,
        //             createdBy: updatedTask.createdBy,
        //             createdAt: updatedTask.createdAt,
        //             updatedAt: updatedTask.updatedAt
        //         },
        //     };
        //     const result = await taskCollection.updateOne(filter, updateDoc, options);
        //     res.json(result);
        // });

        // // 3. tasks collection by id and status
        // app.put('/tasks/:id/:status', async (req, res) => {
        //     const id = req.params.id;
        //     const status = req.params.status;
        //     const filter = {
        //         _id: ObjectId(id)
        //     };
        //     const options = {
        //         upsert: true
        //     };
        //     const updateDoc = {
        //         $set: {
        //             status: status
        //         },
        //     };
        //     const result = await taskCollection.updateOne(filter, updateDoc, options);
        //     res.json(result);
        // });

        // // 4. users collection by id and tasks
        // app.put('/users/:id/:tasks', async (req, res) => {
        //     const id = req.params.id;
        //     const tasks = req.params.tasks;
        //     const filter = {
        //         _id: ObjectId(id)
        //     };
        //     const options = {
        //         upsert: true
        //     };
        //     const updateDoc = {
        //         $set: {
        //             tasks: tasks
        //         },
        //     };
        //     const result = await userCollection.updateOne(filter, updateDoc, options);
        //     res.json(result);
        // });


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