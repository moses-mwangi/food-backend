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
exports.forgotPassword = exports.protect = exports.login = exports.signup = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const userModel_1 = __importDefault(require("../models/userModel"));
const appError_1 = __importDefault(require("../utils/appError"));
const signToken = (id) => {
    return jsonwebtoken_1.default.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE_IN,
    });
};
const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);
    const cookieOptions = {
        expires: new Date(Date.now() +
            Number(process.env.JWT_COOKIE_EXPIRE_IN) * 24 * 60 * 60 * 1000),
        httpOnly: true,
    };
    if (process.env.NODE_ENV === "production")
        cookieOptions.secure = true;
    res.cookie("jwt", token, cookieOptions);
    user.password = undefined;
    // user.passwordChangedAt = undefined;
    res.status(statusCode).json({
        status: "success",
        token,
        data: {
            user,
        },
    });
};
/////FIRST SOLUTION TO SIGNIN IN USER
// export const signup = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const newUser = await User.create(req.body);
//     createSendToken(newUser, 200, res);
//   }
// );
exports.signup = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password, passwordConfirm, country, city, address, role, photo, } = req.body;
    let user = yield userModel_1.default.findOne({ email });
    if (user) {
        return res.status(400).json({ errors: [{ msg: "User already exists" }] });
    }
    user = new userModel_1.default({
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
    res.status(200).json({
        status: "success",
        data: { user },
    });
}));
exports.login = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new appError_1.default("Please provide an email & password to logIn", 400));
    }
    const user = yield userModel_1.default.findOne({ email }).select("+password");
    if (!user || !(yield user.correctPassword(password, user.password))) {
        return next(new appError_1.default("Invalid email or password", 401));
    }
    createSendToken(user, 200, res);
    req.user = user;
}));
///////////////////protect route///////////////////
const jwtVerify = (token, secret) => {
    return new Promise((resolve, reject) => {
        jsonwebtoken_1.default.verify(token, secret, (err, decoded) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(decoded);
            }
        });
    });
};
exports.protect = (0, catchAsync_1.default)(function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        let token;
        if (req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
        }
        else if (req.cookies.jwt) {
            token = req.cookies.jwt;
        }
        if (!token) {
            return next(new appError_1.default("You are not logged in! Please log in to get access.", 401));
        }
        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is not defined");
        }
        const decoded = yield jwtVerify(token, process.env.JWT_SECRET);
        const currentUser = yield userModel_1.default.findById(decoded.id);
        if (!currentUser) {
            return next(new appError_1.default("The user belonging to this token does no longer exist.", 401));
        }
        console.log(currentUser);
        req.user = currentUser;
        next();
    });
});
///////////////////////////////
exports.forgotPassword = (0, catchAsync_1.default)(function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        res.status(200).json({
            status: "success",
            data: {
                data: "forgotpassword",
            },
        });
    });
});
