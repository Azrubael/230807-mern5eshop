const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const amqp = require("amqplib");

const Product = require("./models/products");
const Order = require("./models/orders");

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.get("/products", async (req, res) => {
  const products = await Product.find();
  return res.status(200).json({
    products,
  });
});

app.post("/products", async ({ body }, res) => {
  const product = await Product.create({
    name: body.name,
    image: body.image,
    description: body.description,
    price: body.price,
  });
  return res.status(200).json({
    product,
  });
});

app.put("/orders/:id", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const order = await Order.findById(id);

  order.status = status;

  await order.save();

  if (status === "DELIVERED") {
    try {
      const connection = await amqp.connect(
        `amqp://${process.env.RABBITMQ_HOST}:${process.env.RABBITMQ_PORT}`
      );
      console.log({ connection });
      const channel = await connection.createChannel();
      const result = channel.assertQueue("jobs");
      channel.sendToQueue("jobs", Buffer.from(order.phone));
    } catch (error) {
      console.log({ error });
    }
  }

  return res.status(200).json({
    order,
  });
});

app.post("/orders", async (req, res) => {
  const body = req.body;

  const order = await Order.create({
    status: "PLACED",
    order: body.order,
    phone: body.phone,
    address: body.address,
  });

  return res.status(200).json({
    order,
  });
});

app.get("/orders", async (req, res) => {
  const orders = await Order.find();
  return res.status(200).json({
    orders,
  });
});
// CONNECT TO MONGO
mongoose.connect(
  `mongodb://${process.env.MONGODB_HOST}/products`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) {
      console.log("Unable to connect to MongoDB");
      console.log(err);
    } else {
      console.log("Connected to MongoDB");
      app.listen(5002, () => {
        console.log("Now listening on PORT 5002");
      });
    }
  }
);

// {
//   "product": {
//       "image": "https://www.rebootwithjoe.com/wp-content/uploads/2013/06/Almond-Butter-Chocolate-Fudge.jpg",
//       "price": 14.33,
//       "description": "Gooey and creamy chocolate",
//       "_id": "62c5fee277de00fe92c75f27",
//       "__v": 0
//   }
// }
// {
//     "name": "Red Velvet",
//     "image": "https://media.istockphoto.com/photos/red-velvet-cake-picture-id485832764?k=20&m=485832764&s=612x612&w=0&h=58yxSE0lOx3aD7OZJ3wodakdAbEB-aH6MWNj3QGutwg=",
//     "description": "Moist with cream cheese icing",
//     "price": 34.33
// },
// {
//     "name": "Raspberry Cheesecake",
//     "image": "https://www.elmundoeats.com/wp-content/uploads/2020/06/FP-No-Bake-Raspberry-Cheesecake.jpg",
//     "description": "New York style cheesecake",
//     "price": 64.33
// }