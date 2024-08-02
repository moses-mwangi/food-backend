"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const orderController_1 = require("../controllers/orderController");
const router = express_1.default.Router();
router.route("/place").get(orderController_1.getOrders).post(orderController_1.placeOrder);
router
    .route("/place/:id")
    .get(orderController_1.getSingleOrder)
    .patch(orderController_1.updateOrder)
    .delete(orderController_1.deleteOrder);
router.route("/create-customer").post(orderController_1.testing);
exports.default = router;
