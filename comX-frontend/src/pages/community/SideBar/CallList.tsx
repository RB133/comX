import ErrorPage from "@/pages/genral/ErrorPage";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { useLocation, useNavigate } from "react-router-dom";
import CommunityHeader from "./ComunityHeader";
import AllProjectAPI from "@/api/project/AllProjectsAPI";

export default function CallList() {
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

        </ScrollArea>
      </div>
    </>
  );
}
