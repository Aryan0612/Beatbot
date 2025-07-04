import { connect, set } from "mongoose";
import { config } from "dotenv";
import app from "./app.js";

// Global Catcher for Uncaught Exceptions
process.on("uncaughtException", (err) => {
  console.log("Uncaught Exception 💥");
  console.log(err.name, err.message);
  process.exit(1);
});

config();

const DB = process.env.DATABASE;

set("strictQuery", false);

connect('mongodb+srv://poats69:PratikOmAryanTejas@test-database.mvt9bee.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("DB Connection Successful"));

const port = process.env.PORT || 4000;

const server = app.listen(port, () => {
  console.log(`App running on port ${port} in ${process.env.NODE_ENV} mode...`);
});

// Global Catcher for Unhandled Promise Rejections
process.on("unhandledRejection", (err) => {
  console.log("Unhandled Promise Rejection 💥");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});


