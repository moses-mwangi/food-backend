"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const app_1 = __importDefault(require("./app"));
process.on("uncaughtException", (err) => {
    console.log("UNHANDLE EXCEPTION ----shutting down 💥");
    console.log(err.name, err.message);
    process.exit(1);
});
dotenv_1.default.config({ path: "./config.env" });
const env = process.env.NODE_ENV || "development";
dotenv_1.default.config({ path: `./config.env.${env}` });
const db = String(process.env.DATABASE);
mongoose_1.default
    .connect(db)
    .then(() => {
    console.log("Database has succefully connneccted");
})
    .catch((err) => console.error(err));
const port = Number(process.env.PORT);
const server = app_1.default.listen(port, "127.0.0.1", () => {
    console.log(`listening to port ${port}`);
});
