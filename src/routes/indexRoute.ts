import { Express, Request, Response } from "express";
import authRoutes from "./AuthRoute";

export function registerRoutes(app: Express) {
  app.use("/auth", authRoutes);
}
