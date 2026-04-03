import { Request, Response } from "express";
import {
  getSummary,
  getCategoryTotals,
  getMonthlyTrends,
  getWeeklyComparison,
  getRecentActivity,
} from "../services/dashboardService";

export async function getSummaryController(req: Request, res: Response) {
  try {
    const { startDate, endDate } = req.query;
    const data = await getSummary({
      startDate: startDate as string,
      endDate: endDate as string,
    });
    res.json(data);
  } catch (err: any) {
    res.status(err.statusCode || 500).json({ error: err.message });
  }
}

export async function getCategoryTotalsController(req: Request, res: Response) {
  try {
    const { startDate, endDate } = req.query;
    const data = await getCategoryTotals({
      startDate: startDate as string,
      endDate: endDate as string,
    });
    res.json({ categories: data });
  } catch (err: any) {
    res.status(err.statusCode || 500).json({ error: err.message });
  }
}

export async function getMonthlyTrendsController(req: Request, res: Response) {
  try {
    const months = req.query.months ? parseInt(req.query.months as string) : 12;
    const data = await getMonthlyTrends(months);
    res.json({ trends: data });
  } catch (err: any) {
    res.status(err.statusCode || 500).json({ error: err.message });
  }
}

export async function getWeeklyComparisonController(req: Request, res: Response) {
  try {
    const data = await getWeeklyComparison();
    res.json(data);
  } catch (err: any) {
    res.status(err.statusCode || 500).json({ error: err.message });
  }
}

export async function getRecentActivityController(req: Request, res: Response) {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const data = await getRecentActivity(limit);
    res.json({ recentActivity: data });
  } catch (err: any) {
    res.status(err.statusCode || 500).json({ error: err.message });
  }
}