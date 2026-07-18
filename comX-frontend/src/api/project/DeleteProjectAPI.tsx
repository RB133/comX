import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { api } from "@/lib/api-client";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";


export default function DeleteProjectAPI() {
  const { ID, projectId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async () => {
      const response = await api.delete(`/project/delete-project`, {
        data: {
          communityId: parseInt(ID!, 10),
          projectId: parseInt(projectId!, 10),
        },
      });
      return response.data;
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: [`project-list/${ID}`] });
      queryClient.removeQueries({ queryKey: [`community${ID}/project/${projectId}`] });
      queryClient.removeQueries({ queryKey: [`community${ID}/project/${projectId}/task`] });
      toast.success("Project deleted successfully");
      navigate(`/community/${ID}/project`);
    },
    onError(error: unknown) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message || "Unable to delete project.";
        toast.error(errorMessage);
      } else {
        toast.error("Unable to delete project.");
      }
    },
  });

  return {
    handleDeleteProject: mutateAsync,
    deleteProjectPending: isPending,
  };
}
