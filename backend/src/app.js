import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import testSuitesRoutes from "./routes/testSuites.routes.js";
import authRoutes from "./routes/auth.routes.js";
import teamRoutes from "./routes/team.routes.js";
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/test-suites", testSuitesRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/teams", teamRoutes);

export default app;
