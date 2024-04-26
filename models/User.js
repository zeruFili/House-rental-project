const mongoose = require("mongoose");
// const {isEmail} = require( "validator" );
const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      lowercase: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minlength: [8, "Password must be at least 8 characters"],
    },
    username: {
      type: String,
      // required:true,
      unique: true,
    },
    phoneNumber: {
      type: Number,
      // required:true
    },
    role: {
      type: String,
      enum: ["tenant", "admin", "landlord", "superadmin", "broker"],
      // required:true,
      default: "tenant",
    },
    mainAddress: {
      type: String,
      // required:true
    },

    broker: {
      commissionRate: { type: Number, default: 0 },
      rating: { type: Number, default: 0 },
    },
    landlord: {
      rating: { type: Number, default: 0 },
    },
    tendent: {
      rating: { type: Number, default: 0 },
    },
  },

  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
