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

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3002",
  "https://food-delivery-bkrk.vercel.app",
  "https://food-delivery-dasboard-pk5j.vercel.app",
  "https://food-delivery-dasboard.vercel.app",
];

const corsOptions = {
  origin: (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
  ) => {
    if (allowedOrigins.includes(origin!) || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));

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

app.get("/api/users", userRouter);
app.get("/apgetrE", userE);
app.get("/api/restaurants", restRouter);
app.get("/api/orders", orderRouter);

app.get("/api", userRouter);
app.get("/app", userRouter);

app.get("/", (req, res) => {
  res.send("Welcome to the API");
});

app.all("*", (req, res, next) => {
  next(new AppError(`Cant find ${req.originalUrl} on this server`, 400));
});

app.use(globalErrorHandler);

export default app;

// "build": "NODE_ENV=production ts-node server.ts"
