import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";

const backend_url = import.meta.env.VITE_BACKEND_URL;

export function CommunitySettingsAPI() {
  const { ID } = useParams();

  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (details: {
      name: string | null;
      description: string | null;
      scope: string;
      communityId: number;
      file: File | undefined;
    }) => {
      console.log(typeof details.communityId);
      const response = await axios.put(
        `${backend_url}/community/update-community`,
        details,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    },
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: [`communityDetails/${ID}`, "communityList"],
      });
      toast.success("Community Details Updated");
    },
    onError(error) {
      console.error("Update failed:", error);
    },
  });

  return {
    handleEditCommunityBasicInfo: mutateAsync,
    editCommunityBasicInfoPending: isPending,
  };
}
