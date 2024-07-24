import express, { Router } from "express";
import {
  getAll,
  createOne,
  getOneRestaurant,
  getOneRestaurantById,
  updateOne,
} from "../controllers/restaurantController";

const router: Router = express.Router();

router.route("/").get(getAll).post(createOne);
router.route("/:name").get(getOneRestaurant).patch(updateOne);
// router.route("/:id").get(getOneRestaurantById).patch(updateOne);

export default router;
