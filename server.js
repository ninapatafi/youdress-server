import express from "express";
import "dotenv/config";
import cors from "cors";
import fs from "fs";

const app = express();
app.use(express.json());
app.use(express.static("public"));

const PORT = process.env.PORT || 5050;
app.use(cors());

app.get("/products", (req, res) => {
  const productsBuffer = fs.readFileSync("./data/products.json");
  const products = JSON.parse(productsBuffer);
  return res.json(products);
});

app.post("/add-to-cart", (req, res) => {
  const { id, product_name, price, image_url } = req.body;

  // const item = { id, quantity, product_name, price, image_url };

  let cart = [];
  try {
    const data = fs.readFileSync("./data/shoppingcart.json", "utf8");
    cart = JSON.parse(data);
  } catch (err) {
    console.error("Error reading shoppingcart.json:", err);
  }

  const quantity = 1;
  const item = { id, quantity, product_name, price, image_url };

  // if item already exists = add quantity
  const existingItemIndex = cart.findIndex((i) => i.id === id);
  if (existingItemIndex > -1) {
    cart[existingItemIndex].quantity += quantity;
  } else {
    cart.push(item);
  }

  // Write the updated cart data back to shoppingcart.json
  try {
    fs.writeFileSync("./data/shoppingcart.json", JSON.stringify(cart, null, 2));
    res.status(200).json(cart); // Returning the updated cart array
  } catch (err) {
    console.error("Error writing to shoppingcart.json:", err);
    res.status(500).json({ error: "Failed to add item to cart" });
  }
});

app.delete("/cart/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);

  let cart = [];
  try {
    const data = fs.readFileSync("./data/shoppingcart.json", "utf8");
    cart = JSON.parse(data);
  } catch (err) {
    console.error("Error reading shoppingcart.json:", err);
    return res.status(500).json({ error: "Failed to retrieve cart" });
  }

  cart = cart.filter((item) => item.id !== id);

  try {
    fs.writeFileSync("./data/shoppingcart.json", JSON.stringify(cart, null, 2));
    res.status(200).json(cart); // Returning the updated cart array
  } catch (err) {
    console.error("Error writing to shoppingcart.json:", err);
    res.status(500).json({ error: "Failed to remove item from cart" });
  }
});

app.get("/cart", (req, res) => {
  let cart = [];
  try {
    const data = fs.readFileSync("./data/shoppingcart.json", "utf8");
    cart = JSON.parse(data);
  } catch (err) {
    console.error("Error reading shoppingcart.json:", err);
    return res.status(500).json({ error: "Failed to retrieve cart" });
  }
  res.status(200).json(cart); // Returning the cart array directly
});

app.post("/update-cart", (req, res) => {
  const { id, quantity } = req.body;

  // Read shoppingcart.json
  let cart = [];
  try {
    const data = fs.readFileSync("./data/shoppingcart.json", "utf8");
    cart = JSON.parse(data);
  } catch (err) {
    console.error("Error reading shoppingcart.json:", err);
    return res.status(500).json({ error: "Failed to retrieve cart" });
  }

  // Update quantity
  const item = cart.find((item) => item.id === id);
  if (item) {
    item.quantity = quantity;
  }

  try {
    fs.writeFileSync("./data/shoppingcart.json", JSON.stringify(cart, null, 2));
    res.status(200).json(cart); // Return updated cart array
  } catch (err) {
    console.error("Error writing to shoppingcart.json:", err);
    res.status(500).json({ error: "Failed to update cart" });
  }
});

app.get("/", (req, res) => {
  res.send(`Welcome to my express app`);
});

app.listen(PORT, () => {
  console.log(`app running on port ${PORT}`);
});
