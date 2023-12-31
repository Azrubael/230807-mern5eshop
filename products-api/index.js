import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import amqp from "amqplib"

import Product from "./models/products.js"
import Order from "./models/orders.js"

const app = express()

app.use(express.json())
app.use(cors())

app.get("/products", async (req, res) => {
  const products = await Product.find()
  return res.status(200).json({
    products,
  })
})

app.post("/products", async ({ body }, res) => {
  const product = await Product.create({
    name: body.name,
    image: body.image,
    description: body.description,
    price: body.price,
  })
  return res.status(200).json({
    product,
  })
})

app.put("/orders/:id", async (req, res) => {
  const { id } = req.params
  const { status } = req.body

  const order = await Order.findById(id)

  order.status = status

  await order.save()

  if (status === "DELIVERED") {
    try {
      const connection = await amqp.connect(
        `amqp://${ process.env.QUSR }:${ process.env.QPWD }@${ process.env.QHOST }:${ process.env.QPORT }`
      )
      console.log({ connection })
      const channel = await connection.createChannel()
      const result = channel.assertQueue("jobs")
      channel.sendToQueue("jobs", Buffer.from(order.phone))
    } catch (error) {
      console.log({ error })
    }
  }

  return res.status(200).json({
    order,
  })
})

app.post("/orders", async (req, res) => {
  const body = req.body

  const order = await Order.create({
    status: "PLACED",
    order: body.order,
    phone: body.phone,
    address: body.address,
  })

  return res.status(200).json({
    order,
  })
})

app.get("/orders", async (req, res) => {
  const orders = await Order.find()
  return res.status(200).json({
    orders,
  })
})

mongoose.set('strictQuery', false)

//[5] - k8s-4dev in pods approach
const mongo_URI = `mongodb://${process.env.MONGODB_SERVICE}/products`
/*   
  [4] - a cloud prod approach
const mongo_URI = `mongodb://${process.env.MONGO_INITDB_ROOT_USERNAME}:${process.env.MONGO_INITDB_ROOT_PASSWORD}@${process.env.MONGODB_HOST}/products` 
  [3] - a local network approach (with a container name)
const mongo_URI = 'mongodb://mongodb:27017/products'
  [2] - tested link, a little better approach for `npm run start`
const mongo_URI = 'mongodb://172.17.0.2:27017/products'
  [1] - tested link for `npm run start`
const mongo_URI = 'mongodb://host.docker.internal:27017/products'
*/

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}

async function MongoDBService() {
  try {
    await mongoose.connect(mongo_URI, options)
      .then(() => {
        console.log("Connected to MongoDB")
        app.listen(process.env.BACKEND_PORT, () => {
          console.log("Now listening on PORT " + process.env.BACKEND_PORT)
        })
      })
  } catch (error) {
    console.log("Unable to connect to MongoDB")
    console.log(error)
  }
  mongoose.connection.on("error", (err) => console.log(err))
}

MongoDBService()