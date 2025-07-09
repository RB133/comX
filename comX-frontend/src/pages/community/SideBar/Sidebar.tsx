import React, { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/state/store";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import ErrorPage from "@/pages/genral/ErrorPage";
import ServerList from "./ServerList";
import CalendarList from "./CalendarList";
import SettingsList from "./SettingList";
import GroupList from "./GroupList";
import ProjectList from "./ProjectList";
import ProjectListForTasks from "./Task-ProjectList";
import AllProjectAPI from "@/api/project/AllProjectsAPI";
import CallList from "./CallList";

const backend_url = import.meta.env.VITE_BACKEND_URL;

const Sidebar = React.memo(function Sidebar() {
  const { ID } = useParams();

  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const activeServer = useSelector((state: RootState) => state.activeServer);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const { projects, projectsLoading, projectsError } = AllProjectAPI();

  const { data: taskList, error: taskError } = useQuery({
    queryKey: [`community${ID}/project/${-1}/task`],
    queryFn: async () => {
      if (projects.length !== 0) {
        const response = await axios.get(
          `${backend_url}/task/get-all-tasks-in-project/${ID}/${projects[0].id}`,
          {
            withCredentials: true,
          }
        );
        return response.data.data;
      } else return [];
    },
    enabled: !!projects,
    staleTime: Infinity,
  });

  useEffect(() => {
    if(projectsLoading) return;
    if (activeServer === 1) {
      navigate("calendar", { replace: true });
    } else if (activeServer === 2) {
      navigate("settings/basic-info", { replace: true });
    } else if (activeServer === 4) {
      navigate("chat-skeleton", { replace: true });
    } else if (activeServer === 5) {
      if (projects.length === 0) navigate(`project`, { replace: true });
      else navigate(`project/${projects[0].id}`, { replace: true });
    } else if (activeServer === 6) {
      if (projects.length === 0) navigate(`project/task`, { replace: true });
      else navigate(`task/${projects[0].id}`, { replace: true });
    } else if(activeServer === 3){
      navigate("call",{replace:true});
    }
  }, [activeServer, dispatch, navigate, projects, taskList,projectsLoading]);

  if (projectsLoading) {
    return <div>Loading ...</div>;
  }

  if (projectsError || taskError) {
    return <ErrorPage />;
  }

  const SidebarContent = () => (
    <div className="flex h-full">
      <ServerList />
      {activeServer === 1 && <CalendarList />}
      {activeServer === 2 && <SettingsList />}
      {activeServer === 3 && <CallList />}
      {activeServer === 4 && <GroupList />}
      {activeServer === 5 && <ProjectList />}
      {activeServer === 6 && <ProjectListForTasks />}
    </div>
  );

  return (
    <div className="h-screen bg-gray-100 text-gray-800">
      {isMobile ? (
        <>
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="fixed top-4 left-4 z-50 md:hidden"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-[calc(72px+15rem)]">
              <SidebarContent />
            </SheetContent>
          </Sheet>
        </>
      ) : (
        <SidebarContent />
      )}
    </div>
  );
});

export default Sidebar;
