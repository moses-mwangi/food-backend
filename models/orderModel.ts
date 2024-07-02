import mongoose, { Document, Schema } from "mongoose";
import validator from "validator";

interface IUser extends Document {}

const orderSchema: Schema<IUser> = new Schema({});

const Order = mongoose.model<IUser>("Order", orderSchema);

export default Order;
