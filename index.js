const express = require('express')
const { MongoClient } = require('mongodb')
const cors = require('cors')
const ObjectId = require('mongodb').ObjectId

const app = express()
const PORT = 5000

app.use(cors())
app.use(express.json())

app.listen(PORT, () => console.log('Node Server is Running on PORT: ', PORT))

app.get('/', (req, res) => {
  res.send('Hello From Backend !!!')
})

const uri = 'mongodb+srv://mydb1:66445500@cluster0.2fudm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true })

async function run() {
  try {
    await client.connect()
    const db = client.db('personal')
    const collection = db.collection('users')

    // INFO: GET ALL USERS
    app.get('/users', async (req, res) => {
      const cursor = collection.find({})
      const users = await cursor.toArray()
      res.json(users)
    })

    // INFO: POST A USER
    app.post('/users', async (req, res) => {
      const { name, email, location, img } = req.body
      const newUserDoc = {
        name,
        email,
        location,
        img,
      }
      const result = await collection.insertOne(newUserDoc)
      res.json(result)
    })

    // INFO: DELETE A USER
    app.delete('/user/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: ObjectId(id) }
      const result = await collection.deleteOne(query)
      res.send(result)
    })

    // INFO: GET A SINGLE USER
    app.get('/user/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: ObjectId(id) }
      const result = await collection.findOne(query)
      res.json(result)
    })

    // INFO: EDIT A USER
    app.put('/user/:id', async (req, res) => {
      const id = req.params.id
      const { name, email, location, img } = req.body
      const filter = { _id: ObjectId(id) }
      const options = { upsert: true }
      const updateDoc = {
        $set: {
          name,
          email,
          location,
          img,
        },
      }

      const result = await collection.updateOne(filter, updateDoc, options)

      res.json(result)
    })
  } finally {
    // client.close()
  }
}

run().catch((err) => console.log(err))
