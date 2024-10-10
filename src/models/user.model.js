import mongoose from "mongoose";
import validator from "validator";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      index: true,
    },
    lastName: {
      type: String,
      required: true,
      index: true,
    },
    email: {
      type: String,
      validate: {
        validator: validator.isEmail,
        message: "EMAIL_IS_NOT_VALID",
      },
      lowercase: true,
      unique: true,
      required: true,
      index: true,
    },
    businessName: {
      type: String,
      default: null,
    },
    walletAddress: {
      type: String,
      default: null,
    },
    files: {
      identification: {
        type: String,
        default: null,
      },
      businessLicense: {
        type: String,
        default: null,
      },
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      required: true,
      default: "MERCHANT",
      ref: "Roles",
    },
  },
  {
    collection: "User",
    versionKey: false,
    timestamps: true,
  }
);
userSchema.plugin(mongooseAggregatePaginate);

const User = mongoose.model("User", userSchema);

export default User;
