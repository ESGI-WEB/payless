const express = require("express");
const app = express();
const GenericRouter = require("./routes/genericCRUD");
const SecurityRouter = require("./routes/security");
const GenericController = require("./controllers/genericCRUD");
const userService = require("./services/user");
const errorHandler = require("./middlewares/errorHandler");
const cors = require("cors");
const auth = require("./middlewares/auth");
const requestMiddleware = require("./middlewares/request");

app.use(express.json());
app.use(cors());
app.use(requestMiddleware);

app.use(new SecurityRouter(userService));
app.use("/users", auth('admin'), new GenericRouter(new GenericController(userService)));

app.use(errorHandler);
app.listen(3000, () => {
  console.log("Listening on port 3000!");
});