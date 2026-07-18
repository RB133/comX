import axios from "axios";

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
