import { Router } from "express";
import { getCalendarTasks, setCalendarTask } from "../controllers/calendar.controller";
import { requireAuth } from "../middleware/auth";
import { requireMember } from "../middleware/membership";

const router = Router();

router.post("/set-calendar-task", requireAuth, requireMember, setCalendarTask);
router.get("/get-calendar-task/:communityId", requireAuth, requireMember, getCalendarTasks);

export default router;
