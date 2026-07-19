import { Router } from "express";
import { login, logout, register } from "../controllers/auth.controller";
import { upload } from "../middleware/upload";
import { validate } from "../middleware/validate";
import { loginSchema, registerSchema } from "../schemas/auth.schema";

const router = Router();

router.post("/register", upload.single("file"), validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
// No requireAuth here: clearing a cookie is always safe, and a client whose
// token is already expired/invalid still needs a way to log out.
router.get("/logout", logout);

export default router;
