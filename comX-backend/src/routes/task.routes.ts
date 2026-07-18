import { Router } from "express";
import {
  addTask,
  completeTask,
  deleteTask,
  editTask,
  getAllTasksInCommunity,
  getAllTasksInMilestone,
  getAllTasksInProject,
  taskVerdict,
} from "../controllers/task.controller";
import { requireAuth } from "../middleware/auth";
import { requireAdmin, requireMember, requireProjectMember } from "../middleware/membership";

const router = Router();

router.post("/add-task", requireAuth, requireProjectMember, addTask);
router.put("/edit-task", requireAuth, requireProjectMember, editTask);
router.delete("/delete-task", requireAuth, requireProjectMember, deleteTask);
router.get("/get-all-tasks-in-community/:communityId", requireAuth, requireMember, getAllTasksInCommunity);
router.get("/get-all-tasks-in-project/:communityId/:projectId", requireAuth, requireProjectMember, getAllTasksInProject);
router.get("/get-all-tasks-in-project/:communityId/:projectId/:milestone", requireAuth, requireProjectMember, getAllTasksInMilestone);
router.put("/complete-task", requireAuth, requireProjectMember, completeTask);
router.put("/task-verdict", requireAuth, requireProjectMember, requireAdmin, taskVerdict);

export default router;
