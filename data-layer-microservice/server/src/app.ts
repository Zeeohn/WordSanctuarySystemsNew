import express, { Request, Response } from "express";
import { mongoDbClient, postgresClient } from "./db_connections/prismaClients";
import mongoDbRouter from "./routes/mongodb/mongoDbRouter";
import postgresRouter from "./routes/postgres/postgresRouter";
import kpiRouter from "./routes/kpi/kpi.router";
import accountsRouter from "./routes/accounts/accounts.router";
import dotenv from "dotenv";

const app = express();
dotenv.config(); // allow us to use env variables

const PORT = process.env.PORT || 5000;
app.use(express.json()); // Middleware for parsing JSON bodies

app.get("/", (req: Request, res: Response) => {
  res.status(200).send("hello, database microservice running");
});

// Define routes for the app
app.use("/api/data-layer/database/mongodb", mongoDbRouter);
app.use("/api/data-layer/database/postgres", postgresRouter);
app.use("/api/data-layer/kpi", kpiRouter);
app.use("/api/data-layer/accounts", accountsRouter);

function keepAlive() {
  const url = process.env.DATA_LAYER_SYSTEMS_BASE_API + "/";
  setInterval(() => {
    fetch(url)
      .then(() => console.log("Ping successful"))
      .catch((err) => console.error("Ping failed:", err));
  }, 13 * 60 * 1000); // Every 13 minutes (Render times out after 15 min of inactivity)
}

// Call this function when the app starts
keepAlive();

// Graceful shutdown - Disconnect Prisma Clients when the server shuts down
process.on("SIGINT", async () => {
  console.log("Closing Prisma clients...");
  await mongoDbClient.$disconnect(); // Disconnect MongoDB client
  await postgresClient.$disconnect(); // Disconnect PostgreSQL client
  process.exit(0);
});

app.listen(PORT, () => {
  console.log(`database microservice running on ${PORT}`);
});
