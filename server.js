import express from "express";
import "dotenv/config";
import cors from "cors";
import fs from "fs";
// import data from "data/users.json";
// import * as {type: json} from "./data/products.json";

// const products = productsData;
// const express = require("express");

const app = express();
app.use(express.json());
app.use(express.static("public"));

const PORT = process.env.PORT || 5050;
app.use(cors());

// app.use("/", (req, res, next) => {
//   const filters = req.query;
//   const filteredProducts = products.filter((product) => {
//     let isValid = true;
//     for (key in filters) {
//       console.log(key, product[key], filters[key]);
//       isValid = isValid && product[key] == filters[key];
//     }
//     return isValid;
//   });
//   res.send(filteredUsers);
// });

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
