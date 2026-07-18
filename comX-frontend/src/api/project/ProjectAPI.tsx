import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { useParams } from "react-router-dom";

export default function ProjectAPI() {
  const { ID, projectId } = useParams();

  const { data, isLoading, error } = useQuery({
    queryKey: [`community${ID}/project/${projectId}`],
    queryFn: async () => {
      const response = await api.get(
        `/project/get-project-details/${ID}/${projectId}`
      );
      return response.data.data;
    },
    staleTime: Infinity,
  });

  return { project: data, projectLoading: isLoading, projectError: error };
}
