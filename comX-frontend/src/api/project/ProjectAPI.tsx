import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { useParams } from "react-router-dom";
import { ProjectDetails } from "@/types/Project";

export default function ProjectAPI() {
  const { ID, projectId } = useParams();

  const { data, isLoading, error } = useQuery<ProjectDetails>({
    queryKey: [`community${ID}/project/${projectId}`],
    queryFn: async () => {
      const response = await api.get(
        `/project/get-project-details/${ID}/${projectId}`
      );
      return response.data.data;
    },
    staleTime: Infinity,
  });

  return { project: data as ProjectDetails, projectLoading: isLoading, projectError: error };
}
