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
exports.updateOrder = exports.getSingleOrder = exports.getOrders = exports.placeOrder = exports.testing = void 0;
const stripe_1 = __importDefault(require("stripe"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const orderModel_1 = __importDefault(require("../models/orderModel"));
const appError_1 = __importDefault(require("../utils/appError"));
const stripe = new stripe_1.default("sk_test_51Pc94CCvj25n1SVem04vih54JceXmpjdD082Q0b0r82teXzVN2IgWfsuSGjFHdrEb2915MlljPfhG9jG4oxk6oml009dflPvGy");
const FRONTEND_URL = "http://localhost:3000";
exports.testing = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const customer = yield stripe.customers.create({
        email: "moses@example.com",
    });
    res.status(200).json({ customer });
}));
exports.placeOrder = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { items, address, totalAmount } = req.body;
    // Create a new order
    const newOrder = new orderModel_1.default({
        status: "Food Processing",
        totalAmount,
        items,
        address,
        date: new Date(),
        payment: false,
    });
    // console.log(newOrder._id);
    //// Create line items for Stripe session
    const lineItems = items.map((item) => ({
        price_data: {
            currency: "usd",
            product_data: {
                name: item.type,
                images: [item.image],
                description: item.description,
            },
            unit_amount: item.price * 100,
        },
        quantity: 1,
    }));
    // Create Stripe checkout session
    const session = yield stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: lineItems,
        mode: "payment",
        success_url: `http://localhost:3000/order-success?orderId=${newOrder._id}`,
        cancel_url: `http://localhost:3000/order-cancel?orderId=${newOrder._id}`,
        metadata: {
            orderId: newOrder._id.toString(),
        },
    });
    if (!session.url) {
        return res.status(500).json({ message: "Error creating Stripe session" });
    }
    newOrder.paymentIntentId = session.payment_intent;
    yield newOrder.save();
    res.status(200).json({ url: session.url });
}));
exports.getOrders = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield orderModel_1.default.find();
    res.status(200).json({ status: "success", data: { order } });
}));
exports.getSingleOrder = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield orderModel_1.default.findById(req.params.id);
    console.log(order);
    if (!order) {
        return next(new appError_1.default("No document found with that ID :IvalidId", 404));
    }
    res.status(200).json({ status: "success", data: { order } });
}));
exports.updateOrder = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const updateData = req.body;
    const order = yield orderModel_1.default.findByIdAndUpdate(req.params.id, updateData, {
        new: true, // Return the updated document
        runValidators: true, // Run schema validators on update
    });
    if (!order) {
        return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json({ status: "success", data: { order } });
}));
