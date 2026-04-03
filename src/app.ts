import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger";
import authRoutes from "./routes/authRouter";
import userRoutes from "./routes/userRouter";
import recordRoutes from "./routes/recordRouter";
import dashboardRoutes from "./routes/dashboardRouter";
import adminRoutes from "./routes/adminRouter";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));


app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/records", recordRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/admin", adminRoutes);


// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

export default app;