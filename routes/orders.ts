import express, { Router } from "express";
import { getAll, createOne } from "../controllers/userController";
import { getOrders, placeOrder, testing } from "../controllers/orderController";
import { protect } from "../controllers/authController.";

const router: Router = express.Router();

router.route("/place").get(getOrders).post(placeOrder);
router.route("/create-customer").post(testing);

export default router;
