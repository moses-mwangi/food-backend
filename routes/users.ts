import express, { Router } from "express";
import { getAll, getMe, getUser } from "../controllers/userController";
import { login, signup, protect } from "../controllers/authController.";

const router: Router = express.Router();

router.route("/signup").post(signup);
router.route("/login").post(login);
router.get("/me", protect, getMe);

router.get("/logout", (req, res) => {
  res.clearCookie("jwt", { path: "/" });
  res.status(200).send("Logged out inback side");
});

router.route("/").get(getAll);
router.route("/:id").get(protect, getUser);

export default router;
