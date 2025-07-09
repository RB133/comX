import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@radix-ui/react-progress";
import { CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import ErrorPage from "@/pages/genral/ErrorPage";
import MilestonesSettings from "./project-settings/MilestoneSettings";
import { useSelector } from "react-redux";
import { RootState } from "@/state/store";
import CreateTask from "./create-task/CreateTask";
import ProjectAPI from "@/api/project/ProjectAPI";
import TasksAPI from "@/api/tasks/TasksAPI";

export default function Milestones() {
  const user = useSelector((state: RootState) => state.userDetails);

  const { project, projectLoading, projectError } = ProjectAPI();

  const {tasks,tasksLoading,tasksError} = TasksAPI();

  if (projectLoading || tasksLoading) {
    return <div>Loading ...</div>;
  }

  if (projectError || tasksError) {
    return <ErrorPage />;
  }

  const latestTask = tasks.reduce(
    (latest: { deadline: Date }, item: { deadline: Date }) => {
      return new Date(item.deadline) > new Date(latest.deadline)
        ? item
        : latest;
    },
    tasks[0]
  );

  const dueDate = latestTask ? latestTask.deadline : null;

  const taskCompleted = tasks
    .filter((item: { completedDate: Date }) => item.completedDate !== null)
    .filter((item: { status: string }) => item.status === "COMPLETED").length;

  const totalTask = tasks.length;

  const completionPercentage = Math.round((taskCompleted / totalTask) * 100);

  const isAdmin = user.user?.id === project.ownerId;

  return (
    <Card>
      {isAdmin && <MilestonesSettings project={project} />}
      <CardHeader>
        <CardTitle>Milestones</CardTitle>
        <CardDescription>Key project phases and goals</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {project.milestones.map((milestone: string, index: number) => (
            <motion.li
              key={milestone}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex items-center gap-4"
            >
              <div className="flex-shrink-0">
                <CheckCircle
                  className={`h-6 w-6 ${
                    Math.random() > 0.5 ? "text-green-500" : "text-gray-300"
                  }`}
                />
              </div>
              <div className="flex-grow">
                <h4 className="font-medium">{milestone}</h4>
                <p className="text-sm text-muted-foreground">
                  {dueDate
                    ? "Due: " +
                      new Date(dueDate).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })
                    : "No Task Assigned"}
                </p>
                <Progress value={completionPercentage} className="mt-2" />
              </div>
              {isAdmin && <CreateTask milestone={milestone} />}
              <div className="w-6 flex justify-center item-center">
                <Badge
                  variant={
                    completionPercentage === 100 ? "default" : "secondary"
                  }
                >
                  {completionPercentage}%
                </Badge>
              </div>
            </motion.li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
