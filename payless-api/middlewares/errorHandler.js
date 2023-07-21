const ValidationError = require("../errors/ValidationError");
const {MulterError} = require("multer");
const ServiceError = require("../errors/ServiceError");

module.exports = function (err, req, res, next) {
  if (err instanceof ValidationError) {
    res.status(422).json(err.errors);
  } else if (err instanceof MulterError) {
    res.status(422).json({[err.field]: err.message});
  }  else if (err instanceof ServiceError) {
    res.status(500).json(err.errors);
  } else {
    console.error(err);
    res.sendStatus(500);
  }
};
