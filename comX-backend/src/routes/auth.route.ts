import { Router } from "express";
import { login } from "../controllers/auth-controller/login.controller";
import { register } from "../controllers/auth-controller/register.controller";
import { logout } from "../controllers/auth-controller/logout.controller";
import { isAuthenticated } from "../middlewares/auth.middleware";
import { upload } from "../middlewares/multer.middleware";

const router = Router();

router.post("/register", upload.single("file"), register);
router.post("/login", login);
router.get("/logout",isAuthenticated, logout);

module.exports = router;