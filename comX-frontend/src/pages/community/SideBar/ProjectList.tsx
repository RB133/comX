import CreateProject from "@/pages/project/create-project/CreateProject";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { FolderGit2 } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import UserControlBox from "./UserControlBox";
import CommunityHeader from "./CommunityHeader";
import AllProjectAPI from "@/api/project/AllProjectsAPI";

export default function ProjectList() {
  const location = useLocation();
  const currentUrl = location.pathname.split("/").filter(Boolean);

  const navigate = useNavigate();

  // Already loaded and error-checked by the parent Sidebar (same shared,
  // cached query) before this component ever mounts.
  const { projects } = AllProjectAPI();

  return (
    <>
      <div className="w-60 bg-card flex flex-col border-r">
        <CommunityHeader />
        <ScrollArea className="flex-grow">
          {projects.map((category: { id: number; name: string }) => (
            <div key={category.id} className="m-2 mx-4">
              <button
                className={`flex items-center w-full px-2 py-2 mb-2 text-sm font-medium text-left rounded-lg transition-all duration-300 ease-in-out transform gap-2 ${
                  parseInt(currentUrl.at(-1)!, 10) === category.id
                    ? "bg-gradient-to-r from-blue-500 to-blue-700 text-white scale-105"
                    : "bg-card text-muted-foreground hover:bg-muted hover:text-foreground hover:shadow-md"
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
