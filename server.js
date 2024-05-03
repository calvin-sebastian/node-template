import express from "express";
import { initializeTables } from "./startup/initialize-tables.js";
import USER_ROUTES from "./routes/user-routes.js";
import { logTable } from "./console/log-functions.js";
import { checkDatabaseConnection } from "./startup/verify-services.js";
import fs from "fs";
import path from "path";

// Start up variables
const headers = ["Service", "Status", "Message"];
const services = [];
const currentDir = process.cwd();
const envPath = path.resolve(currentDir, ".env");
const PORT = process.env.PORT || 3000;

// Set up Express application
const app = express();

// JSON body parsing middleware
app.use(express.json());

// Route tracking middleware
app.use((req, res, next) => {
  console.log(`Endpoint hit: ${req.path}`);
  next();
});

// Test database connection if .env file exists otherwise prompt user to run create .env script
if (!fs.existsSync(envPath)) {
  services.push([".env", "Error", "Run 'npm run env'"]);
} else {
  services.push([".env", "Active", "Using existing .env file"]);
  try {
    const connected = await checkDatabaseConnection();
    if (connected) {
      services.push([...connected]);

      // Check database for required tables and initialize them if they dont exist
      await initializeTables();
    }
  } catch (error) {
    console.error(error);
  }
}

// Test Route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// User routes
app.use("/user", USER_ROUTES);

// Error handling middleware
app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({ error: err.message });
});

// Start the server
app.listen(PORT, () => {
  logTable(headers, ...services, [
    "Server",
    "Active",
    `Running on port ${PORT}`,
  ]);
});
