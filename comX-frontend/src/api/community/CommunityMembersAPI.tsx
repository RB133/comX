import { Member } from "@/types/UserProfile";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { useParams } from "react-router-dom";

export default function CommunityMembersAPI() {
  const { ID } = useParams();

  const {
    data = [],
    error,
    isLoading,
  } = useQuery<Member[], Error>({
    queryKey: [`Member-List/${ID}`],
    queryFn: async () => {
      const response = await api.get(
        `/member/get-community-members/${ID}`,
        { withCredentials: true }
      );
      return response.data.data.members;
    },
    staleTime: Infinity,
  });

  return {
    communityMembers: data,
    communityMembersLoading: isLoading,
    communityMembersError: error,
  };
}
