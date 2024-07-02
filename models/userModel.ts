import mongoose, { Document, Schema } from "mongoose";
import validator from "validator";

interface IUser extends Document {
  name: string;
  email: string;
  role: string;
  photo?: string;
  password: string;
  passwordConfirm: string;
  passwordChangedAt?: Date;
  active?: boolean;
}

const userSchema: Schema<IUser> = new Schema({
  name: {
    type: String,
    required: [true, "All users should have a name"],
  },
  email: {
    type: String,
    unique: true,
    required: [true, "User email is required"],
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  role: {
    type: String,
    enum: ["customer", "staff", "admin"],
    default: "customer",
  },
  photo: {
    type: String,
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minLength: 8,
  },
  passwordConfirm: {
    type: String,
    required: [true, "User password is required"],
    validate: {
      validator: function (this: IUser, val: string) {
        return val === this.password;
      },
      message: "Passwords are not the same",
    },
  },
  passwordChangedAt: {
    type: Date,
    default: Date.now,
  },
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

const User = mongoose.model<IUser>("User", userSchema);

export default User;
