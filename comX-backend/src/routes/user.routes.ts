import { Router } from "express";
import { editUserInfo, getUserInfo, toggleFollow } from "../controllers/user.controller";
import { requireAuth } from "../middleware/auth";
import { upload } from "../middleware/upload";

const router = Router();

router.get("/get-user-info/:username", getUserInfo);
router.put("/edit-user-info/:username", upload.single("file"), requireAuth, editUserInfo);
router.put("/toggle-follow/:username", requireAuth, toggleFollow);

export default router;
