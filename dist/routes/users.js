"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const authController_1 = require("../controllers/authController.");
const router = express_1.default.Router();
router.route("/signup").post(authController_1.signup);
router.route("/login").post(authController_1.login);
router.get("/me", authController_1.protect, userController_1.getMe);
router.get("/logout", (req, res) => {
    res.clearCookie("jwt", { path: "/" });
    res.status(200).send("Logged out inback side");
});
router.route("/").get(userController_1.getAll);
router.route("/:id").get(authController_1.protect, userController_1.getUser);
exports.default = router;
