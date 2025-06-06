import express, { Request, Response } from "express";
import authRouter from "./routers/auth.router";
import dotenv from "dotenv";
import cors from "cors";
import profilesRouter from "./routers/profiles.router";
import cookiesParser from "cookie-parser";
import kpiRouter from "./routers/kpi.router";
import { access } from "fs";

const app = express();

const PORT = process.env.PORT || 4999;

dotenv.config(); // call the dotenv package to use the env variables

app.use(express.json()); // middleware for parsing body of requests

app.use(cookiesParser()); // allows us to read and set cookies

// Define CORS options (fixed)
const corsOptions = {
  origin: [
    "http://localhost:3000",
    "http://localhost:3001",
    "https://ws-central-frontend.vercel.app",
    "https://ws-central-training.vercel.app",
  ], // specify the allowed domains
  methods: ["GET", "POST", "PUT", "DELETE"], // allowed methods
  allowedHeaders: ["Content-Type", "Authorization"], // allowed headers
  credentials: true, // allow cookies to be sent across domains
};

// Enable CORS for all routes (if you want it to be global)
app.use(cors(corsOptions));

app.get("/", (req: Request, res: Response) => {
  res.send("hello, central-systems server running");
});

app.use("/cms/api/auth", authRouter);
app.use("/cms/api/profiles", profilesRouter);
app.use("/cms/api/departments", kpiRouter);

// Graceful shutdown - Disconnect Prisma Clients when the server shuts down
process.on("SIGINT", async () => {
  // console.log('Closing Prisma clients...');
  // await mongoDbClient.$disconnect();  // Disconnect MongoDB client
  // await postgresClient.$disconnect(); // Disconnect PostgreSQL client
  process;
});

app.listen(PORT, () => {
  console.log("central-systems server running on port ", PORT);
});
