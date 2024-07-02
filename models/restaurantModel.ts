import mongoose, { model, Schema } from "mongoose";

const restaurantSchema: Schema = new Schema({
  restaurantName: {
    type: String,
    select: true,
  },
});

const Restaurant = model("Restaurant", restaurantSchema);

export default Restaurant;
