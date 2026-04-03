import { Request, Response } from "express";
import { getAllUsers, getUserById, updateUser, deleteUser } from "../services/userService";

export async function getAllUsersController(req: Request, res: Response) {
  try {
    const users = await getAllUsers();
    res.json({ users });
  } catch (err: any) {
    res.status(err.statusCode || 500).json({ error: err.message });
  }
}

export async function getUserByIdController(req: Request, res: Response) {
  try {
    const user = await getUserById(req.params.id as string);
    res.json({ user });
  } catch (err: any) {
    res.status(err.statusCode || 500).json({ error: err.message });
  }
}

export async function updateUserController(req: Request, res: Response) {
  try {
    const user = await updateUser(req.params.id as string, req.body);
    res.json({ message: "User updated", user });
  } catch (err: any) {
    res.status(err.statusCode || 500).json({ error: err.message });
  }
}

export async function deleteUserController(req: Request, res: Response) {
  try {
    const requesterId = (req as any).user.id;
    await deleteUser(requesterId, req.params.id as string);
    res.json({ message: "User deleted successfully" });
  } catch (err: any) {
    res.status(err.statusCode || 500).json({ error: err.message });
  }
}