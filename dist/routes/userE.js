"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userExampl_1 = require("../controllers/userExampl");
const router = express_1.default.Router();
router.post("/signup", userExampl_1.signupUser);
router.post("/login", userExampl_1.loginUser);
router.get("/user/:id", userExampl_1.checkJwt, userExampl_1.getUser);
router.patch("/user/:id", userExampl_1.checkJwt, userExampl_1.updateUser);
router.delete("/user/:id", userExampl_1.checkJwt, userExampl_1.deleteUser);
exports.default = router;
