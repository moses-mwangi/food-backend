"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const mime_types_1 = __importDefault(require("mime-types"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const users_1 = __importDefault(require("./routes/users"));
const restaurants_1 = __importDefault(require("./routes/restaurants"));
const orders_1 = __importDefault(require("./routes/orders"));
const errorController_1 = __importDefault(require("./controllers/errorController"));
const appError_1 = __importDefault(require("./utils/appError"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
const allowedOrigins = [
    "https://food-delivery-bkrk.vercel.app",
    "https://food-delivery-dasboard-pk5j.vercel.app",
    "https://food-delivery-dasboard.vercel.app",
];
const corsOptions = {
    origin: (origin, callback) => {
        if (allowedOrigins.includes(origin) || !origin) {
            callback(null, true);
        }
        else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
};
app.use((0, cors_1.default)(corsOptions));
app.use("/images", express_1.default.static(path_1.default.join(__dirname, "public/images"), {
    setHeaders: (res, filePath) => {
        const mimeType = mime_types_1.default.lookup(filePath);
        if (mimeType) {
            res.setHeader("Content-Type", mimeType);
        }
        else {
            console.warn(`Cannot determine MIME type for file: ${filePath}`);
        }
    },
}));
app.use("/assets", express_1.default.static(path_1.default.join(__dirname, "public/assets"), {
    setHeaders: (res, filePath) => {
        const mimeType = mime_types_1.default.lookup(filePath);
        if (mimeType) {
            res.setHeader("Content-Type", mimeType);
        }
        else {
            console.warn(`Cannot determine MIME type for file: ${filePath}`);
        }
    },
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
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
    app.use((0, morgan_1.default)("dev"));
    console.log(process.env.Node_ENV);
}
app.use((req, res, next) => {
    console.log("Testing middleware");
    next();
});
app.use("/api/users", users_1.default);
app.use("/api/restaurants", restaurants_1.default);
app.use("/api/orders", orders_1.default);
app.get("/", (req, res) => {
    res.send("Welcome to the API");
});
app.all("*", (req, res, next) => {
    next(new appError_1.default(`Cant find ${req.originalUrl} on this server`, 400));
});
app.use(errorController_1.default);
exports.default = app;
// "build": "NODE_ENV=production ts-node server.ts"
