import jwt from "jsonwebtoken";

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.sendStatus(401); // If there's no token, return a 401 Unauthorized status
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(403); // If the token is invalid, return a 403 Forbidden status
    }

    req.user = user; // If the token is valid, store the user info in the request object
    next();
  });
};
