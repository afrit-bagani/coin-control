import { Request, Response } from "express";
import { z } from "zod";
import jwt from "jsonwebtoken";

// local import
import { prisma } from "../index";
import { ACCESS_TOKEN_EXPIRY, ACCESS_TOKEN_SECRET } from "../utils/config";
import { checkPassword, createUser, findUserByEmail } from "../db/auth.db";
import { getErrorMessage } from "../utils/error";
import { errorResponse, successResponse } from "../utils/response";

export const signUpUser = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  // 1. Getting input
  if (!(name && email && password)) {
    return res.status(400).json({
      success: false,
      message: "Provide all inputs",
    });
  }
  // 2. creating validation schema
  const registerScheme = z.object({
    name: z
      .string()
      .min(3, "Name must be atleast 3 character")
      .max(20, "Name can not 20 character long"),
    email: z.email("Invalid email").max(50, "email can not 50 character long"),
    password: z
      .string()
      .min(8, "Password must be 8 character long")
      .max(100, "Password can not be longer than 100 character"),
  });
  const parsedBody = registerScheme.safeParse(req.body);
  if (!parsedBody.success === true) {
    return res
      .status(400)
      .json(errorResponse("Input validation fail", parsedBody.error));
  }
  try {
    // 3. Creating user
    const user = await createUser({ name, email, password });
    return res
      .status(201)
      .json(successResponse("Check your email to verify.", { user: user }));
  } catch (error) {
    console.error("Error happen while registering user: \n", error);
    return res
      .status(500)
      .json(errorResponse("Internal server error", getErrorMessage(error)));
  }
};

export const signInUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  // 1. Creating Schema & validate the req object
  const loginSchema = z.object({
    email: z.email("Invalid email").max(50, "email can not 50 character long"),
    password: z
      .string()
      .min(8, "Password must be 8 character long")
      .max(100, "Password can not be longer than 100 character"),
  });
  const parsedData = loginSchema.safeParse(req.body);
  if (!parsedData.success === true) {
    return res
      .status(400)
      .json(errorResponse("Input validation failed", parsedData.error));
  }

  try {
    // 2. Check email exist or not, otherwise return the user
    const user = await findUserByEmail(email);
    if (!user?.id) {
      return res
        .status(409)
        .json(errorResponse("User does't exist, signup first"));
    } else if (user.isVerified === false) {
      return res
        .status(400)
        .json(
          errorResponse(
            "User is not verified verify email, sign up again with same email"
          )
        );
    }
    // 3. login user
    const isPassworsCorrect = await checkPassword(password, user.password);
    if (!isPassworsCorrect) {
      return res.status(400).json(errorResponse("Password is incorrect"));
    }

    // 4. Generate accessToekn
    const accessToken = jwt.sign({ userId: user.id }, ACCESS_TOKEN_SECRET, {
      expiresIn: ACCESS_TOKEN_EXPIRY,
    });
    // 5. remove password before sending to the client
    return res
      .status(200)
      .cookie("user", { id: user.id, name: user.name, email: user.email })
      .cookie("accessToken", accessToken, { maxAge: 180 * 24 * 60 * 60 * 1000 })
      .json(
        successResponse("User login successfully", {
          user: { id: user.id, name: user.name, email: user.email },
        })
      );
  } catch (error) {
    console.error("Error happen while logging user: \n", error);
    return res
      .status(500)
      .json(errorResponse("Internal server error", getErrorMessage(error)));
  }
};

export const verifyEmail = async (req: Request, res: Response) => {
  const { token } = req.query;
  if (!token) {
    return res.status(400).json(errorResponse("token is missing"));
  }

  try {
    // 1) Verify jwt
    const payload = jwt.verify(token as string, process.env.JWT_SECRET!) as {
      userId: number;
    };
    // 2) ensure user exist and token not expire
    const userExist = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, verificationToken: true, tokenExpires: true },
    });
    if (
      !userExist ||
      userExist.verificationToken !== token ||
      userExist.tokenExpires! < new Date()
    ) {
      return res.status(400).json(errorResponse("Invalid or expired token"));
    }
    // 3) mark verified, and clear token fields
    const user = await prisma.user.update({
      where: { id: userExist.id },
      data: { isVerified: true, verificationToken: null, tokenExpires: null },
      select: { name: true, email: true },
    });
    return res
      .status(200)
      .json(successResponse("Email verified!", { user: user }));
  } catch (error) {
    console.error("Error while verifying token: \n", error);
    return res
      .status(500)
      .json(errorResponse("Internal server error", getErrorMessage(error)));
  }
};
