import { RootState } from "@/state/store";
import { MemberManagementProps } from "@/types/MemberManagementProps";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { isAdminRole } from "@/lib/roles";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";


export default function MemberManagementAPI({
  setConfirmAction,
  setConfirmMessage,
  setShowConfirmDialog,
  filteredMembers,
}: MemberManagementProps) {
  const user = useSelector((state: RootState) => state.userDetails);
  const { ID } = useParams();

  const queryClient = useQueryClient();

  // Check if the current user is an admin
  const isAdmin = useMemo(
    () =>
      filteredMembers.some(
        (m) => isAdminRole(m.role) && m.id === user.user?.id
      ),
    [filteredMembers, user.user?.id]
  );

  const handleAction = (action: () => void, message: string) => {
    setConfirmAction(() => action);
    setConfirmMessage(message);
    setShowConfirmDialog(true);
  };

  const invalidateMembers = () => {
    queryClient.invalidateQueries({ queryKey: [`Member-List/${ID}`] });
  };

  const invalidateCommunityList = () => {
    queryClient.invalidateQueries({ queryKey: [`communityList${user.user?.id}`] });
  };

  // Mutation handlers
  const mutations = {
    promote: useMutation({
      mutationFn: async (details: { communityId: number; promoting_id: number }) => {
        return api.post(`/member/promote-member`, details);
      },
      onSuccess: invalidateMembers,
    }),
    demote: useMutation({
      mutationFn: async (details: { communityId: number; demoting_id: number }) => {
        return api.post(`/member/demote-member`, details);
      },
      onSuccess: invalidateMembers,
    }),
    ban: useMutation({
      mutationFn: async (details: { communityId: number; baning_id: number }) => {
        return api.post(`/member/ban-member`, details);
      },
      onSuccess: () => {
        invalidateMembers();
        invalidateCommunityList();
      },
    }),
    remove: useMutation({
      mutationFn: async (details: { communityId: number; removingId: number }) => {
        return api.post(`/member/remove-member`, details);
      },
      onSuccess: () => {
        invalidateMembers();
        invalidateCommunityList();
      },
    }),
    accept: useMutation({
      mutationFn: async (details: { communityId: number; memberId: number }) => {
        return api.post(`/member/accept-join-request`, details);
      },
      onSuccess: () => {
        invalidateMembers();
        invalidateCommunityList();
      },
    }),
  };

  return { mutations, isAdmin, handleAction };
}
