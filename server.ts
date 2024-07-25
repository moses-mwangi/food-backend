import mongoose from "mongoose";
import dotenv from "dotenv";
import app from "./app";

const env = process.env.NODE_ENV || "development";
dotenv.config({ path: `./.env.${env}` });

process.on("uncaughtException", (err) => {
  console.error("UNHANDLED EXCEPTION ---- Shutting down 💥");
  console.error(err.name, err.stack, err.message);
  process.exit(1);
});

const db = String(process.env.DATABASE);
mongoose
  .connect(db)
  .then(() => {
    console.log("Database has succefully connneccted");
  })
  .catch((err: Error) => console.error(err));

const port: number = Number(process.env.PORT) || 3003;
const server = app.listen(port, "127.0.0.1", () => {
  console.log(`listening to port ${port}`);
});
