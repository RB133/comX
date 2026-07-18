import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import axios from "axios";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/state/store";

export function CommunitySettingsAPI() {
  const { ID } = useParams();
  const user = useSelector((state: RootState) => state.userDetails);

  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (details: {
      name: string | null;
      description: string | null;
      scope: string;
      communityId: number;
      file: File | undefined;
    }) => {
      const response = await api.put(`/community/update-community`, details, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: [`communityDetails/${ID}`] });
      queryClient.invalidateQueries({ queryKey: [`communityList${user.user?.id}`] });
      toast.success("Community Details Updated");
    },
    onError(error: unknown) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message ?? "Unable to update community."
        : "Unable to update community.";
      toast.error(message);
    },
  });

  return {
    handleEditCommunityBasicInfo: mutateAsync,
    editCommunityBasicInfoPending: isPending,
  };
}
