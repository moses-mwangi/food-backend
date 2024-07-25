"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const restaurantController_1 = require("../controllers/restaurantController");
const router = express_1.default.Router();
router.route("/").get(restaurantController_1.getAll).post(restaurantController_1.createOne);
router.route("/:name").get(restaurantController_1.getOneRestaurant).patch(restaurantController_1.updateOne);
// router.route("/:id").get(getOneRestaurantById).patch(updateOne);
exports.default = router;
