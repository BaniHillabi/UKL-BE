const express = require("express");
const app = express();

const orderController = require("../controllers/order.controller")

app.post("/",orderController.addOrder)
app.get("/", orderController.getAllOrder)

module.exports = app

