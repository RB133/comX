import { Member } from "@/types/UserProfile";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useParams } from "react-router-dom";

const backend_url = import.meta.env.VITE_BACKEND_URL;

export default function CommunityMembersAPI() {
  const { ID } = useParams();

  const {
    data = [],
    error,
    isLoading,
  } = useQuery<Member[], Error>({
    queryKey: [`Member-List/${ID}`],
    queryFn: async () => {
      const response = await axios.get(
        `${backend_url}/member/get-community-members/${ID}`,
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
