// Import the cors library
import cors from "cors";

// Define the CORS options
const corsOptions = {
  origin:
    process.env.NODE_ENV === "production"
      ? "http://changethisurl.extension"
      : "http://localhost:3000",
  optionsSuccessStatus: 200,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

// Create a CORS middleware
const corsPolicy = cors(corsOptions);

export default corsPolicy;
