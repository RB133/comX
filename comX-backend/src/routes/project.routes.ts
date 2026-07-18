import { Router } from "express";
import {
  addMilestone,
  createProject,
  deleteProject,
  editMembers,
  editMilestones,
  editProjectInfo,
  getAllProjects,
  getProjectDetails,
  removeMilestone,
} from "../controllers/project.controller";
import { requireAuth } from "../middleware/auth";
import { requireAdmin, requireMember, requireProjectMember } from "../middleware/membership";

const router = Router();

router.get("/get-all-projects/:communityId", requireAuth, requireMember, getAllProjects);
router.get("/get-project-details/:communityId/:projectId", requireAuth, requireProjectMember, getProjectDetails);
router.post("/create-project", requireAuth, requireAdmin, createProject);
router.patch("/edit-member", requireAuth, requireAdmin, requireProjectMember, editMembers);
router.patch("/edit-basic-info", requireAuth, requireAdmin, requireProjectMember, editProjectInfo);
router.patch("/add-milestone", requireAuth, requireAdmin, requireProjectMember, addMilestone);
router.patch("/remove-milestone", requireAuth, requireAdmin, requireProjectMember, removeMilestone);
router.patch("/edit-milestone", requireAuth, requireAdmin, requireProjectMember, editMilestones);
router.delete("/delete-project", requireAuth, requireAdmin, requireProjectMember, deleteProject);

export default router;
