import ProjectAPI from "@/api/project/ProjectAPI";
import { ItemPicker } from "@/components/Item-Picker";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { LabelInputContainer } from "@/pages/auth/components/SignUpExtraComponenets";
import ErrorPage from "@/pages/genral/ErrorPage";
import { Task } from "@/types/tasks";
import { Member } from "@/types/UserProfile";
import { ReloadIcon } from "@radix-ui/react-icons";
import { Label } from "@radix-ui/react-label";
import { useMutation , useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";

const backend_url = import.meta.env.VITE_BACKEND_URL;

export default function CreateTask({ milestone }: { milestone: string }) {
  const { ID, projectId } = useParams();

  const [start, setStart] = useState<Date>(new Date(Date.now()));
  const [end, setEnd] = useState<Date>(new Date(Date.now()));
  const [assignee, setAssignee] = useState<string>("");
  const [priority, setPriority] = useState<
    "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"
  >("MEDIUM");

  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    await handleCreateTask({
      title: formData.get("task-title") as string,
      description: formData.get("task-description") as string,
      milestone: milestone,
      priority: priority,
      deadline: end,
      createdAt: start,
      content: formData.get("task-content") as string,
      projectId: parseInt(projectId!, 10),
      assignId: parseInt(assignee, 10),
      referenceLinks: [formData.get("task-reference") as string],
      status: "in-progress",
    });
  };

  const { mutateAsync: handleCreateTask, isPending } = useMutation({
    mutationFn: async (data: Task) => {
      console.log(data);
      const response = await axios.post(
        `${backend_url}/task/add-task`,
        { ...data, communityId: parseInt(ID!, 10) },
        { withCredentials: true }
      );
      return response.data;
    },
    onSuccess(data) {
      console.log(data);
      toast.success("Task Created Successfully!");
      queryClient.invalidateQueries({
        queryKey: [`community${ID}/project/${projectId}/task`],
      });
    },
    onError(error: unknown) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message || "Please try again.";
        toast.error(errorMessage);
      } else {
        toast.error("Please try again.");
      }
    },
  });

  const { project, projectLoading, projectError } = ProjectAPI();
  

  if (projectLoading) {
    return <div>Loading ...</div>;
  }

  if (projectError) {
    return <ErrorPage />;
  }

  return (
    <div className="mr-4">
      <AlertDialog>
        <AlertDialogTrigger>
          <span className="h-8 bg-green-500 hover:bg-green-600 px-4 py-2 text-white font-bold rounded-md">
            Add
          </span>
        </AlertDialogTrigger>
        <AlertDialogContent className="h-full overflow-y-scroll no-scrollbar">
          <AlertDialogHeader>
            <AlertDialogTitle>Create Task</AlertDialogTitle>
            <AlertDialogDescription />
          </AlertDialogHeader>
          <form onSubmit={handleSubmit}>
            <LabelInputContainer className="mb-4">
              <Label htmlFor="task-title">Title</Label>
              <Input
                id="task-title"
                name="task-title"
                placeholder="Title"
                required
              />
            </LabelInputContainer>
            <LabelInputContainer className="mb-4">
              <Label htmlFor="task-description">Description</Label>
              <Textarea
                id="task-description"
                name="task-description"
                placeholder="Description"
                required
              />
            </LabelInputContainer>
            <LabelInputContainer className="mb-4">
              <Label htmlFor="task-content">Content</Label>
              <Textarea
                id="task-content"
                name="task-content"
                placeholder="Content"
              />
            </LabelInputContainer>
            <LabelInputContainer className="mb-4">
              <Label htmlFor="task-start-date">Start Date</Label>
              <DatePicker date={start} setDate={setStart} />
            </LabelInputContainer>
            <LabelInputContainer className="mb-4">
              <Label htmlFor="task-end-date">End Date</Label>
              <DatePicker date={end} setDate={setEnd} />
            </LabelInputContainer>
            <LabelInputContainer className="mb-4">
              <Label htmlFor="task-assignee">Assignee</Label>
              <ItemPicker
                itemList={project.projectMembers.map((item: Member) => {
                  return { id: item.id, value: item.name };
                })}
                value={assignee}
                setValue={setAssignee}
              />
            </LabelInputContainer>
            <LabelInputContainer className="mb-4">
              <Label htmlFor="task-reference">References</Label>
              <Input
                id="task-reference"
                name="task-reference"
                placeholder="www.google.com"
              />
            </LabelInputContainer>
            <LabelInputContainer className="mb-4">
              <Label htmlFor="task-priority">Priority</Label>
              <div className="flex gap-2">
                <Button
                  className={`${
                    priority === "LOW" && "bg-green-600 text-white"
                  }  hover:bg-green-700 hover:text-white px-4 py-2 rounded transition duration-300`}
                  onClick={() => setPriority("LOW")}
                  type="button"
                >
                  Low
                </Button>

                <Button
                  className={`${
                    priority === "MEDIUM" && "bg-yellow-600"
                  }  hover:bg-yellow-700 hover:text-white px-4 py-2 rounded transition duration-300`}
                  onClick={() => setPriority("MEDIUM")}
                  type="button"
                >
                  Medium
                </Button>

                <Button
                  className={`${
                    priority === "HIGH" && "bg-orange-600 text-white"
                  }  hover:bg-orange-700 hover:text-white px-4 py-2 rounded transition duration-300`}
                  onClick={() => setPriority("HIGH")}
                  type="button"
                >
                  High
                </Button>

                <Button
                  className={`${
                    priority === "CRITICAL" && "bg-red-600 text-white"
                  }  hover:bg-red-700 hover:text-white px-4 py-2 rounded transition duration-300`}
                  onClick={() => setPriority("CRITICAL")}
                  type="button"
                >
                  Critical
                </Button>
              </div>
            </LabelInputContainer>
            <AlertDialogFooter>
              <div className="flex w-full justify-between">
                <AlertDialogCancel>
                  <span className="min-w-full bg-red-500 px-4 py-2 font-semibold text-white rounded-lg">
                    Cancel
                  </span>
                </AlertDialogCancel>
                <div>
                  {isPending ? (
                    <Button variant="default" disabled={true}>
                      <ReloadIcon className="mr-2 animate-spin w-4 h-4 flex justify-center items-center" />
                    </Button>
                  ) : (
                    <Button
                      type={"submit"}
                      variant={"green"}
                      className="w-full"
                    >
                      Create Task
                    </Button>
                  )}
                </div>
              </div>
            </AlertDialogFooter>
          </form>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
