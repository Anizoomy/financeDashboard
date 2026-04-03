import { Request, Response } from "express";
import { register, login } from "../services/authService";

export async function registerController(req: Request, res: Response) {
  try {
    const result = await register(req.body);
    res.status(201).json(result);
  } catch (err: any) {
    res.status(err.statusCode || 500).json({ error: err.message });
  }
}

export async function loginController(req: Request, res: Response) {
  try {
    const result = await login(req.body);
    res.json(result);
  } catch (err: any) {
    res.status(err.statusCode || 500).json({ error: err.message });
  }
}

export function meController(req: Request, res: Response) {
  res.json({ user: (req as any).user });
}