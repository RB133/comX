import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useParams } from "react-router-dom";

const backend_url = import.meta.env.VITE_BACKEND_URL;

export default function AllProjectAPI() {
  const { ID } = useParams();

  const { data, isLoading, error } = useQuery({
    queryKey: [`project-list/${ID}`],
    queryFn: async () => {
      const response = await axios.get(
        `${backend_url}/project/get-all-projects/${ID}`,
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
