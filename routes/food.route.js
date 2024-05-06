const express = require("express");
const app = express();
const {validateAdmin} = require("../middlewares/admin-validation")
const {authorize} = require("../controllers/auth.controller")

const foodController = require("../controllers/food.controller");
app.post("/", authorize, foodController.addFood)
app.get("/", authorize,foodController.getAllFood)
app.get("/:search",authorize,foodController.findFood)
app.put("/:id",authorize,foodController.updateFood)
app.delete("/:id",authorize,foodController.deleteFood)

module.exports = app;
