import express from "express";
import {
  signupUser,
  loginUser,
  getUser,
  updateUser,
  deleteUser,
  checkJwt,
} from "../controllers/userExampl";

const router = express.Router();

router.post("/signup", signupUser);
router.post("/login", loginUser);
router.get("/user/:id", checkJwt, getUser);
router.patch("/user/:id", checkJwt, updateUser);
router.delete("/user/:id", checkJwt, deleteUser);

export default router;
