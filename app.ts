// const express = require("express");
// const morgan = require("morgan");
// const userRouter = require("./routes/users");

import express from "express";
import morgan from "morgan";
import userRouter from "./routes/users";
import restRouter from "./routes/restaurants";
import orderRouter from "./routes/orders";
import globalErrorHandler from "./controllers/errorController";
import AppError from "./utils/appError";

const app = express();

app.use(express.json());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(process.env.Node_ENV);
}

app.use((req, res, next) => {
  console.log("Testing middleware");
  console.log(process.env.Node_ENV);
  next();
});

app.use("/api/users", userRouter);
app.use("/api/restaurants", restRouter);
app.use("/api/orders", orderRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Cant find ${req.originalUrl} on this server`, 400));
});

app.use(globalErrorHandler);

export default app;
