import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";

const backend_url = import.meta.env.VITE_BACKEND_URL;

export default function TaskFxn() {
  const { ID, projectId } = useParams();

  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (data: {
      communityId: number;
      projectId: number;
      taskId: number;
    }) => {
      const response = await axios.put(
        `${backend_url}/task/complete-task`,
        data,
        { withCredentials: true }
      );
      return response.data;
    },
    onSuccess(data) {
      toast.success(`${data.data}`);
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

  const { mutateAsync: handleTaskVerdict, isPending: taskVerdictPending } =
    useMutation({
      mutationFn: async (data: {
        verdict: string;
        taskId: number;
        completedDate: Date;
        communityId: number;
        projectId: number;
      }) => {
        const response = await axios.put(
          `${backend_url}/task/task-verdict`,
          data,
          { withCredentials: true }
        );
        return response.data;
      },
      onSuccess() {
        toast.success("Task Verdict Given");
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

  return {
    handleTaskComplete: mutateAsync,
    taskCompletePending: isPending,
    handleTaskVerdict,
    taskVerdictPending,
  };
}
