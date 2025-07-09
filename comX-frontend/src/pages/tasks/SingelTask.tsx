import { useRef } from "react";
import { TaskGet } from "@/types/tasks";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useOutsideClick } from "@/hooks/use-outside-click";
import { useParams } from "react-router-dom";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useSelector } from "react-redux";
import { RootState } from "@/state/store";
import TaskFxn from "@/api/tasks/TasksFxnAPI";

export default function SingleTask({
  active,
  setActive,
}: {
  active: TaskGet | null;
  setActive: React.Dispatch<React.SetStateAction<TaskGet | null>>;
}) {

  const { ID, projectId } = useParams();

  const user = useSelector((state: RootState) => state.userDetails);

  const ref = useRef<HTMLDivElement>(null);

  useOutsideClick(ref, () => setActive(null));

  const {handleTaskComplete,taskCompletePending} = TaskFxn();

  const handleMarkAsDone = () => {
    handleTaskComplete({
      communityId: parseInt(ID!, 10),
      projectId: parseInt(projectId!, 10),
      taskId: active!.id,
    });
  };

  if (!active) {
    return null;
  }

  function convertDate(dateStr: string): string {
    const date = new Date(dateStr);

    const adjustedYear = date.getUTCFullYear() - 1;

    const day = date.getUTCDate();
    const month = date.toLocaleString("en-US", { month: "long" });

    return `${day} ${month} ${adjustedYear}`;
  }

  const isDone = active.status === "COMPLETED" || active.status === "PENDING";
  const progress =
    (active.status === "COMPLETED" || active.status === "PENDING") ? 100 : 0;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      >
        <motion.div
          ref={ref}
          layoutId={`card-${active.title}-${active.id}`}
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="w-full max-w-2xl bg-white dark:bg-neutral-800 rounded-2xl overflow-hidden shadow-xl"
        >
          <div className="relative">
            <motion.button
              className="absolute top-4 right-4 p-2 bg-white dark:bg-neutral-800 rounded-full text-neutral-600 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
              onClick={() => setActive(null)}
            >
              <X size={20} />
            </motion.button>
          </div>

          <div className="p-6 space-y-4">
            <div className="flex justify-between items-center">
              <motion.h3
                layoutId={`title-${active.title}-${active.id}`}
                className="text-2xl font-bold text-neutral-800 dark:text-neutral-100"
              >
                {active.title}
              </motion.h3>
              <Badge
                variant={isDone ? "success" : "secondary"}
                className="text-sm mr-12"
              >
                {isDone ? "Completed" : active.priority}
              </Badge>
            </div>

            <motion.div
              layoutId={`assignee-${active.title}-${active.id}`}
              className="flex items-center space-x-2 text-sm text-neutral-600 dark:text-neutral-300"
            >
              <img
                src={active.user.avatar}
                alt={active.user.name}
                className="w-6 h-6 rounded-full"
              />
              <span>{active.user.name}</span>
              <span>•</span>
              <span>{convertDate(active.deadline)}</span>
            </motion.div>

            <motion.p
              layoutId={`description-${active.description}-${active.id}`}
              className="text-neutral-600 dark:text-neutral-300"
            >
              {active.description}
            </motion.p>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm text-neutral-600 dark:text-neutral-300">
                <span>Progress</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>

            <motion.div
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-neutral-600 dark:text-neutral-300 text-sm max-h-40 overflow-y-auto"
            >
              {typeof active.content === "function"
                ? active.content
                : active.content}
            </motion.div>

            {user.user!.id === active.user.id && (
              <div className="flex justify-between items-center pt-4">
                {taskCompletePending ? (
                  <Button variant="default" disabled={true}>
                    <ReloadIcon className="mr-2 animate-spin w-4 h-4 flex justify-center items-center" />
                  </Button>
                ) : (
                  <Button
                    variant={isDone ? "outline" : "default"}
                    className={`${
                      isDone
                        ? "bg-green-100 text-green-700"
                        : "bg-blue-500 hover:bg-blue-600"
                    } transition-colors`}
                    onClick={handleMarkAsDone}
                  >
                    {isDone ? (
                      <>
                        <CheckCircle size={18} className="mr-2" />
                        Completed
                      </>
                    ) : (
                      <>
                        <Circle size={18} className="mr-2" />
                        Mark as Done
                      </>
                    )}
                  </Button>
                )}
                <motion.a
                  layoutId={`button-${active.title}-${active.id}`}
                  href={`https://${active.referenceLinks[0]}`}
                  target="_blank"
                  className="px-4 py-2 text-sm rounded-full font-medium bg-green-500 text-white hover:bg-green-600 transition-colors"
                >
                  View Docs
                </motion.a>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
