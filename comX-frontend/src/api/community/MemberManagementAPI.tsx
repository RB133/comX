import { RootState } from "@/state/store";
import PROPS from "@/types/MemberMangementProps";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const backend_url = import.meta.env.VITE_BACKEND_URL;

export default function MemberManagementAPI({
  setConfirmAction,
  setConfirmMessage,
  setShowConfirmDialog,
  filteredMembers,
}: PROPS) {
  const user = useSelector((state: RootState) => state.userDetails);
  const { ID } = useParams();

  const queryClient = useQueryClient();

  // Check if the current user is an admin
  const isAdmin = useMemo(
    () =>
      filteredMembers.some(
        (m) =>
          (m.role === "ADMIN" || m.role === "OWNER") &&
          m.id === user.user?.id
      ),
    [filteredMembers, user]
  );

  const handleAction = (action: () => void, message: string) => {
    setConfirmAction(() => action);
    setConfirmMessage(message);
    setShowConfirmDialog(true);
  };

  // Function to handle invalidating queries
  const invalidateMembers = () => {
    queryClient.invalidateQueries({ queryKey: [`Member-List/${ID}`] });
  };

  // Mutation handlers
  const mutations = {
    promote: useMutation({
      mutationFn: async (details: {
        communityId: number;
        promoting_id: number;
      }) => {
        return axios.post(`${backend_url}/member/promote-member`, details, {
          withCredentials: true,
        });
      },
      onSuccess: invalidateMembers,
    }),
    demote: useMutation({
      mutationFn: async (details: {
        communityId: number;
        demoting_id: number;
      }) => {
        return axios.post(`${backend_url}/member/demote-member`, details, {
          withCredentials: true,
        });
      },
      onSuccess: invalidateMembers,
    }),
    ban: useMutation({
      mutationFn: async (details: {
        communityId: number;
        baning_id: number;
      }) => {
        return axios.post(`${backend_url}/member/ban-member`, details, {
          withCredentials: true,
        });
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [`Member-List/${ID}`] });
        queryClient.invalidateQueries({
          queryKey: [`communityList${user.user?.id}`],
        });
      },
    }),
    remove: useMutation({
      mutationFn: async (details: {
        communityId: number;
        removingId: number;
      }) => {
        return axios.post(`${backend_url}/member/remove-member`, details, {
          withCredentials: true,
        });
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [`Member-List/${ID}`] });
        queryClient.invalidateQueries({ queryKey: ["communityList"] });
      },
    }),
    accept: useMutation({
      mutationFn: async (details: {
        communityId: number;
        member_id: number;
      }) => {
        return axios.post(
          `${backend_url}/member/accept-join-request`,
          details,
          {
            withCredentials: true,
          }
        );
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [`Member-List/${ID}`] });
        queryClient.invalidateQueries({ queryKey: ["communityList"] });
      },
    }),
  };

  return { mutations, isAdmin, handleAction };
}
