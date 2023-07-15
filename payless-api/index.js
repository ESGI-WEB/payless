const express = require("express");
const app = express();
const GenericRouter = require("./routes/genericCRUD");
const GenericController = require("./controllers/genericCRUD");
const userService = require("./services/user");
const errorHandler = require("./middlewares/errorHandler");
const cors = require("cors");
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

app.use(require("./routes/security")(userService));
app.use("/users", auth('admin'), new GenericRouter(new GenericController(userService)));

app.use(errorHandler);
app.listen(3000, () => {
  console.log("Listening on port 3000!");
});