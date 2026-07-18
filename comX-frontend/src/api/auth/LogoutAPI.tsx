import { clearUser } from "@/state/userDetails/userDetails";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { api } from "@/lib/api-client";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";


export default function LogoutAPI() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async () => {
      const response = await api.get(`/auth/logout`);
      return response.data;
    },
    onSuccess() {
      dispatch(clearUser());
      queryClient.clear();
      toast.success("Logged out successfully");
      navigate("/login");
    },
    onError(error: unknown) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message || "Unable to log out right now.";
        toast.error(errorMessage);
      } else {
        toast.error("Unable to log out right now.");
      }
    },
  });

  return {
    handleLogout: mutateAsync,
    logoutPending: isPending,
  };
}
