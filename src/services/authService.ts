import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../utils/prisma";
import "dotenv/config";

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export async function register(data: {
  name: string;
  email: string;
  password: string;
  role?: "VIEWER" | "ANALYST" | "ADMIN";
}) {
  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (existing) throw { statusCode: 409, message: "Email already in use" };

  const hashed = await bcrypt.hash(data.password, 10);

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashed,
      role: data.role || "VIEWER",
    },
  });

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });

  const { password: _, ...safeUser } = user;
  return { user: safeUser, token };
}

export async function login(data: { email: string; password: string }) {
  const user = await prisma.user.findUnique({ where: { email: data.email } });
  if (!user) throw { statusCode: 401, message: "Invalid email or password" };

  if (user.status === "INACTIVE")
    throw { statusCode: 403, message: "Account is inactive" };

  const match = await bcrypt.compare(data.password, user.password);
  if (!match) throw { statusCode: 401, message: "Invalid email or password" };

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });

  const { password: _, ...safeUser } = user;
  return { user: safeUser, token };
}