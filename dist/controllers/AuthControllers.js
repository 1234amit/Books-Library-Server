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
Object.defineProperty(exports, "__esModule", { value: true });
const UserServices_1 = require("../service/UserServices");
const LibraryError_1 = require("../utils/LibraryError");
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
            res.status(200).json({
                message: "User logged in successfully",
                user: {
                    _id: loggedIn._id,
                    type: loggedIn.type,
                    firstName: loggedIn.firstName,
                    lastName: loggedIn.lastName,
                    email: loggedIn.email,
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
