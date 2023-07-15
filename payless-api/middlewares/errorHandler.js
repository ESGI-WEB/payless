const ValidationError = require("../errors/ValidationError");

module.exports = function (err, req, res, next) {
  if (err instanceof ValidationError) {
    res.status(422).json(err.errors);
  } else {
    res.sendStatus(500);
  }
};
