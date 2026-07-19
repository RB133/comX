import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Calendar } from "lucide-react";
import ProjectOverviewSettings from "./project-settings/ProjectOverviewSettings";
import { useSelector } from "react-redux";
import { RootState } from "@/state/store";
import { ProjectDetails } from "@/types/Project";
import { TaskGet } from "@/types/tasks";

export default function ProjectOverview({
  project,
  tasks,
}: {
  project: ProjectDetails;
  tasks: TaskGet[];
}) {
  const user = useSelector((state: RootState) => state.userDetails);

  const isAdmin = user.user?.id === project.ownerId;

  const completedCount = tasks.filter((task: { status: string }) => task.status === "COMPLETED").length;
  const progress = tasks.length === 0 ? 0 : Math.round((completedCount / tasks.length) * 100);

  return (
    <>
      <Card className="space-y-4">
        <CardHeader>
          {isAdmin && <ProjectOverviewSettings project={project} />}
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl font-bold">
                {project.name}
              </CardTitle>
              <CardDescription className="mt-1">
                {project.description}
              </CardDescription>
            </div>
            {/* Project Owner Avatar */}
            <div className="flex items-center space-x-2">
              <Avatar>
                <AvatarImage
                  className="w-12 h-12 rounded-full"
                  src={project.owner.avatar}
                />
                <AvatarFallback>{project.owner.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="text-lg font-medium text-foreground/80">
                {project.owner.username}
              </span>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* Deadline and Progress Section */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <span className="font-medium">
                Deadline:{" "}
                <span className="font-semibold">
                  {new Date(project.deadline).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </span>
            </div>

            <div className="w-full sm:w-1/2">
              <p className="text-sm text-muted-foreground mb-1 font-medium">
                Project Progress
              </p>
              <Progress value={progress} className="w-full h-3 rounded-lg" />
              <p className="text-xs text-muted-foreground mt-1 text-right">
                {progress}% Complete
              </p>
            </div>
          </div>

          {/* Divider */}
          <hr className="my-4 border-border" />

          {/* Start and End Dates */}
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>
              <strong>Start: </strong>
              <span className="font-semibold">
                {new Date(project.createdAt).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </span>
            <span>
              <strong>End: </strong>
              <span className="font-semibold">
                {new Date(project.deadline).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </span>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
