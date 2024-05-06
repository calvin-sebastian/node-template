import express from "express";
import USER_ROUTES from "./routes/user-routes.js";
import { logTable } from "./console/log-functions.js";
import { checkDatabaseConnection } from "./startup/verify-services.js";
import fs from "fs";
import path from "path";
import { headers } from "./console/log-functions.js";

// Start up variables
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

/// Test database connection if .env file exists otherwise prompt user to run create .env script
if (!fs.existsSync(envPath)) {
  logTable(headers, [
    ".env",
    "Error",
    "Run 'npm run init-env' or include a .env file in the root directory of the project",
  ]);
  process.exit(1);
} else {
  services.push([".env", "Active", "Using existing .env file"]);
  try {
    await checkDatabaseConnection();

    services.push([
      "Database",
      "Active",
      `Connected to ${process.env.DB_NAME}`,
    ]);
  } catch (error) {
    if (error.code === "ER_BAD_DB_ERROR") {
      logTable(headers, [
        "Database",
        "Error",
        "Run 'npm run init-db' or manually set up your database",
      ]);
      process.exit(1);
    } else {
      console.error(`Error connecting to database: ${error.message}`);
    }
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
  res.status(err.statusCode || 500).json({
    error: err.message || "An unknown error occurred processing your request",
  });
});

// Start the server
app.listen(PORT, () => {
  logTable(headers, ...services, [
    "Server",
    "Active",
    `Running on port ${PORT}`,
  ]);
});
