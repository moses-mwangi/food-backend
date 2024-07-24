import express, { Router } from "express";
import {
  getOrders,
  placeOrder,
  testing,
  getSingleOrder,
  updateOrder,
} from "../controllers/orderController";
const router: Router = express.Router();

router.route("/place").get(getOrders).post(placeOrder);
router.route("/place/:id").get(getSingleOrder).patch(updateOrder);
router.route("/create-customer").post(testing);

export default router;
