import { Router } from "express";
const router = Router();
import { register, login, getCurrentUser } from "../controllers/auth.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getCurrentUser);

export default router;
