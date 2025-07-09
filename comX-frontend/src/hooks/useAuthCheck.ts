import { LoginDetails } from "@/types/UserProfile";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "./useLocalStorage";

export default function useAuthCheck(user: LoginDetails | null) {
  const navigate = useNavigate();
  const { setItem: setTab } = useLocalStorage("tab", "Home");

  useEffect(() => {
    if (user) return;
    toast.error("Login Required");
    navigate("/");
    setTab(JSON.stringify("Home"));
  });
}
