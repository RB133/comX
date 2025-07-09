import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import TasksList from "./TasksList";
import { TaskGet } from "@/types/tasks";
import SingleTask from "./SingelTask";
import { useParams } from "react-router-dom";
import ErrorPage from "../genral/ErrorPage";
import { Toaster } from "react-hot-toast";
import TasksAPI from "@/api/tasks/TasksAPI";

export default function TaskPage() {
  const { projectId } = useParams();

  const [active, setActive] = useState<TaskGet | null>(null);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActive(null);
      }
    }

    if (active && typeof active === "object") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  const {tasks,tasksLoading,tasksError} = TasksAPI();

  useEffect(() => {
    if (active === null) return;
    setActive(tasks.find((item: { id: number }) => item.id === active.id));
  }, [tasks]);

  if (projectId === undefined) return <div>Hello World</div>;

  if (tasksLoading) {
    return <div>Loading ...</div>;
  }

  if (tasksError) {
    return <ErrorPage />;
  }

  return (
    <>
      <Card className="w-full h-full overflow-x-hidden overflow-y-scroll no-scrollbar">
        <CardContent className="mt-12">
          <AnimatePresence>
            {active && typeof active === "object" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/20 h-full w-full z-10"
              />
            )}
          </AnimatePresence>
          <SingleTask active={active} setActive={setActive} />
          <ul className="mx-auto w-full gap-4">
            <TasksList cards={tasks} setActive={setActive} />
          </ul>
        </CardContent>
        <Button
          variant="outline"
          className="absolute right-12 bg-gray-50 h-12 bottom-6 w-36"
        >
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
        <Toaster />
      </Card>
    </>
  );
}

export const CloseIcon = () => {
  return (
    <motion.svg
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      exit={{
        opacity: 0,
        transition: {
          duration: 0.05,
        },
      }}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 text-black"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M18 6l-12 12" />
      <path d="M6 6l12 12" />
    </motion.svg>
  );
};
