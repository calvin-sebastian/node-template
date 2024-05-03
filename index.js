import express from "express";
import dotenv from "dotenv";
import { initializeTables } from "./startup/initialize-tables.js";
import USER_ROUTES from "./routes/user-routes.js";

// Load environment variables from .env file
dotenv.config();

// Set up Express application
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Route tracking middleware
app.use((req, res, next) => {
  console.log(`Endpoint hit: ${req.path}`);
  next();
});

// Initialize tables on server start
initializeTables();

// Routes
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
  console.table({ server: "Active", port: PORT });
});
