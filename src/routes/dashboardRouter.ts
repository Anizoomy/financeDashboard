import { Router } from "express";
import { authenticate, authorize } from "../middleware/authMiddleware";
import {
  getSummaryController,
  getCategoryTotalsController,
  getMonthlyTrendsController,
  getWeeklyComparisonController,
  getRecentActivityController,
} from "../controllers/dashboardController";

const router = Router();

router.use(authenticate);
router.use(authorize("ANALYST", "ADMIN"));

/**
 * @swagger
 * /api/dashboard/summary:
 *   get:
 *     summary: Get total income, expenses and net balance
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Summary data
 *       403:
 *         description: Access denied
 */
router.get("/summary", getSummaryController);

/**
 * @swagger
 * /api/dashboard/categories:
 *   get:
 *     summary: Get totals grouped by category
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Category totals
 */
router.get("/categories", getCategoryTotalsController);

/**
 * @swagger
 * /api/dashboard/trends/monthly:
 *   get:
 *     summary: Get monthly income and expense trends
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: months
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Monthly trends
 */
router.get("/trends/monthly", getMonthlyTrendsController);

/**
 * @swagger
 * /api/dashboard/trends/weekly:
 *   get:
 *     summary: Compare this week vs last week
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Weekly comparison
 */
router.get("/trends/weekly", getWeeklyComparisonController);

/**
 * @swagger
 * /api/dashboard/recent:
 *   get:
 *     summary: Get recent transactions
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Recent activity
 */
router.get("/recent", getRecentActivityController);

export default router;                       