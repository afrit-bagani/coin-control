import express from "express";
import {
  signInUser,
  signUpUser,
  verifyEmail,
} from "../controllers/auth.controller";

export const authRouter = express.Router();

authRouter.post("/signup", signUpUser);
authRouter.post("/signin", signInUser);
authRouter.post("/verify", verifyEmail);
