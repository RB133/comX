import { Groups } from "@/lib/DummyData";
import { cn } from "@/lib/utils";
import { setActiveChannel } from "@/state/sidebar/activeChannel";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { ChevronDown } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import CommunityHeader from "./ComunityHeader";
import UserControlBox from "./UserControlBox";
import AllProjectAPI from "@/api/project/AllProjectsAPI";
import ErrorPage from "@/pages/genral/ErrorPage";

const GroupList = React.memo(function GroupList() {
  const groups = Groups;

  const location = useLocation();
  const currentUrl = location.pathname.split("/").filter(Boolean);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [expandedCategories, setExpandedCategories] = useState(
    Array.from({ length: groups.length }, (_, i) => i + 1)
  );

  const toggleCategory = (id: number) => {
    setExpandedCategories((prev: number[]) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const { projects, projectsLoading, projectsError } = AllProjectAPI();

  useEffect(() => {
    dispatch(setActiveChannel(1));
  }, [dispatch]);

  if (projectsLoading) {
    return <div>Loading . . .</div>;
  }

  if (projectsError) {
    return <ErrorPage />;
  }

  return (
    <>
      <div className="w-60 bg-white flex flex-col border-r">
        <CommunityHeader />
        <ScrollArea className="flex-grow">
          {groups.map((category) => (
            <div key={category.id} className="mt-4">
              <button
                className="flex items-center px-1 mb-1 group"
                onClick={() => toggleCategory(category.id)}
              >
                <ChevronDown
                  className={cn(
                    "w-3 h-3 mr-1 transition-transform duration-200 text-gray-500",
                    expandedCategories.includes(category.id)
                      ? "rotate-0"
                      : "-rotate-90"
                  )}
                />
                <span className="uppercase text-xs font-semibold text-gray-500 group-hover:text-gray-700">
                  {category.name}
                </span>
              </button>
              {expandedCategories.includes(category.id) && (
                <div className="space-y-1 mx-2">
                  {projects.map((project: { id: number; name: string }) => (
                    <button
                      key={project.id}
                      className={cn(
                        "flex items-center px-2 py-1 w-full rounded group hover:bg-gray-100",
                        parseInt(currentUrl.at(-1)!, 10) === project.id &&
                          "bg-primary hover:bg-primary"
                      )}
                      onClick={() => {
                        navigate(`chat/${project.id}`,{replace:true});
                      }}
                    >
                      {category.link}
                      <span
                        className={`text-sm text-gray-600 group-hover:text-gray-800 ${
                          parseInt(currentUrl.at(-1)!, 10) === project.id &&
                          "text-white group-hover:text-white"
                        }`}
                      >
                        {project.name}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </ScrollArea>
        <UserControlBox />
      </div>
    </>
  );
});

export default GroupList;
