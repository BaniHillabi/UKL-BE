//import model
const orderDetailModel = require("../models/index").order_detail;
const orderModel = require("../models/index").order_list;
const foodModel = require("../models/index").food;

exports.getAllOrder = async (req, res) => {
  try {
    data = await orderModel.findAll({include : {
      model: orderDetailModel
    }});
    return res.json(data)
  } catch (error) {}
};

exports.addOrder = async (req, res) => {
  try {
    const order = await orderModel
      .create({
        customer_name: req.body.customer_name,
        table_number: req.body.table_number,
        order_date: Date.now(),
      })
      // res.json(order)
      .then((details) => {
        req.body.order_detail.map(async (detail) => {
          const food = await foodModel.findOne({
            where: { id: detail.food_id },
          });
          await orderDetailModel.create({
            order_id: details.id,
            price: food.price * detail.quantity,
            ...detail,
          });
        });
        return res.json(details);
      })
      .catch((err) => {});
  } catch (error) {
    res.json(error);
  }
};
