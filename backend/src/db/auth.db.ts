import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { prisma } from "../index";
import { FRONTEND_URL } from "../config";
import { sendVerificationEmail } from "../utils/mailer";

type CreateUserType = {
  name: string;
  email: string;
  password: string;
};

export const findUserByEmail = async (email: string) => {
  return prisma.user.findUnique({
    where: { email },
  });
};

/**
 * Create user
 */
export const createUser = async ({ name, email, password }: CreateUserType) => {
  // 1) Check user exist or not
  const user = await findUserByEmail(email);
  if (!user) {
    // 2) Hass the password
    const hasshedPassword = await bcrypt.hash(password, 5);

    // 3) Create user
    const user = await prisma.user.create({
      data: {
        name: name,
        email: email,
        password: hasshedPassword,
      },
      select: {
        id: true,
      },
    });

    // 3) generate one time JWTtoken to verify email
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
      expiresIn: "1h",
    });

    // 4) Save the token to user to verify later
    const userDeatils = await prisma.user.update({
      where: { id: user.id },
      data: {
        verificationToken: token,
        tokenExpires: new Date(Date.now() + 3600_000), // '_' is just t understand better like ','
      },
      select: {
        id: true,
      },
    });

    // 5) send email with link to your frontend route,
    const verifyLink = `${FRONTEND_URL}/verify?token=${token}`;
    await sendVerificationEmail(email, verifyLink);

    return userDeatils;
  } else if (user.isVerified === false) {
    const hasshedPassword = await bcrypt.hash(password, 5);

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
      expiresIn: "1h",
    });

    const userDeatils = await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hasshedPassword,
        verificationToken: token,
        tokenExpires: new Date(Date.now() + 3600_000),
      },
      select: {
        id: true,
      },
    });
    const verifyLink = `${FRONTEND_URL}/verify?token=${token}`;
    await sendVerificationEmail(email, verifyLink);
    return userDeatils;
  } else if (user.isVerified === true) {
    throw new Error("User exist already, try with different email");
  }
};

export const checkPassword = async (
  plainTextPassword: string,
  hasshedPassword: string
) => {
  return bcrypt.compare(plainTextPassword, hasshedPassword);
};
