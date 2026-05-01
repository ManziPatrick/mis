import mongoose, { Document, Schema } from "mongoose";

interface ISession extends Document {
  userId: mongoose.Types.ObjectId;
  resetPasswordToken: string;
  tokenExpirationDate: Date;
  otp: string;
  otpExpire: Date;
  createdAt: Date;
  updatedAt: Date;
}

const SessionSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpire: {
      type: Date,
    },
    otp: {
      type: String,
    },
    otpExpire: {
      type: Date,
    }
  },
  { timestamps: true }
);

export const SessionModel = mongoose.model<ISession>("Session", SessionSchema);
