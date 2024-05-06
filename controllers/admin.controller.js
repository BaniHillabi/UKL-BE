//import model
const adminModel = require("../models/index").admin;

const Op = require(`sequelize`).Op;
const bcrypt = require(`bcrypt`);

exports.getAllAdmin = async (req, res) => {
  try {
    let dataAdmin = await adminModel.findAll();

    return res.status(200).json({
      success: true,
      data: dataAdmin,
      message: "All admin have been loaded",
    });
  } catch (error) {
    console.error("Error in getAllAdmin: ", error);
    return res.status(500).json({
      success: false,
      data: null,
      message: "Data Admin is empty",
    });
  }
};

exports.findAdmin = async (req, res) => {
  let keyword = req.body.keyword;

  try {
    let dataAdmin = await adminModel.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.substring]: keyword } },
          { email: { [Op.substring]: keyword } },
        ],
      },
    });

    return res.status(200).json(dataAdmin);
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: "Admin Not Found",
    });
  }
};

exports.addAdmin = async (req, res) => {
  let newAdmin = {
    name: req.body.name,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 10),
  };

  if (!req.body) {
    return res.json({ message: "Nothing Uploaded" });
  }

  const existingAccount = await adminModel.findAll({
    where: {
      email: newAdmin.email,
    },
  });

  if (existingAccount.length > 0) {
    return res.json({
      message: "email already taken",
    });
  } else {
    adminModel
      .create(newAdmin)
      .then((result) => {
        return res.json({
          success: true,
          data: result,
          message: "New Admin has been inserted",
        });
      })
      .catch((error) => {
        return res.status(500).json({ message: "Failed to add Admin" });
      });
  }
};

exports.updateCust = async (req, res) => {
  let idAdmin = req.params.id;
  let dataAdmin = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  };

  adminModel
    .update(dataAdmin, { where: { id: idAdmin } })
    .then((result) => {
      res.json({
        result: result,
        message: "data has been updated",
      });
    })
    .catch((error) => {
      res.json({
        message: error.message,
      });
    });
};

exports.deleteAdmin = async (req, res) => {
  let idAdmin = req.params.id;

  adminModel
    .destroy({ where: { id: idAdmin } })
    .then((result) => {
      return res.json({
        success: true,
        data: result,
        message: "Data Admin has been removed",
      });
    })
    .catch((error) => {
      return res.json({
        success: false,
        message: error.message,
      });
    });
};
