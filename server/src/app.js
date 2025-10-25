import express from "express";
import productRouter from "./routes/product.routes.js";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/products", productRouter);

export default app;
