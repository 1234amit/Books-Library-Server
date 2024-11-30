import express, { Express, Request, Response } from "express";
import cors from "cors";
import { config } from "./config";
import mongoose from "mongoose";
import { registerRoutes } from "./routes/indexRoute";

const PORT = config.server.port;
const app: Express = express();

app.use(express.json());
app.use(cors());

(async function startup() {
  try {
    await mongoose.connect(config.mongo.url, {
      w: "majority",
      retryWrites: true,
      authMechanism: "DEFAULT",
    });

    registerRoutes(app);

    app.get("/health", (req: Request, res: Response) => {
      res.status(200).json({ message: "Server is running properly." });
    });

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

    console.log("Successfully Connected to MongoDB Server...");
  } catch (error) {
    console.log("Could not make connection into Database");
  }
})();
