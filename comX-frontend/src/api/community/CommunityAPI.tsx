import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { useParams } from "react-router-dom";

export default function CommunityAPI() {
  const { ID } = useParams();

  const { data, isLoading, error } = useQuery({
    queryKey: [`communityDetails/${ID}`],
    queryFn: async () => {
      const response = await api.get(
        `/community/get-community-details/${ID}`,
        { withCredentials: true }
      );
      return response.data.data;
    },
    staleTime: Infinity,
  });

  return {
    community: data,
    communityLoading: isLoading,
    communityError: error,
  };
}
