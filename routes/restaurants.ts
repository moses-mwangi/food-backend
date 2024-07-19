import express, { Router } from "express";
import {
  getAll,
  createOne,
  getOneRestaurant,
} from "../controllers/restaurantController";

const router: Router = express.Router();

router.route("/").get(getAll).post(createOne);
router.route("/:name").get(getOneRestaurant);

export default router;
