import { Router } from "express";
import { isAuthenticated } from "../middlewares/auth.middleware";
import { get_community_members } from "../controllers/member-controller/get-community-members.controller";
import { join_community } from "../controllers/member-controller/join-community.controller";
import { remove_member } from "../controllers/member-controller/remove-member.controller";
import { promote_member } from "../controllers/member-controller/promote-member.controller";
import { demote_member } from "../controllers/member-controller/demote-member.controller";
import { ban_member } from "../controllers/member-controller/ban-member.controller";
import { accept_join_request } from "../controllers/member-controller/accept-join-request.controller";
import { isUserAdmin } from "../middlewares/isUserAdmin.middleware";
import { isUserMember } from "../middlewares/isUserMember.middleware";

const router = Router();

router.get("/get-community-members/:communityId", isAuthenticated, isUserMember, get_community_members);
router.post("/join-community", isAuthenticated, join_community);
router.post("/remove-member", isAuthenticated, isUserAdmin, remove_member);
router.post("/promote-member", isAuthenticated, isUserAdmin, promote_member);
router.post("/demote-member", isAuthenticated, isUserAdmin, demote_member);
router.post("/ban-member", isAuthenticated, isUserAdmin, ban_member);
router.post("/accept-join-request", isAuthenticated, isUserAdmin, accept_join_request);

module.exports = router;