import ErrorPage from "@/pages/genral/ErrorPage";
import CreateProject from "@/pages/project/create-project/CreateProject";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { FolderGit2 } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import UserControlBox from "./UserControlBox";
import CommunityHeader from "./ComunityHeader";
import AllProjectAPI from "@/api/project/AllProjectsAPI";

export default function ProjectList() {
  const location = useLocation();
  const currentUrl = location.pathname.split("/").filter(Boolean);

  const navigate = useNavigate();

  const { projects, projectsLoading, projectsError } = AllProjectAPI();

  if (projectsLoading) {
    return <div>Loading ...</div>;
  }

  if (projectsError) {
    return <ErrorPage />;
  }

  return (
    <>
      <div className="w-60 bg-white flex flex-col border-r">
        <CommunityHeader />
        <ScrollArea className="flex-grow">
          {projects.map((category: { id: number; name: string }) => (
            <div key={category.id} className="m-2 mx-4">
              <button
                className={`flex items-center w-full px-2 py-2 mb-2 text-sm font-medium text-left rounded-lg transition-all duration-300 ease-in-out transform gap-2 ${
                  parseInt(currentUrl.at(-1)!, 10) === category.id
                    ? "bg-gradient-to-r from-blue-500 to-blue-700 text-white scale-105"
                    : "bg-white text-gray-600 hover:bg-gray-100 hover:text-gray-800 hover:shadow-md"
                }`}
                onClick={() => {
                  navigate(`project/${category.id}`, { replace: true });
                }}
              >
                <FolderGit2 />
                <span className="truncate">{category.name}</span>
              </button>
            </div>
          ))}
        </ScrollArea>
        <div>
          {currentUrl.at(-2) === "project" && <CreateProject />}
          <UserControlBox />
        </div>
      </div>
    </>
  );
}
