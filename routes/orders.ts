import express, { Router } from "express";
import { getAll, createOne } from "../controllers/userController";

const router: Router = express.Router();

router.route("/").get(getAll).post(createOne);

export default router;
