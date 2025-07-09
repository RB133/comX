import { AnimatedTooltip } from "@/components/ui/animated-tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ErrorPage from "@/pages/genral/ErrorPage";
import { useSelector } from "react-redux";
import { RootState } from "@/state/store";
import TeamMembersSettings from "./project-settings/TeamMembersSettings";
import ProjectAPI from "@/api/project/ProjectAPI";

export default function TeamMembers() {

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
    <Card className="flex flex-col justify-between items-center rounded-lg bg-white shadow-lg p-6 w-full">
      {isAdmin && <TeamMembersSettings project={project} />}
      <CardHeader className="w-full text-center flex items-start">
        <CardTitle className="text-xl font-semibold text-gray-800">
          Team Members
        </CardTitle>
        <CardDescription className="text-sm text-gray-500 mt-1">
          Project contributors and their roles
        </CardDescription>
        <hr className="my-3 border-gray-200 w-full" />
      </CardHeader>

      <CardContent className="w-full bg-white rounded-lg">
        <div className="flex flex-row items-center w-full justify-center z-50 mb-8">
          <AnimatedTooltip items={project.projectMembers} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
          {project.projectMembers.map(
            (item: {
              username: string;
              email: string;
              avatar: string;
              designation: string;
              name: string;
            }) => (
              <div
                key={item.email}
                className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <Avatar className="w-12 h-12 border border-gray-200 rounded-full overflow-hidden">
                  <AvatarImage src={item.avatar} />
                  <AvatarFallback>{item.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <h1 className="font-medium text-gray-800">{item.name}</h1>
                  <p className="text-sm text-gray-500">{item.designation}</p>
                </div>
              </div>
            )
          )}
        </div>
      </CardContent>
    </Card>
  );
}
