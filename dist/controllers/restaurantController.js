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
exports.updateOne = exports.getOneRestaurantById = exports.getOneRestaurant = exports.createOne = exports.getAll = void 0;
const appError_1 = __importDefault(require("../utils/appError"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const restaurantModel_1 = __importDefault(require("./../models/restaurantModel"));
const getAll = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield restaurantModel_1.default.find();
    res.status(200).json({
        status: "success",
        results: data.length,
        data: { data },
    });
}));
exports.getAll = getAll;
const getOneRestaurant = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.params;
    const restaurant = yield restaurantModel_1.default.findOne({ restName: name });
    if (!restaurant) {
        return next(new appError_1.default("No restaurant found with that name", 404));
    }
    res.status(200).json({
        status: "success",
        data: { restaurant },
    });
}));
exports.getOneRestaurant = getOneRestaurant;
const getOneRestaurantById = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.params;
    const restaurant = yield restaurantModel_1.default.findById(req.params.id);
    if (!restaurant) {
        return next(new appError_1.default("No restaurant found with that id", 404));
    }
    res.status(200).json({
        status: "success",
        data: { restaurant },
    });
}));
exports.getOneRestaurantById = getOneRestaurantById;
const createOne = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const newRestaurant = yield restaurantModel_1.default.create(req.body);
    res.status(200).json({
        status: "success",
        data: {
            data: newRestaurant,
        },
    });
}));
exports.createOne = createOne;
const updateOne = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.params;
    const newRestaurant = yield restaurantModel_1.default.findOneAndUpdate({ restName: name }, req.body, {
        new: true,
        runValidators: true,
    });
    res.status(200).json({
        status: "success",
        data: {
            data: newRestaurant,
        },
    });
}));
exports.updateOne = updateOne;
