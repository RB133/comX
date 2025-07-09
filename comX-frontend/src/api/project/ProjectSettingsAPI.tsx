import { RootState } from "@/state/store";
import { Milestone } from "@/types/Project";
import { Member } from "@/types/UserProfile";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const backend_url = import.meta.env.VITE_BACKEND_URL;

export function EditBasicInfo({
  name,
  description,
  deadline,
}: {
  name: string;
  description: string;
  deadline: Date;
}) {
  const { ID, projectId } = useParams();

  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async () => {
      const data = {
        communityId: parseInt(ID!, 10),
        name,
        description,
        deadline,
        projectId: parseInt(projectId!, 10),
      };
      console.log(data);
      const response = await axios.patch(
        `${backend_url}/project/edit-basic-info`,
        data,
        { withCredentials: true }
      );
      return response.data;
    },
    onSuccess(data) {
      console.log(data);
      toast.success("Project Edited Successfully!");
      queryClient.invalidateQueries({ queryKey: [`project-list/${ID}`] });
    },
    onError(error: unknown) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message || "Please try again.";
        toast.error(errorMessage);
      } else {
        toast.error("Please try again.");
      }
    },
  });

  return { handleEditBasicInfo: mutateAsync, editBasicInfoPending: isPending };
}

export function EditMilestone({ milestones }: { milestones: Milestone[] }) {
  const { ID, projectId } = useParams();

  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async () => {
      const data = {
        communityId: parseInt(ID!, 10),
        milestones: milestones.map((item) => item.name),
        projectId: parseInt(projectId!, 10),
      };
      console.log(data);
      const response = await axios.patch(
        `${backend_url}/project/edit-milestone`,
        data,
        { withCredentials: true }
      );
      return response.data;
    },
    onSuccess(data) {
      console.log(data);
      toast.success("Project Edited Successfully!");
      queryClient.invalidateQueries({
        queryKey: [`community${ID}/project/${projectId}`],
      });
      toast.success("Milestones Edited Successfully");
    },
    onError(error: unknown) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message || "Please try again.";
        toast.error(errorMessage);
      } else {
        toast.error("Please try again.");
      }
    },
  });

  return {
    handleEditMilestones: mutateAsync,
    editMilestonesPending: isPending,
  };
}

export function EditTeamMembers({
  project,
  projectMembers,
}: {
  project: Member[];
  projectMembers: Member[];
}) {
  const { ID, projectId } = useParams();

  const user = useSelector((state: RootState) => state.userDetails);

  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async () => {
      const data = {
        communityId: parseInt(ID!, 10),
        add: projectMembers
          .filter((item) => !project.some((member) => member.id === item.id))
          .map((item) => item.id),
        remove: project
          .filter(
            (item) => !projectMembers.some((member) => member.id === item.id)
          )
          .filter((item) => item.id !== user.user?.id)
          .map((item) => item.id),
        projectId: parseInt(projectId!, 10),
      };
      const response = await axios.patch(
        `${backend_url}/project/edit-member`,
        data,
        { withCredentials: true }
      );
      return response.data;
    },
    onSuccess() {
      toast.success("Members Edited Successfully!");
      queryClient.invalidateQueries({
        queryKey: [`community${ID}/project/${projectId}`],
      });
    },
    onError(error: unknown) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message || "Please try again.";
        toast.error(errorMessage);
      } else {
        toast.error("Please try again.");
      }
    },
  });

  return {
    handleEditTeamMembers: mutateAsync,
    editTeamMembersPending: isPending,
  };
}
