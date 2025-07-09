import { TaskGet } from "@/types/tasks";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { motion, AnimatePresence } from "framer-motion";
import {
  CalendarIcon,
  CheckCircleIcon,
  ClockIcon,
  AlertCircleIcon,
  CircleIcon,
  LucideProps,
} from "lucide-react";
import { useParams } from "react-router-dom";
import ProjectAPI from "@/api/project/ProjectAPI";
import { useSelector } from "react-redux";
import { RootState } from "@/state/store";
import TaskFxn from "@/api/tasks/TasksFxnAPI";
import ErrorPage from "../genral/ErrorPage";

export default function TasksList({
  cards,
  setActive,
}: {
  cards: TaskGet[];
  setActive: React.Dispatch<React.SetStateAction<TaskGet | null>>;
}) {
  const getStatusInfo = (status: string) => {
    switch (status) {
      case "INPROGRESS":
        return { color: "bg-blue-500", icon: ClockIcon, label: "In Progress" };
      case "PENDING":
        return { color: "bg-yellow-500", icon: CircleIcon, label: "Pending" };
      case "OVERDUE":
        return { color: "bg-red-500", icon: AlertCircleIcon, label: "Overdue" };
      case "COMPLETED":
        return {
          color: "bg-green-500",
          icon: CheckCircleIcon,
          label: "Completed",
        };
      default:
        return { color: "bg-gray-500", icon: CircleIcon, label: "Unknown" };
    }
  };

  return (
    <Card className="w-full border-none shadow-none">
      <CardContent>
        <div className="grid grid-cols-6 gap-4 mb-2 px-6 font-semibold text-muted-foreground">
          <h3 className="col-span-3 text-xl">Task</h3>
          <p>Assignee</p>
          <p className="text-center -translate-x-4">Status</p>
          <p className="text-center -translate-x-2">Due Date</p>
        </div>
        <ScrollArea className="h-[calc(100vh-200px)] pr-4">
          <AnimatePresence>
            <div className="flex flex-col gap-4 mt-2">
              {cards.map((card) => (
                <TaskItem
                  key={`card-${card.title}-${card.id}`}
                  card={card}
                  setActive={setActive}
                  getStatusInfo={getStatusInfo}
                />
              ))}
            </div>
          </AnimatePresence>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

function TaskItem({
  card,
  setActive,
  getStatusInfo,
}: {
  card: TaskGet;
  setActive: (card: TaskGet) => void;
  getStatusInfo: (status: string) => {
    color: string;
    icon: React.ForwardRefExoticComponent<
      Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
    >;
    label: string;
  };
}) {
  const user = useSelector((state: RootState) => state.userDetails);

  const { color, icon: StatusIcon, label } = getStatusInfo(card.status);

  const { projectId, ID } = useParams();

  function convertDate(dateStr: string): string {
    const date = new Date(dateStr);

    const adjustedYear = date.getUTCFullYear() - 1;

    const day = date.getUTCDate();
    const month = date.toLocaleString("en-US", { month: "long" });

    return `${day} ${month} ${adjustedYear}`;
  }

  const { project, projectLoading, projectError } = ProjectAPI();

  const { handleTaskVerdict, taskVerdictPending } = TaskFxn();

  const handleVerdict = (s: string, completedDate: Date, taskId: number) => {
    handleTaskVerdict({
      completedDate,
      taskId,
      verdict: s,
      communityId: parseInt(ID!, 10),
      projectId: parseInt(projectId!, 10),
    });
  };

  if (projectLoading) return <div>Loading ...</div>;
  if (projectError) return <ErrorPage />;

  const isAdmin = user.user?.id === project.ownerId;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            layoutId={`card-${card.title}-${card.id}`}
            onClick={() => setActive(card)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-6 gap-4 items-center p-4 rounded-lg cursor-pointer hover:bg-muted shadow-even3 mx-2 justify-center"
          >
            <motion.div
              layoutId={`image-${card.title}-${card.id}`}
              className="col-span-3 flex items-center space-x-4 justify-between"
            >
              <div>
                <motion.h3
                  layoutId={`title-${card.title}-${card.id}`}
                  className="font-semibold text-foreground line-clamp-1"
                >
                  {card.title}
                </motion.h3>
                <p className="text-sm text-muted-foreground line-clamp-1">
                  {card.description}
                </p>
              </div>
              {!taskVerdictPending && isAdmin && card.status === "PENDING" && (
                <div className="flex gap-2 justify-center items-center h-full">
                  <motion.button
                    className="px-4 py-2 rounded-lg bg-green-500 text-white font-semibold"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleVerdict(
                        "Accepted",
                        new Date(card.completedDate!),
                        card.id
                      );
                    }}
                  >
                    Accept
                  </motion.button>
                  <motion.button
                    className="px-4 py-2 rounded-lg bg-red-500 text-white font-semibold"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleVerdict(
                        "Rejected",
                        new Date(card.completedDate!),
                        card.id
                      );
                    }}
                  >
                    Decline
                  </motion.button>
                </div>
              )}
            </motion.div>

            <PersonInfo
              person={{
                name: card.user.name,
                designation: card.user.designation,
                avatar: card.user.avatar,
              }}
            />

            <div className="flex justify-center">
              <Badge
                variant="secondary"
                className={`${color} text-primary-foreground w-32 h-10 flex justify-center items-center hover:bg-${color}`}
              >
                <StatusIcon className="w-4 h-4 mr-1" />
                {label}
              </Badge>
            </div>

            <div className="flex justify-center items-center space-x-2 text-muted-foreground">
              <CalendarIcon className="w-4 h-4" />
              <span>{convertDate(card.deadline)}</span>
            </div>
          </motion.div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Click to view task details</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function PersonInfo({
  person,
}: {
  person: { name: string; avatar: string; designation: string };
}) {
  return (
    <div className="flex items-center space-x-2">
      <Avatar className="h-8 w-8">
        <AvatarImage src={person.avatar} alt={"person.name"} />
        <AvatarFallback>{person.name.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="text-sm">
        <p className="font-medium text-foreground line-clamp-1">
          {person.name}
        </p>
        <p className="text-xs text-muted-foreground line-clamp-1">
          {person.designation}
        </p>
      </div>
    </div>
  );
}
