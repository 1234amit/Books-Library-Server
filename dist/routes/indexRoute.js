"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerRoutes = registerRoutes;
const AuthRoute_1 = __importDefault(require("./AuthRoute"));
function registerRoutes(app) {
    app.use("/auth", AuthRoute_1.default);
}
