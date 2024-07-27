import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import catchAsync from "../utils/catchAsync";
import User, { IUser } from "../models/userModel";
import AppError from "../utils/appError";

interface AuthenticatedRequest extends Request {
  user?: IUser;
}

const signToken = (id: string): string => {
  return jwt.sign({ id }, process.env.JWT_SECRET as jwt.Secret, {
    expiresIn: process.env.JWT_EXPIRE_IN,
  });
};

const createSendToken = (
  user: IUser,
  statusCode: number,
  res: Response
): void => {
  const token = signToken(user._id);

  const cookieOptions: {
    expires: Date;
    httpOnly: boolean;
    secure?: boolean;
  } = {
    expires: new Date(
      Date.now() +
        Number(process.env.JWT_COOKIE_EXPIRE_IN) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  res.cookie("jwt", token, cookieOptions);
  (user.password as unknown) = undefined;
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

export const signup = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      name,
      email,
      password,
      passwordConfirm,
      country,
      city,
      address,
      role,
      photo,
    } = req.body;

    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ errors: [{ msg: "User already exists" }] });
    }

    user = new User({
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

    await user.save();

    res.status(200).json({
      status: "success",

      data: { user },
    });
  }
);

export const login = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(
        new AppError("Please provide an email & password to logIn", 400)
      );
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.correctPassword(password, user.password))) {
      return next(new AppError("Invalid email or password", 401));
    }

    createSendToken(user, 200, res);

    (req as any).user = user;
  }
);

///////////////////protect route///////////////////
const jwtVerify = (token: string, secret: string) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        reject(err);
      } else {
        resolve(decoded);
      }
    });
  });
};

export const protect = catchAsync(async function (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(
      new AppError("You are not logged in! Please log in to get access.", 401)
    );
  }

  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }

  const decoded: any = await jwtVerify(token, process.env.JWT_SECRET);

  const currentUser: IUser | null = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        "The user belonging to this token does no longer exist.",
        401
      )
    );
  }
  console.log(currentUser);
  (req as any).user = currentUser;
  next();
});
///////////////////////////////

export const forgotPassword = catchAsync(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  res.status(200).json({
    status: "success",
    data: {
      data: "forgotpassword",
    },
  });
});
