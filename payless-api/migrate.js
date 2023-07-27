const { connection } = require("./db/postgres/index");

connection.sync({ force: process.env.NODE_ENV !== "production" }).then(() => {
  console.log("Database synchronized");
  connection.close();
});
