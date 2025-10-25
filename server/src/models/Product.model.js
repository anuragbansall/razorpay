import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    amount: {
      type: Number,
      min: 0,
      required: true,
    },
    currency: {
      type: String,
      default: "INR",
      enum: ["INR", "USD"],
      required: true,
    },
  },
  imageUrl: {
    type: String,
    required: true,
  },
});

const Product = mongoose.model("Product", ProductSchema);

export default Product;
