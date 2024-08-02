"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const appError_1 = __importDefault(require("../utils/appError"));
const handleCastErrorDb = (err) => {
    const message = `Invalid ${err.path}:${err.value}`;
    return new appError_1.default(message, 400);
};
const handleDuplicateFieldsDb = (err) => {
    var _a, _b;
    const value = (_b = (_a = err.errmsg) === null || _a === void 0 ? void 0 : _a.split(":").at(-2)) === null || _b === void 0 ? void 0 : _b.slice(2);
    const message = `Duplicate fields ${value}:please try another value`;
    return new appError_1.default(message, 400);
};
// const handleValidationErrorDb = (err: CustomError) => {
//   const value = Object.values(err.errors).map((el) => el.message);
//   const message = `Invalid input data: ${value.join(". ")}`;
//   return new AppError(message, 400);
// };
// //////JWTERRROR:HANDLER IF SIGNATURE ERROR ITS CORRECT
// const handleJwtError = (err) =>
//   new AppError("Invalid token. Please login again!", 401);
// const handleJwtExpireError = (err) =>
//   new AppError("Your token has expired. Please try to login again!", 401);
const sendErrorDEv = (err, res) => {
    res.status(err.statusCode ? err.statusCode : 500).json({
        status: err.status,
        cond: "development",
        message: err.message,
        error: err,
        stack: err.stack,
    });
};
const sendErrorProduction = (err, res) => {
    if (err.isOptional) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
        //////PROGGRAMING or UNKNOWN ERRORS: eg The package u used might have problem
    }
    else {
        console.error("ERROR", err);
        res.status(500).json({
            status: "error",
            message: "Something went wrong!",
        });
    }
};
const globalErrorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";
    if (process.env.NODE_ENV === "development") {
        sendErrorDEv(err, res);
        console.log("decvvvv");
    }
    else if (process.env.NODE_ENV === "production") {
        if (err.name === "CastError")
            err = handleCastErrorDb(err);
        if (err.code === 11000)
            err = handleDuplicateFieldsDb(err);
        // if (err.name === "ValidationError") err = handleValidationErrorDb(err);
        // if (err.name === "JsonWebTokenError") err = handleJwtError(err);
        // if (err.name === "TokenExpiredError") err = handleJwtExpireError(err);
        sendErrorProduction(err, res);
    }
};
exports.default = globalErrorHandler;
