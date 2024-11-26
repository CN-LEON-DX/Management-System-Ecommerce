import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import * as jwtToken from "../../helpers/jwtToken.helper";

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

const authMiddleware = (req: Request, res: Response, next: NextFunction): Response | void => {
  const token = req.headers["authorization"] as string | undefined;
  if (!token) {
    return res.status(403).json({ message: "Access denied, token missing!" });
  }

  jwt.verify(token, jwtToken.generateAccessToken(req.user), (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token!" });
    }
    if (user) {
      req.user = user; // Attach the decoded user to the request
    }
    next();
  });
};

export default authMiddleware;
