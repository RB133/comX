import ErrorPage from "@/pages/general/ErrorPage";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import CommunityHeader from "./CommunityHeader";
import AllProjectAPI from "@/api/project/AllProjectsAPI";

export default function CallList() {
  const { projectsLoading, projectsError } = AllProjectAPI();

  if (projectsLoading) {
    return <div>Loading...</div>;
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
