import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { useParams } from "react-router-dom";
import { PublicProfile } from "@/types/UserProfile";


export default function ProfileAPI() {
  const { username } = useParams();

  const { data, isLoading, error } = useQuery<PublicProfile>({
    queryKey: [`user-info-${username}`],
    queryFn: async () => {
      const response = await api.get(`/user/get-user-info/${username}`);

      return response.data.data;
    },
  });

  return {
    profile: data as PublicProfile,
    profileLoading: isLoading,
    profileError: error,
  };
}
