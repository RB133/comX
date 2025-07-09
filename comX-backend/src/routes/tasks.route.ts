import { Router } from "express";
import { isAuthenticated } from "../middlewares/auth.middleware";
import { isUserInProject } from "../middlewares/isUserInProject.middleware";
import { add_task } from "../controllers/task-controller/add-task.controller";
import { delete_task } from "../controllers/task-controller/delete-task.controller";
import { edit_task } from "../controllers/task-controller/edit-task.controller";
import { get_all_tasks_in_project } from "../controllers/task-controller/get-all-tasks-in-project.controller";
import { get_all_tasks_in_milestone } from "../controllers/task-controller/get-all-tasks-in-milestone.controller";
import { complete_task } from "../controllers/task-controller/complete-task.controller";
import { isUserAdmin } from "../middlewares/isUserAdmin.middleware";
import { task_verdict } from "../controllers/task-controller/task-verdict.controller";
import { isUserMember } from "../middlewares/isUserMember.middleware";
import { get_all_tasks_in_community } from "../controllers/task-controller/get-all-tasks-in-community.controller";

const router = Router();

router.post('/add-task', isAuthenticated, isUserInProject, add_task);
router.delete('/delete-task', isAuthenticated, isUserInProject, delete_task);
router.put('/edit-task', isAuthenticated, isUserInProject, edit_task);
router.get('/get-all-tasks-in-community/:communityId', isAuthenticated, isUserMember, get_all_tasks_in_community)
router.get('/get-all-tasks-in-project/:communityId/:projectId', isAuthenticated, isUserInProject, get_all_tasks_in_project);
router.get('/get-all-tasks-in-project/:communityId/:projectId/:milestone', isAuthenticated, isUserInProject, get_all_tasks_in_milestone);
router.put('/complete-task', isAuthenticated, isUserInProject, complete_task);
router.put('/task-verdict', isAuthenticated, isUserInProject, isUserAdmin, task_verdict);
module.exports = router;