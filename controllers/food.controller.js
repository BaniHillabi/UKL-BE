//import model
const foodModel = require("../models/index").food;
const {uploadFood} = require("./upload-image")

const Op = require(`sequelize`).Op;
const fs = require("fs");
const path = require("path");

exports.getAllFood = async (req, res) => {
  try {
    let foodData = await foodModel.findAll();

    return res.status(200).json({
      success: true,
      data: foodData,
      message: "All food have been loaded",
    });
  } catch (error) {
    console.error("Error in getAllFood: ", error);
    return res.status(500).json({
      success: false,
      data: null,
      message: "Data food is empty",
    });
  }
};

exports.findFood = async (req, res) => {
  let search = req.params.search;

  try {
    let dataFood = await foodModel.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.substring]: search } },
          { spicy_level: { [Op.substring]: search } },
          { price: { [Op.substring]: parseInt(search) } },
        ],
      },
    });

    return res.status(200).json(dataFood);
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: "Food Not Found",
    });
  }
};

exports.addFood = async (req, res) => {
  uploadFood.single("image")(req, res, async (error) => {
    if (error) {
      return res.status(500).json({ message: error });
    }
    if(!req.file){
      return res.json({message: "No uploaded file"})
    }
    if(!req.body.name || !req.body.spicy_level || !req.body.price){
      return res.json({message: "All field must be filled"})
    }

    let dataFood = {
      name: req.body.name,
      spicy_level: req.body.spicy_level,
      price: parseFloat(req.body.price),
      image: req.file.filename
    };

    foodModel
      .create(dataFood)
      .then(result => {
        return res.json({
          status: true,
          data: result,
          message: "New food has been inserted",
        });
      })
      .catch((error) => {
        return res.status(500).json({ message: "Failed to add food" });
      });
  });
};

exports.updateFood = async (req, res) => {
  uploadFood.single("image")(req, res, async (error) => {
    if (error) {
      return res.json({
        success: false,
        message: error.message,
      });
    } else {
      let id = req.params.id;
      let newFood = {
        name: req.body.name,
        spicy_level: req.body.spicy_level,
        price: Number(req.body.price),
        
      };

      if (req.file) {
        const selectedFood = await foodModel.findOne({ where: { id: id } });
        const oldFotoFood = selectedFood.image;
        const pathFoto = path.join(
          __dirname,
          "../images/food",
          oldFotoFood
        );

        if (fs.existsSync(pathFoto)) {
          fs.unlink(pathFoto, (error) => console.log(error));
        }
      }

      foodModel
        .update(newFood, { where: { id: id } })
        .then(async (result) => {
          const updatedFood = await foodModel.findOne({where:{id: req.params.id}})
          return res.json({
            success: true,
            data: updatedFood,
            message: "Data has been updated",
          });
        })
        .catch((error) => {
          return res.status(500).json({
            success: false,
            message: error.message,
          });
        });
    }
  });
};

exports.deleteFood = async (req, res) => {
  let idFood = req.params.id;
  let OldData = await foodModel.findAll({where: {id: idFood}})

  foodModel
    .destroy({ where: { id: idFood } })
    .then((result) => {
      return res.json({
        success: true,
        data: OldData,
        message: "Data Food has been removed",
      });
    })
    .catch((error) => {
      return res.json({
        success: false,
        message: error.message,
      });
    });
};
