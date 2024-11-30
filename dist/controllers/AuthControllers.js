"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const UserServices_1 = require("../service/UserServices");
const LibraryError_1 = require("../utils/LibraryError");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Generate Access Token
const generateAccessToken = (user) => {
    return jsonwebtoken_1.default.sign({ _id: user._id, type: user.type, email: user.email }, process.env.JWT_ACCESS_SECRET, { expiresIn: "7d" } // Access token valid for 15 minutes
    );
};
// Generate Refresh Token
const generateRefreshToken = (user) => {
    return jsonwebtoken_1.default.sign({ _id: user._id, type: user.type, email: user.email }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" } // Refresh token valid for 7 days
    );
};
function handleRegister(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = req.body;
        try {
            const registerUser = yield (0, UserServices_1.register)(user);
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
        }
        catch (error) {
            res.status(500).json({
                message: "Unable to register user at this moment",
                error: error.message,
            });
        }
    });
}
function handleLogin(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const credentials = req.body;
        try {
            const loggedIn = yield (0, UserServices_1.login)(credentials);
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
        }
        catch (error) {
            if (error instanceof LibraryError_1.InvalidUsernameOrPasswordError) {
                res.status(401).json({
                    message: "Unable to login at this time. Please try again.",
                    error: error.message,
                });
            }
            else {
                res.status(500).json({
                    message: "Unable to login at this moment",
                    error: error.message,
                });
            }
        }
    });
}
exports.default = { handleRegister, handleLogin };
