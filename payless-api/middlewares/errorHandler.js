const ValidationError = require("../errors/ValidationError");
const {MulterError} = require("multer");

module.exports = function (err, req, res, next) {
  if (err instanceof ValidationError) {
    res.status(422).json(err.errors);
  } else if (err instanceof MulterError) {
    res.status(422).json({[err.field]: err.message});
  } else {
    console.error(err);
    res.sendStatus(500);
  }
};
