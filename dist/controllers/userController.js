"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOne = exports.getAll = exports.getUser = exports.updateUser = exports.getMe = void 0;
const appError_1 = __importDefault(require("../utils/appError"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const userModel_1 = __importDefault(require("./../models/userModel"));
const getAll = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield userModel_1.default.find().select("-__v");
    res.status(200).json({
        status: "success",
        results: data.length,
        data: { data },
    });
}));
exports.getAll = getAll;
const createOne = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password, passwordConfirm, role, photo } = req.body;
    if (!name || !email || !password || !passwordConfirm) {
        return next(new appError_1.default("Please provide name, email, password, and password confirmation", 400));
    }
    const newUser = yield userModel_1.default.create({
        name,
        email,
        password,
        passwordConfirm,
        role,
        photo,
    });
    res.status(201).json({
        status: "success",
        data: {
            user: newUser,
        },
    });
}));
exports.createOne = createOne;
const getMe = (req, res, next) => {
    res
        .status(200)
        .json({ status: "success", data: { user: req.user } });
};
exports.getMe = getMe;
exports.updateUser = (0, catchAsync_1.default)(function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield userModel_1.default.findByIdAndUpdate(req.params.id, { role: req.body.role }, {
            new: true,
            runValidators: true,
        });
        if (!user) {
            return next(new appError_1.default("No user found with that ID :IvalidId", 404));
        }
        res.status(200).json({
            status: "success",
            data: { user },
        });
    });
});
exports.getUser = (0, catchAsync_1.default)(function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield userModel_1.default.findOne({ _id: req.params.id });
        console.log(user);
        if (!user) {
            return next(new appError_1.default("No document found with that ID :IvalidId", 404));
        }
        res.status(200).json({
            status: "success",
            data: { data: user },
        });
    });
});
