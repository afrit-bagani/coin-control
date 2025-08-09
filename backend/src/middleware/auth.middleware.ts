import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

// Local import
import { prisma } from "../index";
import { ACCESS_TOKEN_SECRET } from "../utils/config";
import { errorResponse } from "../utils/response";
import { getErrorMessage } from "../utils/error";

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies?.accessToken;
  if (!token) return res.status(400).json(errorResponse("Token is required"));
  try {
    const decodedToken = jwt.verify(token as string, ACCESS_TOKEN_SECRET) as {
      userId: number;
    };

    const user = await prisma.user.findUnique({
      where: { id: decodedToken.userId },
    });
    if (!user) return res.status(402).json(errorResponse("Token is invalid"));
    req.user = user;
    next();
  } catch (error) {
    console.error("Error while decodeing token: \n", error);
    return res
      .status(500)
      .json(errorResponse("Internal server error", getErrorMessage(error)));
  }
};
