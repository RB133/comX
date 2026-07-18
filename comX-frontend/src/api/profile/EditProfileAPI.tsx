import { setUser } from "@/state/userDetails/userDetails";
import { RootState } from "@/state/store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { api } from "@/lib/api-client";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";


type EditProfileDetails = {
  designation: string;
  bio: string;
  location: string;
  website: string;
  phone: string;
  skills: string[];
  file?: File;
};

export default function EditProfileAPI() {
  const { username } = useParams();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const user = useSelector((state: RootState) => state.userDetails);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (details: EditProfileDetails) => {
      const formData = new FormData();
      formData.append("designation", details.designation);
      formData.append("bio", details.bio);
      formData.append("location", details.location);
      formData.append("website", details.website);
      formData.append("phone", details.phone);

      details.skills.forEach((skill) => {
        formData.append("skills", skill);
      });

      if (details.file) {
        formData.append("file", details.file);
      }

      const response = await api.put(
        `/user/edit-user-info/${username}`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data.data;
    },
    onSuccess(data) {
      queryClient.invalidateQueries({ queryKey: [`user-info-${username}`] });

      if (user.user && user.user.username === username) {
        dispatch(
          setUser({
            name: user.user.name,
            username: user.user.username,
            email: user.user.email,
            isLoggedIn: true,
            id: user.user.id,
            designation: data.designation,
            avatar: data.avatar,
          })
        );
      }

      toast.success("Profile updated successfully");
    },
    onError(error: unknown) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message || "Unable to update profile.";
        toast.error(errorMessage);
      } else {
        toast.error("Unable to update profile.");
      }
    },
  });

  return {
    handleEditProfile: mutateAsync,
    editProfilePending: isPending,
  };
}
