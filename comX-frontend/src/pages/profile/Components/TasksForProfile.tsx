import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CheckCircle, Clock, Disc, PlayCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { PublicProfile } from "@/types/UserProfile";

type Task = {
  id: number;
  title: string;
  status: "COMPLETED" | "PENDING" | "INPROGRESS";
  date: string;
};

export default function TaskForProfile({ profile }: { profile: PublicProfile }) {
  const [activeTab, setActiveTab] = useState<
    "COMPLETED" | "PENDING" | "INPROGRESS" | "ALL"
  >("COMPLETED");

  const tasks: Task[] = profile.Task.map((task) => ({
    id: task.id,
    title: task.title,
    status: task.status,
    date: (task.completedDate ?? task.deadline ?? task.createdAt).slice(0, 10),
  }));

  const filteredTasks = tasks.filter(
    (task) => task.status === activeTab || activeTab === "ALL"
  );

  return (
    <Card className="p-4 border-0 shadow-none">
      <div className="flex justify-center space-x-2 mb-6">
        <TabButton
          status="ALL"
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        <TabButton
          status="COMPLETED"
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        <TabButton
          status="PENDING"
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        <TabButton
          status="INPROGRESS"
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      </div>

      {filteredTasks.length > 0 ? (
        <div className="overflow-x-auto max-h-[232px] no-scrollbar">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50%]">
                  <button className="font-medium flex items-center">
                    Title{" "}
                  </button>
                </TableHead>
                <TableHead className="w-[25%]"></TableHead>
                <TableHead className="w-[25%]"></TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredTasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell className="font-medium">{task.title}</TableCell>
                  <TableCell>
                    <span className="flex items-center">
                      {task.status === "COMPLETED" && (
                        <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                      )}
                      {task.status === "PENDING" && (
                        <Clock className="mr-2 h-4 w-4 text-yellow-500" />
                      )}
                      {task.status === "INPROGRESS" && (
                        <PlayCircle className="mr-2 h-4 w-4 text-violet-500" />
                      )}
                      {task.status === "COMPLETED" && "Completed"}
                      {task.status === "PENDING" && "Pending"}
                      {task.status === "INPROGRESS" && "In-Progress"}
                    </span>
                  </TableCell>
                  <TableCell>{task.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <p className="text-center text-muted-foreground">
          No tasks found in this category.
        </p>
      )}
    </Card>
  );
}

function TabButton({
  status,
  activeTab,
  setActiveTab,
}: {
  status: "COMPLETED" | "PENDING" | "INPROGRESS" | "ALL";
  activeTab: string;
  setActiveTab: (
    status: "COMPLETED" | "PENDING" | "INPROGRESS" | "ALL"
  ) => void;
}) {
  const isActive = status === activeTab;
  const Icon =
    status === "COMPLETED"
      ? CheckCircle
      : status === "PENDING"
      ? Clock
      : status === "ALL"
      ? Disc
      : PlayCircle;

  return (
    <Button
      variant={isActive ? "default" : "outline"}
      onClick={() => setActiveTab(status)}
      className={`capitalize ${
        isActive ? "bg-primary text-primary-foreground" : ""
      }`}
    >
      <Icon className="w-4 h-4 mr-2" />
      {status}
    </Button>
  );
}
