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
import MilestonesSettings from "./project-settings/MilestoneSettings";
import { useSelector } from "react-redux";
import { RootState } from "@/state/store";
import CreateTask from "./create-task/CreateTask";
import { ProjectDetails } from "@/types/Project";
import { TaskGet } from "@/types/tasks";

function milestoneStats(tasks: TaskGet[], milestone: string) {
  const milestoneTasks = tasks.filter((task) => task.milestone === milestone);
  const completed = milestoneTasks.filter((task) => task.status === "COMPLETED").length;
  const total = milestoneTasks.length;
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

  const dueDate = milestoneTasks.reduce<string | null>((latest, task) => {
    if (!latest) return task.deadline;
    return new Date(task.deadline) > new Date(latest) ? task.deadline : latest;
  }, null);

  return { percentage, dueDate, hasTasks: total > 0 };
}

export default function Milestones({
  project,
  tasks,
}: {
  project: ProjectDetails;
  tasks: TaskGet[];
}) {
  const user = useSelector((state: RootState) => state.userDetails);

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
          {project.milestones.map((milestone: string, index: number) => {
            const { percentage, dueDate, hasTasks } = milestoneStats(tasks, milestone);

            return (
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
                      percentage === 100 ? "text-green-500" : "text-muted-foreground/40"
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
                  <Progress value={percentage} className="mt-2" />
                </div>
                {isAdmin && <CreateTask milestone={milestone} project={project} />}
                <div className="w-10 flex justify-center item-center">
                  <Badge variant={hasTasks && percentage === 100 ? "default" : "secondary"}>
                    {percentage}%
                  </Badge>
                </div>
              </motion.li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}
