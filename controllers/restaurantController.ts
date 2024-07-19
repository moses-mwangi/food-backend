import AppError from "../utils/appError";
import catchAsync from "../utils/catchAsync";
import Restaurant from "./../models/restaurantModel";
import { Request, Response, NextFunction } from "express";

const getAll = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = await Restaurant.find();

    res.status(200).json({
      status: "success",
      results: data.length,
      data: { data },
    });
  }
);

const getOneRestaurant = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name } = req.params;

    const restaurant = await Restaurant.findOne({ restName: name });

    if (!restaurant) {
      return next(new AppError("No restaurant found with that name", 404));
    }

    res.status(200).json({
      status: "success",
      data: { restaurant },
    });
  }
);

const createOne = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = await Restaurant.create(req.body);
    res.status(201).json({
      status: "success",
      data: { data },
    });
  }
);
export { getAll, createOne, getOneRestaurant };
