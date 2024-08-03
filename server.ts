import mongoose from "mongoose";
import dotenv from "dotenv";
import app from "./app";

const env = process.env.NODE_ENV || "development";

dotenv.config({ path: "./config.env" });

process.on("uncaughtException", (err) => {
  console.error("UNHANDLED EXCEPTION ---- Shutting down 💥");
  console.error(err.name, err.message);
  process.exit(1);
});

const db =
  "mongodb+srv://mosesmwangime:9SPqAj4JOaXBxDrI@cluster0.sqjq7km.mongodb.net/delivery?retryWrites=true&w=majority&appName=Cluster0";

mongoose
  .connect(db)
  .then(() => {
    console.log("Database has succefully connneccted");
  })
  .catch((err: Error) => console.error(db, err.name, err.message, "moess"));

const port: number = Number(process.env.PORT) || 3003;
const server = app.listen(port, "127.0.0.1", () => {
  console.log(`listening to port ${port}`);
});
