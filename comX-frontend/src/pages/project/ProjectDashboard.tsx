import { motion } from "framer-motion";
import ProjectOverview from "./components/ProjectOverview";
import TeamMembers from "./components/TeamMembers";
import RecentActivity from "./components/RecentActivity";
import Milestones from "./components/Milestones";
import ProjectDashboardSkeleton from "./components/ProjectDashboardSkeleton";
import { useParams } from "react-router-dom";
import CreateProject from "./create-project/CreateProject";
import InlineError from "@/components/InlineError";
import ProjectAPI from "@/api/project/ProjectAPI";
import TasksAPI from "@/api/tasks/TasksAPI";

export default function ProjectDashboard() {
  const { projectId } = useParams();

  const { project, projectLoading, projectError } = ProjectAPI();
  const { tasks, tasksLoading, tasksError } = TasksAPI();

  if (projectId === undefined) return <CreateProject />;

  if (projectLoading || tasksLoading) return <ProjectDashboardSkeleton />;

  if (projectError || tasksError) {
    return <InlineError message="Couldn't load this project. Please try again." />;
  }

  return (
    <div className="max-h-screen overflow-scroll w-full no-scrollbar">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-muted/90 backdrop-blur-lg shadow-xl overflow-hidden"
      >
        <div className="p-6 sm:p-8 md:p-10 space-y-8">
          <ProjectOverview project={project} tasks={tasks} />
          <TeamMembers project={project} />
          <RecentActivity />
          <Milestones project={project} tasks={tasks} />
        </div>
      </motion.div>
    </div>
  );
}
