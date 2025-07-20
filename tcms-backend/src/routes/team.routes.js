import express from "express";
import {
  requestJoinTeam,
  requestCreateTeam,
  getJoinRequests,
  getPendingTeam,
  decideJoinRequest,
  decideCreateTeamRequest,
  getTeamDetail,
  getTeams,
} from "../controllers/team.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

router.get("/:id/detail", protect, getTeamDetail);

router.get("/teams/all", protect, authorizeRoles("admin"), getTeams);

router.post(
  "/request-join-team",
  protect,
  authorizeRoles("member"),
  requestJoinTeam
);

router.post(
  "/request-create-team",
  protect,
  authorizeRoles("member"),
  requestCreateTeam
);

router.get(
  "/request-join-team/all",
  protect,
  authorizeRoles("admin"),
  getJoinRequests
);

router.get(
  "/request-new-team/all",
  protect,
  authorizeRoles("admin"),
  getPendingTeam
);

router.patch(
  "/request-join-team/:id/decide",
  protect,
  authorizeRoles("admin"),
  decideJoinRequest
);

router.patch(
  "/request-new-team/:request_id/decide",
  protect,
  authorizeRoles("admin"),
  decideCreateTeamRequest
);

export default router;
