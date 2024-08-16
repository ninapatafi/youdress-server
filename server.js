import express from "express";
import "dotenv/config";
import cors from "cors";
import fs from "fs";

const app = express();
app.use(express.json());
app.use(express.static("public"));

const PORT = process.env.PORT || 5050;
app.use(cors());

let cart = [];

app.get("/products", (req, res) => {
  const productsBuffer = fs.readFileSync("./data/products.json");
  const products = JSON.parse(productsBuffer);
  return res.json(products);
});

app.get("/", (req, res) => {
  res.send(`Welcome to my express app`);
});

app.listen(PORT, () => {
  console.log(`app running on port ${PORT}`);
});
