import axios from "axios";
import { store } from "@/state/store";
import { clearUser } from "@/state/userDetails/userDetails";

/**
 * Shared Axios instance for every backend call.
 *
 * - `baseURL` comes from VITE_BACKEND_URL, so callers use relative paths
 *   like `api.get("/community/get-all-communities")`.
 * - `withCredentials` is always on, so the httpOnly auth cookie is sent.
 */
export const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
});

// A 401 means the auth cookie is missing, expired, or was signed by a since-
// rotated secret. Left alone, every screen just keeps re-firing the same
// failed request. Instead, drop the stale local session once and send the
// user back to log in, rather than leaving them stuck logged-in-but-broken.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      const wasLoggedIn = store.getState().userDetails.isLoggedIn;
      if (wasLoggedIn) {
        store.dispatch(clearUser());
        if (!window.location.pathname.startsWith("/login")) {
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  }
);
