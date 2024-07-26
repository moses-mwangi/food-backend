import express, { Router } from "express";
import {
  getOrders,
  placeOrder,
  testing,
  getSingleOrder,
  updateOrder,
  deleteOrder,
} from "../controllers/orderController";
const router: Router = express.Router();

router.route("/place").get(getOrders).post(placeOrder);
router
  .route("/place/:id")
  .get(getSingleOrder)
  .patch(updateOrder)
  .delete(deleteOrder);
router.route("/create-customer").post(testing);

export default router;
