const express = require("express");
const app = express();
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pyhg6t2.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // await client.connect();

    const toDoCollection = client.db("TaskDB").collection("toDos");
    const previousCollection = client.db("TaskDB").collection("previous");



    // to do relater API
    app.get("/toDos", async (req, res) => {
      const email = req.query.email;
      let user;
      if (email) {
        user = { email: email };
      }
      const result = await toDoCollection.find(user).toArray();
      res.send(result);
    });

    app.post("/toDos", async (req, res) => {
      const data = req.body;
      const result = await toDoCollection.insertOne(data);
      res.send(result);
    });


    app.patch('/update/:id', async(req, res) => {
      const id = req.params.id;
      const data = req.query.status;
      const filter = {_id : new ObjectId(id)}
      const updatedDoc = {
        $set : {status : data}
      }
      const result = await toDoCollection.updateOne(filter, updatedDoc)
      res.send(result)
    })


    // On Going API
    app.get("/previous", async (req, res) => {
      const email = req.query.email;
      let user;
      if (email) {
        user = { email: email };
      }
      const result = await previousCollection.find(user).toArray();
      res.send(result);
    });

    app.post("/previous", async (req, res) => {
      const data = req.body;
      const result = await previousCollection.insertOne(data);
      res.send(result);
    });

    //Delete API
    app.delete("/deleteTask/:id", async(req, res) => {
      const id = req.params.id;
      const query = {_id : new ObjectId(id)}
      const result = await toDoCollection.deleteOne(query)
      res.send(result)
    })
    
    // Update Api
    app.put("/updateTask/:id", async (req, res) => {
      const data = req.body;
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)};
      const updatedDoc = {
        $set: {
          title: data.title,
          description: data.description,
          date: data.date,
          priority: data.priority
        },
      };
      const resultToDo = await toDoCollection.updateOne(filter, updatedDoc);
      res.send(resultToDo)
    })


    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log(
    //   "Pinged your deployment. You successfully connected to MongoDB!"
    // );
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Task is starting");
});

app.listen(port, () => {
  console.log(`task is running on port ${port}`);
});
