import { Router } from "express";
import {
  acceptJoinRequest,
  banMember,
  demoteMember,
  getCommunityMembers,
  joinCommunity,
  promoteMember,
  removeMember,
} from "../controllers/member.controller";
import { requireAuth } from "../middleware/auth";
import { requireAdmin, requireMember } from "../middleware/membership";

const router = Router();

router.get("/get-community-members/:communityId", requireAuth, requireMember, getCommunityMembers);
router.post("/join-community", requireAuth, joinCommunity);
router.post("/remove-member", requireAuth, requireAdmin, removeMember);
router.post("/promote-member", requireAuth, requireAdmin, promoteMember);
router.post("/demote-member", requireAuth, requireAdmin, demoteMember);
router.post("/ban-member", requireAuth, requireAdmin, banMember);
router.post("/accept-join-request", requireAuth, requireAdmin, acceptJoinRequest);

export default router;
