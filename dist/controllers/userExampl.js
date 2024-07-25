"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkJwt = exports.deleteUser = exports.updateUser = exports.getUser = exports.loginUser = exports.signupUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const express_oauth2_jwt_bearer_1 = require("express-oauth2-jwt-bearer");
const userModel_1 = __importDefault(require("../models/userModel"));
// Auth0 configuration
const authConfig = {
    issuerBaseURL: "https://YOUR_DOMAIN.auth0.com",
    audience: "YOUR_API_IDENTIFIER",
};
const checkJwt = (0, express_oauth2_jwt_bearer_1.auth)({
    audience: authConfig.audience,
    issuerBaseURL: authConfig.issuerBaseURL,
    tokenSigningAlg: "RS256",
});
exports.checkJwt = checkJwt;
const signupUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password, passwordConfirm, country, city, address, role, photo, } = req.body;
        // Check if the user already exists
        const existingUser = yield userModel_1.default.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        const user = new userModel_1.default({
            name,
            email,
            password,
            passwordConfirm,
            country,
            city,
            address,
            role,
            photo,
        });
        yield user.save();
        res.status(201).json({ user });
    }
    catch (error) {
        res.status(500).json({ message: error });
    }
});
exports.signupUser = signupUser;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        // Check if the user exists
        const user = yield userModel_1.default.findOne({ email }).select("+password");
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }
        // Check if the password is correct
        const isMatch = yield user.correctPassword(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }
        // Create and send JWT token
        const token = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "1d",
        });
        res.status(200).json({ token, user });
    }
    catch (error) {
        res.status(500).json({ message: error });
    }
});
exports.loginUser = loginUser;
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield userModel_1.default.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ user });
    }
    catch (error) {
        res.status(500).json({ message: error });
    }
});
exports.getUser = getUser;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield userModel_1.default.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ user });
    }
    catch (error) {
        res.status(500).json({ message: error });
    }
});
exports.updateUser = updateUser;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield userModel_1.default.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "User deleted" });
    }
    catch (error) {
        res.status(500).json({ message: error });
    }
});
exports.deleteUser = deleteUser;
