import { IUserModel } from "../daos/UserDao";
import { IUser } from "../models/User";
import { login, register } from "../service/UserServices";
import { Request, Response } from "express";
import { InvalidUsernameOrPasswordError } from "../utils/LibraryError";
import jwt from "jsonwebtoken";

// Generate Access Token
const generateAccessToken = (user: Partial<IUserModel>) => {
  return jwt.sign(
    { _id: user._id, type: user.type, email: user.email },
    process.env.JWT_ACCESS_SECRET!,
    { expiresIn: "7d" } // Access token valid for 15 minutes
  );
};

// Generate Refresh Token
const generateRefreshToken = (user: Partial<IUserModel>) => {
  return jwt.sign(
    { _id: user._id, type: user.type, email: user.email },
    process.env.JWT_REFRESH_SECRET!,
    { expiresIn: "7d" } // Refresh token valid for 7 days
  );
};

async function handleRegister(req: Request, res: Response) {
  const user: IUser = req.body;

  try {
    const registerUser = await register(user);
    res.status(201).json({
      message: "User registered successfully",
      user: {
        _id: registerUser._id,
        type: registerUser.type,
        firstName: registerUser.firstName,
        lastName: registerUser.lastName,
        email: registerUser.email,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      message: "Unable to register user at this moment",
      error: error.message,
    });
  }
}

async function handleLogin(req: Request, res: Response) {
  const credentials = req.body;

  try {
    const loggedIn: IUserModel = await login(credentials);
    const accessToken = generateAccessToken(loggedIn);
    const refreshToken = generateRefreshToken(loggedIn);

    res.status(200).json({
      message: "User logged in successfully",
      user: {
        _id: loggedIn._id,
        type: loggedIn.type,
        firstName: loggedIn.firstName,
        lastName: loggedIn.lastName,
        email: loggedIn.email,
      },
      tokens: {
        accessToken,
        refreshToken,
      },
    });
  } catch (error: any) {
    if (error instanceof InvalidUsernameOrPasswordError) {
      res.status(401).json({
        message: "Unable to login at this time. Please try again.",
        error: error.message,
      });
    } else {
      res.status(500).json({
        message: "Unable to login at this moment",
        error: error.message,
      });
    }
  }
}

export default { handleRegister, handleLogin };
