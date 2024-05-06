const adminModel = require("../models/index").admin;
const bcrypt = require(`bcrypt`);
const jwt = require(`jsonwebtoken`);
const secret = process.env.SECRET_TOKEN;

const authenticate = async (req, res) => {
  let dataLogin = {
    email: req.body.email,
    password: req.body.password,
  };

 

  if (!dataLogin.email || !dataLogin.password) {
    return res.status(400).json({
      succsess: false,
      logged: false,
      message: "Missing email or password",
    });
  }

  try {
    let dataAdmin = await adminModel.findOne({
      where: { email: dataLogin.email },
    });

    if (!dataAdmin) {
      return res.status(401).json({
        message: `Email not match`,
      });
    }
    const valid = await bcrypt.compare(dataLogin.password, dataAdmin.password);
    if (valid) {
      let payLoad = JSON.stringify(dataAdmin);

      let token = jwt.sign(payLoad, secret);

      return res.json({
        succsess: true,
        logged: true,
        message: `Authentication Success`,
        token: token,
      });
    }
    return res.status(500).json({
      succsess: false,
      logged: false,
      message: `Email or password false`,
    });
  } catch (error) {
    console.log(error)
  }

};

const authorize = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    let verifiedAdmin = jwt.verify(token, secret);
    if (!verifiedAdmin) {
      return res.json({
        succsess: false,
        auth: false,
        message: `Admin unauthorized`,
      });
    }

    req.admin = verifiedAdmin;
    next();
  } else {
    return res.status(500).json({
      succsess: false,
      auth: false,
      message: `Admin unauthorized`,
    });
  }
};

module.exports = { authenticate, authorize };
