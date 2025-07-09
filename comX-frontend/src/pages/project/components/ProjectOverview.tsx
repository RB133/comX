import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import ErrorPage from "@/pages/genral/ErrorPage";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Calendar } from "lucide-react";
import ProjectOverviewSettings from "./project-settings/ProjectOverviewSettings";
import { useSelector } from "react-redux";
import { RootState } from "@/state/store";
import ProjectAPI from "@/api/project/ProjectAPI";

export default function ProjectOverview() {

  const user = useSelector((state: RootState) => state.userDetails);

  const { project, projectLoading, projectError } = ProjectAPI();
  

  if (projectLoading) {
    return <div>Loading ...</div>;
  }

  if (projectError) {
    return <ErrorPage />;
  }

  const isAdmin = user.user?.id === project.ownerId;

  return (
    <>
      <Card className="rounded-lg bg-white p-6 space-y-4">
        <CardHeader>
          {isAdmin && <ProjectOverviewSettings project={project} />}
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                {project.name}
              </CardTitle>
              <CardDescription className="text-sm text-gray-600 mt-1">
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
              <span className="text-lg font-medium text-gray-700">
                {project.owner.username}
              </span>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* Deadline and Progress Section */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div className="flex items-center gap-2 text-gray-700">
              <Calendar className="h-5 w-5 text-gray-500" />
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
              <p className="text-sm text-gray-600 mb-1 font-medium">
                Project Progress
              </p>
              <Progress
                value={65}
                className="w-full h-3 rounded-lg bg-gray-200"
              />
              <p className="text-xs text-gray-500 mt-1 text-right">
                {65}% Complete
              </p>
            </div>
          </div>

          {/* Divider */}
          <hr className="my-4 border-gray-200" />

          {/* Start and End Dates */}
          <div className="flex justify-between text-sm text-gray-600">
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
