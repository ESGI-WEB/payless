const express = require("express");
const app = express();
const errorHandler = require("./middlewares/errorHandler");
const cors = require("cors");
const paymentRouter = require("./routes/payment")();
const auth = require("./middlewares/auth");

app.use(express.json());

app.use(cors());

app.use(function (req, res, next) {
  if (["POST", "PUT", "PATCH"].includes(req.method)) {
    if (!req.is("application/json")) {
      return res.sendStatus(400);
    }
  }
  next();
});

app.use("/payments", auth(), paymentRouter);

app.use(errorHandler);

if (process.env.NODE_ENV !== "test") {
  app.listen(process.env.APP_PORT, () => {
    console.log(`Listening on port ${process.env.APP_PORT}!`);
  });
}

module.exports = app;