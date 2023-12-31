import mongoose from "mongoose"

const Schema = mongoose.Schema

const productSchema = new Schema({
  product: String,
  quantity: Number,
})

const orderSchema = new Schema({
  status: String,
  order: [productSchema],
  phone: String,
  address: String,
})

const OrderModel = mongoose.model("Order", orderSchema)

export default OrderModel
