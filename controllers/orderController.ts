import { Request, Response, NextFunction } from "express";
import Stripe from "stripe";
import catchAsync from "../utils/catchAsync";
import Order from "../models/orderModel";
import AppError from "../utils/appError";

const stripe = new Stripe(
  "sk_test_51Pc94CCvj25n1SVem04vih54JceXmpjdD082Q0b0r82teXzVN2IgWfsuSGjFHdrEb2915MlljPfhG9jG4oxk6oml009dflPvGy"
);

const FRONTEND_URL = "http://localhost:3000";

interface CheckoutSessionRequest {
  items: {
    _id: string;
    type: string;
    image: string;
    description: string;
    rating: number;
    price: number;
  }[];
  address: {
    _id: string;
    name: string;
    email: string;
    country: string;
    city: string;
    address: string;
  };
  totalAmount: number;
}

export const testing = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const customer = await stripe.customers.create({
      email: "moses@example.com",
    });
    res.status(200).json({ customer });
  }
);

export const placeOrder = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { items, address, totalAmount }: CheckoutSessionRequest = req.body;

    // Create a new order
    const newOrder = new Order({
      status: "Food Processing",
      totalAmount,
      items,
      address,
      date: new Date(),
      payment: false,
    });

    //// Create line items for Stripe session
    const lineItems = items.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.type,
          images: [item.image],
          description: item.description,
        },
        unit_amount: item.price * 100,
      },
      quantity: 1,
    }));

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `https://food-delivery-five-eta.vercel.app/order-success?orderId=${newOrder._id}`,
      cancel_url: `http://localhost:3000/order-cancel?orderId=${newOrder._id}`,
      metadata: {
        orderId: newOrder._id!.toString(),
      },
    });

    if (!session.url) {
      return res.status(500).json({ message: "Error creating Stripe session" });
    }

    newOrder.paymentIntentId = session.payment_intent as any;
    await newOrder.save();

    res.status(200).json({ url: session.url });
  }
);

export const getOrders = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const order = await Order.find();
    res.status(200).json({ status: "success", data: { order } });
  }
);

export const getSingleOrder = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const order = await Order.findById(req.params.id);
    console.log(order);

    if (!order) {
      return next(
        new AppError("No document found with that ID :IvalidId", 404)
      );
    }

    res.status(200).json({ status: "success", data: { order } });
  }
);

export const updateOrder = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const updateData = req.body;

    const order = await Order.findByIdAndUpdate(req.params.id, updateData, {
      new: true, // Return the updated document
      runValidators: true, // Run schema validators on update
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ status: "success", data: { order } });
  }
);

export const deleteOrder = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const order = await Order.findByIdAndDelete(req.params.id);

    if (!order) {
      return next(new AppError("No tour found with that ID :IvalidId", 404));
    }

    res.json(2004).json({ status: "success", data: null });
  }
);
