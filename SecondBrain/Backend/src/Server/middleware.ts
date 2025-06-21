require('dotenv').config({ path: `Backend/../../.env` })
import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export const jwt_key = process.env.JWT_PASS!;

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export const userMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const token = req.headers.token as string | undefined;

    if (!token) {
      res.status(401).json({ message: 'Token missing' });
      return;
    }

    const decoded = jwt.verify(token, jwt_key) as JwtPayload;

    if (decoded && typeof decoded === 'object' && decoded.id) {
      req.userId = decoded.id;
      next(); 
    } else {
      res.status(403).json({ message: 'Invalid token payload' });
    }
  } catch (err) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};
