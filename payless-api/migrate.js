const { connection } = require("./db");

connection.sync({ force: process.env.NODE_ENV !== "production" }).then(() => {
  console.log("Database synchronized");
  connection.close();
});
