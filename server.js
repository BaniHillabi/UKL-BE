const express = require("express")
const app = express()
const cors = require("cors")
require('dotenv').config()

app.use(express.json())
app.use(cors())

const PORT = process.env.PORT

//import routes
const adminRoute = require("./routes/admin.route")
const foodRoute = require("./routes/food.route")
const orderRoute = require("./routes/order.route")

app.use("/admin", adminRoute)
app.use("/food", foodRoute)
app.use("/order", orderRoute)

app.listen(PORT, () => {
    console.log(`run in port ${PORT}`)
})