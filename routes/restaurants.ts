import express, { Router } from "express";
import {
  getAll,
  createOne,
  getOneRestaurant,
  deleteRestaurant,
  updateOne,
} from "../controllers/restaurantController";

const router: Router = express.Router();

router.route("/").get(getAll).post(createOne);
router
  .route("/:name")
  .get(getOneRestaurant)
  .patch(updateOne)
  .delete(deleteRestaurant);
// router.route("/:id").get(getOneRestaurantById).patch(updateOne);

export default router;
