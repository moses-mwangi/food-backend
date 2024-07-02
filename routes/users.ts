import express, { Router } from "express";
// const userController = require("../controllers/userController");
import { getAll, createOne } from "../controllers/userController";

const router: Router = express.Router();

router.route("/signup").post(createOne);

router.route("/").get(getAll).post(createOne);

export default router;
