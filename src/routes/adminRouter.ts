import { Router } from "express";
import { authenticate, authorize } from "../middleware/authMiddleware";
import { loginController } from "../controllers/authController";
import {
  getSystemStatsController,
  getUsersByRoleController,
} from "../controllers/adminController";

const router = Router();

/**
 * @swagger
 * /api/admin/login:
 *   post:
 *     summary: Admin login
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
router.post("/login", loginController);

router.use(authenticate);
router.use(authorize("ADMIN"));



/**
 * @swagger
 * /api/admin/stats:
 *   get:
 *     summary: Get overall system statistics
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: System stats including users and transactions
 *       403:
 *         description: Access denied
 */
router.get("/stats", getSystemStatsController);


/**
 * @swagger
 * /api/admin/users/roles:
 *   get:
 *     summary: Get user count broken down by role
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Role breakdown
 *       403:
 *         description: Access denied
 */
router.get("/users/roles", getUsersByRoleController);

export default router;