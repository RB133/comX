import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { useParams } from "react-router-dom";

export default function TasksAPI() {
  const { ID, projectId } = useParams();

  const {
    data,
    isLoading,
    error,
  } = useQuery({
    queryKey: [`community${ID}/project/${projectId}/task`],
    queryFn: async () => {
      const response = await api.get(
        `/task/get-all-tasks-in-project/${ID}/${projectId}`
      );
      return response.data.data;
    },
    staleTime: Infinity,
  });

  return { tasks: data, tasksLoading: isLoading, tasksError: error };
}
