// src/helper/validation.ts
import { randomBytes } from "crypto";
import bcrypt from "bcrypt";
import jwt, {JwtPayload} from "jsonwebtoken";

export const generatePassword = async (): Promise<string> => {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const specialChars = "!@#$%&";
    const characters = letters + numbers + specialChars;
    const charactersLength = characters.length;
  
    const randomLetter = letters[Math.floor(Math.random() * letters.length)];
    const randomNumber = numbers[Math.floor(Math.random() * numbers.length)];
    const randomSpecialChar = specialChars[Math.floor(Math.random() * specialChars.length)];
  
    const remainingLength = 8;
    let remainingChars = '';
    for (let i = 0; i < remainingLength; i++) {
      remainingChars += characters[Math.floor(Math.random() * charactersLength)];
    }
  
    const password = randomLetter + randomNumber + randomSpecialChar + remainingChars;
    return password.split('').sort(() => Math.random() - 0.5).join('');
  };
  

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

export const comparePassword = async (plainPassword: string, hashedPassword: string): Promise<boolean> => {
    if (!plainPassword || !hashedPassword) {
        throw new Error("Both plainPassword and hashedPassword are required.");
    }
    return bcrypt.compare(plainPassword, hashedPassword);
};

const generateRandomCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const generateOTP = () => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpire = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
  return { otp, otpExpire };
};

export const generateToken = async (id: string) => {
  if (!process.env.JWT_SECRET) {
    return "JWT_SECRET is not defined";
  }
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

export const decodeToken = async(token: string) => {
  if (!process.env.JWT_SECRET) {
    return "JWT_SECRET is not defined";
  }
  return jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;
};
