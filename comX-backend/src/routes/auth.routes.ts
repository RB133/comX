import { Router } from "express";
import { login, logout, register } from "../controllers/auth.controller";
import { requireAuth } from "../middleware/auth";
import { upload } from "../middleware/upload";
import { validate } from "../middleware/validate";
import { loginSchema, registerSchema } from "../schemas/auth.schema";

const router = Router();

router.post("/register", upload.single("file"), validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.get("/logout", requireAuth, logout);

export default router;
