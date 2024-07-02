// const User = require("./../models/userModel");
import AppError from "../utils/appError";
import catchAsync from "../utils/catchAsync";
import User from "./../models/userModel";
import { Request, Response, NextFunction } from "express";

const getAll = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = await User.find();

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
export { getAll, createOne };
