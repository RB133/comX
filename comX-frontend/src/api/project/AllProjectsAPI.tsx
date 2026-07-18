import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { useParams } from "react-router-dom";

export default function AllProjectAPI() {
  const { ID } = useParams();

  const { data, isLoading, error } = useQuery({
    queryKey: [`project-list/${ID}`],
    queryFn: async () => {
      const response = await api.get(
        `/project/get-all-projects/${ID}`,
        {
          withCredentials: true,
        }
      );
      return response.data.data;
    },
    staleTime: Infinity,
  });

  return { projects: data, projectsLoading: isLoading, projectsError: error };
}
