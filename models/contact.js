import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phoneNo: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    creater: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    teamId: {
      type: Schema.Types.ObjectId,
      ref: "Team",
      default: null,
    },
  },
  { timestamps: true }
);

export const Contact = mongoose.model("Contact", contactSchema);
