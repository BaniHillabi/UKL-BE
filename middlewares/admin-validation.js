const { validationResult, body } = require(`express-validator`);

const validateAdmin = [
  body("name").notEmpty().withMessage("name is required"),
  body("email").isEmail().withMessage("Invalid email address"),
  body("password").notEmpty().withMessage("Password is required"),

  (request, response, next) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {

        let errMessage = errors
        .array()
        .map((it) => it.msg)
        .join(",");

      return response.status(422).json({
        success: false,
        message: errMessage,
      });
    }
    next(); 
  },
];

module.exports = { validateAdmin };

