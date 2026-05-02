// src/database/model/user.ts
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role',
    required: true,
  },
  birthDate: {
    type: Date,
  },
  gender: {
    type: String,
  },
  dataOfJoining: {
    type: Date,
    default: Date.now,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  address: {
    type: String,
  },
  phoneNumber: {
    type: String,
  },
  iDNumber: {
    type: Number,
  },
  profilePicture: {
    type: String,
  },
  signatureUrl: {
    type: String,
  },
  stampUrl: {
    type: String,
  },
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);
