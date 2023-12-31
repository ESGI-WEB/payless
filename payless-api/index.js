const express = require("express");
const app = express();
const SecurityRouter = require("./routes/security");
const userService = require("./services/user");
const errorHandler = require("./middlewares/errorHandler");
const cors = require("cors");
const auth = require("./middlewares/auth");
const requestMiddleware = require("./middlewares/request");
const paymentRouter = require("./routes/payments")();
const userRouter = require("./routes/users")();
const operationRouter = require("./routes/operations")();
const userController = require("./controllers/users")();

var corsOptions = {
  origin: async function (origin, callback) {
    try {
      const origins = await userService.getAllowedOrigins();
      callback(null, origins);
    } catch (e) {
      callback(e, null);
    }
  }
}

app.use(express.json());
app.use(cors(corsOptions));
app.use(requestMiddleware);

app.get("/me", auth('merchant'), userController.me);
app.use(new SecurityRouter(userService));
app.use("/users", auth('admin'), userRouter);
app.use("/payments", paymentRouter);
app.use("/operations", operationRouter);

app.use(errorHandler);

if (process.env.NODE_ENV !== "test") {
  app.listen(process.env.APP_PORT, () => {
    console.log(`Listening on port ${process.env.APP_PORT}!`);
  });
}

module.exports = app;