import { Router } from "express";
import { edit_members } from "../controllers/project-controller/edit-members.controller";
import { create_project } from "../controllers/project-controller/create-project.controller";
import { delete_project } from "../controllers/project-controller/delete-project.controller";
import { isUserAdmin } from "../middlewares/isUserAdmin.middleware";
import { isUserInProject } from "../middlewares/isUserInProject.middleware";
import { isAuthenticated } from "../middlewares/auth.middleware";
import { get_project_details } from "../controllers/project-controller/get-project-details.controller";
import { isUserMember } from "../middlewares/isUserMember.middleware";
import { get_all_projects } from "../controllers/project-controller/get-all-projects.controller";
import { add_milestone } from "../controllers/project-controller/add-milestone.controller";
import { remove_milestone } from "../controllers/project-controller/remove-milestone.controller";
import { edit_milestone } from "../controllers/project-controller/edit-milestone.controller";
import { edit_project_info } from "../controllers/project-controller/edit-project-info.controller";

const router = Router();

router.get('/get-all-projects/:communityId', isAuthenticated, isUserMember, get_all_projects);
router.get('/get-project-details/:communityId/:projectId', isAuthenticated, isUserInProject, get_project_details)
router.post('/create-project', isAuthenticated, isUserAdmin, create_project);
router.patch('/edit-member',isAuthenticated, isUserAdmin, isUserInProject, edit_members);
router.patch('/edit-basic-info', isAuthenticated, isUserAdmin, isUserInProject,edit_project_info);
router.patch('/add-milestone', isAuthenticated, isUserAdmin, isUserInProject, add_milestone);
router.patch('/remove-milestone', isAuthenticated, isUserAdmin, isUserInProject, remove_milestone);
router.patch('/edit-milestone', isAuthenticated, isUserAdmin, isUserInProject, edit_milestone);
router.delete('/delete-project',isAuthenticated, isUserAdmin, isUserInProject, delete_project);

module.exports = router;