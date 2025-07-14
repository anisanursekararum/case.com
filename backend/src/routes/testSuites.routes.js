import express from "express";
import {
  getAllTestSuites,
  getTestSuitesById,
  createTestSuites,
  updateTestSuites,
  deleteTestSuites,
} from "../controllers/testSuites.controller.js";

const router = express.Router();

router.get("/", getAllTestSuites);
router.get("/:id", getTestSuitesById);
router.post("/", createTestSuites);
router.patch("/:id", updateTestSuites);
router.delete("/:id", deleteTestSuites);

export default router;
