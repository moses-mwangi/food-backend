import express from "express";
import morgan from "morgan";
import mimeTypes from "mime-types";
import cors from "cors";
import cookiParser from "cookie-parser";
import userRouter from "./routes/users";
import userE from "./routes/userE";
import restRouter from "./routes/restaurants";
import orderRouter from "./routes/orders";
import globalErrorHandler from "./controllers/errorController";
import AppError from "./utils/appError";
import path from "path";

const app = express();

app.use(
  "/images",
  express.static(path.join(__dirname, "public/images"), {
    setHeaders: (res, filePath) => {
      const mimeType = mimeTypes.lookup(filePath);
      if (mimeType) {
        res.setHeader("Content-Type", mimeType);
      } else {
        console.warn(`Cannot determine MIME type for file: ${filePath}`);
      }
    },
  })
);

app.use(
  "/assets",
  express.static(path.join(__dirname, "public/assets"), {
    setHeaders: (res, filePath) => {
      const mimeType = mimeTypes.lookup(filePath);
      if (mimeType) {
        res.setHeader("Content-Type", mimeType);
      } else {
        console.warn(`Cannot determine MIME type for file: ${filePath}`);
      }
    },
  })
);

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookiParser());

app.post("/api/set-cookie", (req, res) => {
  res.cookie("yourCookieName", "cookieValue", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 24 * 60 * 60 * 1000,
  });

  res.status(200).json({ message: "Cookie set successfully" });
});

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(process.env.Node_ENV);
}

app.use((req, res, next) => {
  console.log("Testing middleware");
  next();
});

app.use("/api/users", userRouter);
app.use("/api/userE", userE);
app.use("/api/restaurants", restRouter);
app.use("/api/orders", orderRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Cant find ${req.originalUrl} on this server`, 400));
});

app.use(globalErrorHandler);

export default app;
