import { Router } from "express";
import {
  createCommunity,
  deleteCommunity,
  getAllCommunities,
  getCommunityDetails,
  getLivekitToken,
  getUserCommunities,
  updateCommunity,
} from "../controllers/community.controller";
import { requireAuth } from "../middleware/auth";
import { requireAdmin, requireMember } from "../middleware/membership";
import { upload } from "../middleware/upload";
import { validate } from "../middleware/validate";
import { createCommunitySchema, deleteCommunitySchema } from "../schemas/community.schema";

const router = Router();

router.post("/create-community", requireAuth, validate(createCommunitySchema), createCommunity);
router.get("/get-all-communities", requireAuth, getAllCommunities);
router.get("/get-community-details/:communityId", requireAuth, requireMember, getCommunityDetails);
router.get("/get-user-communities", requireAuth, getUserCommunities);
router.put("/update-community", upload.single("file"), requireAuth, requireAdmin, updateCommunity);
router.delete("/delete-community", requireAuth, validate(deleteCommunitySchema), deleteCommunity);
router.post("/livekit/get-token", requireAuth, getLivekitToken);

export default router;
