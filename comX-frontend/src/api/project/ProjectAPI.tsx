import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useParams } from "react-router-dom";

const backend_url = import.meta.env.VITE_BACKEND_URL;

export default function ProjectAPI() {
  const { ID, projectId } = useParams();

  const { data, isLoading, error } = useQuery({
    queryKey: [`community${ID}/project/${projectId}`],
    queryFn: async () => {
      const response = await axios.get(
        `${backend_url}/project/get-project-details/${ID}/${projectId}`,
        {
          withCredentials: true,
        }
      );
      return response.data.data;
    },
    staleTime: Infinity,
  });

  return { project: data, projectLoading: isLoading, projectError: error };
}
