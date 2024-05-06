const express = require("express");
const app = express();
const {authenticate} = require("../controllers/auth.controller")

const adminController = require("../controllers/admin.controller");
app.post("/", adminController.addAdmin)
app.get("/",adminController.getAllAdmin)
app.post("/auth", authenticate);
app.delete("/delete/:id", adminController.deleteAdmin)

module.exports = app;
