import mongoose from "mongoose";
import dotenv from "dotenv";
import app from "./app";

process.on("uncaughtException", (err) => {
  console.log("UNHANDLE EXCEPTION ----shutting down 💥");
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: "./config.env" });

const env = process.env.NODE_ENV || "development";
dotenv.config({ path: `./config.env.${env}` });

const db = String(process.env.DATABASE);
mongoose
  .connect(db)
  .then(() => {
    console.log("Database has succefully connneccted");
  })
  .catch((err: Error) => console.error(err));

const port: number = Number(process.env.PORT);
const server = app.listen(port, "127.0.0.1", () => {
  console.log(`listening to port ${port}`);
});
