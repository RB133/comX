import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { api } from "@/lib/api-client";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";

export default function CreateProjectAPI() {
  const { ID } = useParams();

  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (data: {
      communityId: number;
      name: string;
      description: string;
      members: number[];
      milestones: string[];
      deadline: Date;
    }) => {
      const response = await api.post(
        `/project/create-project`,
        data,
        { withCredentials: true }
      );
      return response.data;
    },
    onSuccess(data) {
      console.log(data);
      toast.success("Project Created Successfully!");
      queryClient.invalidateQueries({ queryKey: [`project-list/${ID}`] });
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

  return { handleCreateProject: mutateAsync, createProjectPending: isPending };
}
