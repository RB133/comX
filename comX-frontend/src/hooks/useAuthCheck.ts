import { LoginDetails } from "@/types/UserProfile";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "./useLocalStorage";

/** Redirects to the landing page (once) if there is no logged-in user. */
export default function useAuthCheck(user: LoginDetails | null) {
  const navigate = useNavigate();
  const { setItem: setTab } = useLocalStorage("tab", "Home");

  useEffect(() => {
    if (user) return;
    toast.error("Login Required");
    setTab(JSON.stringify("Home"));
    navigate("/");
    // Only react to changes in auth state, not to every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);
}
