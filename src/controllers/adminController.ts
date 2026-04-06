import { Request, Response } from "express";
import { getSystemStats, getUsersByRole } from "../services/adminService";

export async function getSystemStatsController(req: Request, res: Response) {
    try {
        const data = await getSystemStats();
        res.json(data);
    } catch (err: any) {
        res.status(err.statusCode || 500).json({ error: err.message });
    }
}

export async function getUsersByRoleController(req: Request, res: Response) {
    try {
        const data = await getUsersByRole();
        res.json({ roleBreakdown: data });
    } catch (err: any) {
        res.status(err.statusCode || 500).json({ error: err.message });
    }
}