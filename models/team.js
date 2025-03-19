import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";

const teamSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required:true,
      },
      
    ],
    creater: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    permissions: {
      canEdit: {
        type: Boolean,
        default: false
      },
      canDelete: {
        type: Boolean,
        default: false
      },
      canCreate:{
        type: Boolean,
        default: false
      }
    }
  },
  { timestamps: true }
);

export const Team = mongoose.model("Team", teamSchema);
