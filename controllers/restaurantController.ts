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

const getOneRestaurantById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name } = req.params;

    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      return next(new AppError("No restaurant found with that id", 404));
    }

    res.status(200).json({
      status: "success",
      data: { restaurant },
    });
  }
);

const createOne = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const newRestaurant = await Restaurant.create(req.body);

    res.status(200).json({
      status: "success",
      data: {
        data: newRestaurant,
      },
    });
  }
);

const updateOne = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name } = req.params;

    const newRestaurant = await Restaurant.findOneAndUpdate(
      { restName: name },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      status: "success",

      data: {
        data: newRestaurant,
      },
    });
  }
);

const deleteRestaurant = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name } = req.params;

    // const store = await Restaurant.findByIdAndDelete(req.params.id);
    const store = await Restaurant.findOneAndDelete({ restName: name });

    if (!store) {
      return next(new AppError("No tour found with that ID :IvalidId", 404));
    }

    res.status(204).json({
      status: "success",
      data: null,
    });
  }
);

export {
  getAll,
  createOne,
  deleteRestaurant,
  getOneRestaurant,
  getOneRestaurantById,
  updateOne,
};
