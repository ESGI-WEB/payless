const express = require("express");
const app = express();
const errorHandler = require("./middlewares/errorHandler");
const cors = require("cors");
const paymentRouter = require("./routes/payment")();

app.use(express.json());

const allowedOrigins = [];
if (process.env.NODE_ENV !== "production") {
    allowedOrigins.push("http://localhost");
}
const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};
// app.use(cors(corsOptions));

app.use(function (req, res, next) {
  if (["POST", "PUT", "PATCH"].includes(req.method)) {
    if (!req.is("application/json")) {
      return res.sendStatus(400);
    }
  }
  next();
});

app.use("/payments", paymentRouter);
app.get("/ping", (req, res) => {
  res.send("pong");
});

app.use(errorHandler);

if (process.env.NODE_ENV !== "test") {
  app.listen(process.env.APP_PORT, () => {
    console.log(`Listening on port ${process.env.APP_PORT}!`);
  });
}

module.exports = app;