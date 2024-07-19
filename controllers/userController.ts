// const User = require("./../models/userModel");
import AppError from "../utils/appError";
import catchAsync from "../utils/catchAsync";
import User from "./../models/userModel";
import { Request, Response, NextFunction } from "express";

const getAll = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = await User.find().select("-__v");

    res.status(200).json({
      status: "success",
      results: data.length,
      data: { data },
    });
  }
);

const createOne = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password, passwordConfirm, role, photo } = req.body;

    if (!name || !email || !password || !passwordConfirm) {
      return next(
        new AppError(
          "Please provide name, email, password, and password confirmation",
          400
        )
      );
    }

    const newUser = await User.create({
      name,
      email,
      password,
      passwordConfirm,
      role,
      photo,
    });

    res.status(201).json({
      status: "success",
      data: {
        user: newUser,
      },
    });
  }
);
export const getMe = (req: Request, res: Response, next: NextFunction) => {
  res
    .status(200)
    .json({ status: "success", data: { user: (req as any).user } });
};

export const getUser = catchAsync(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const user = await User.findById(req.params.id);
  console.log(user);

  if (!user) {
    return next(new AppError("No document found with that ID :IvalidId", 404));
  }

  if (user) {
    res.status(200).json({
      status: "success",
      data: { data: user },
    });
  } else {
    res.status(200).json({
      status: "success",
      message: "The InvalidId",
    });
  }
});

export { getAll, createOne };
