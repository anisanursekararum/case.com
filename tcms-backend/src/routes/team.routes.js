import express from "express";
import {
  requestJoinTeam,
  requestCreateTeam,
  getPendingRequests,
  getPendingTeam,
  decideJoinRequest,
  decideCreateTeamRequest,
  getTeamDetail 
} from "../controllers/team.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

//get team details
router.get("/:id/detail", protect, getTeamDetail);

//member request join ke team
router.post(
  "/request-join-team",
  protect,
  authorizeRoles("member"),
  requestJoinTeam
);

//member request buat team BARU
router.post(
  "/request-create-team",
  protect,
  authorizeRoles("member"),
  requestCreateTeam
);

//admin get semua data dari member yang request join team
router.get(
  "/request-join-team/pending",
  protect,
  authorizeRoles("admin"),
  getPendingRequests
);

//admin get semua data dari member yang request BUAT TEAM BARU
router.get(
  "/request-new-team/pending",
  protect,
  authorizeRoles("admin"),
  getPendingTeam
);

//admin memutuskan approved or decline request member buat join team
router.patch(
  "/request-join-team/:id/decide",
  protect,
  authorizeRoles("admin"),
  decideJoinRequest
);

//admin memutuskan approved or decline request member untuk NEW TEAM
router.patch(
  "/request-new-team/:request_id/decide",
  protect,
  authorizeRoles("admin"),
  decideCreateTeamRequest
);

export default router;
