import { Router } from "express";
import { get_user_info } from "../controllers/user-controller/get-user-info.controller";
import { edit_user_info } from "../controllers/user-controller/edit-user-info.controller";
import { isAuthenticated } from "../middlewares/auth.middleware";
import { toggle_follow } from "../controllers/user-controller/toggle-follow.controller";
import { upload } from "../middlewares/multer.middleware";

const router = Router();

router.get("/get-user-info/:username", get_user_info);
router.put("/edit-user-info/:username", upload.single("file"), isAuthenticated, edit_user_info);
router.put("/toggle-follow/:username", isAuthenticated, toggle_follow);

module.exports = router;