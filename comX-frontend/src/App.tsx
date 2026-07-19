import { ComponentType, lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import HomePage from "./pages/general/Home";
import NotFoundPage from "./pages/general/404Page";
import ErrorPage from "./pages/general/ErrorPage";
import PageLoader from "./components/PageLoader";

function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.message || "Something went wrong.";
  }
  return error instanceof Error ? error.message : "Something went wrong.";
}

/**
 * Wraps React.lazy() so a stale chunk reference (a tab left open across a
 * new deploy, which renames every chunk file) self-heals with a single
 * automatic reload instead of showing the user an error. If the reload
 * doesn't fix it, the failure is a real error and is allowed to propagate
 * normally to the route's errorElement.
 */
function lazyWithReload<T extends ComponentType<unknown>>(
  componentImport: () => Promise<{ default: T }>
) {
  return lazy(async () => {
    const reloadedKey = "chunk-load-reloaded";
    try {
      const component = await componentImport();
      sessionStorage.removeItem(reloadedKey);
      return component;
    } catch (error) {
      if (sessionStorage.getItem(reloadedKey) !== "true") {
        sessionStorage.setItem(reloadedKey, "true");
        window.location.reload();
        return new Promise<never>(() => {}); // reload is already underway
      }
      throw error;
    }
  });
}

const SignUp = lazyWithReload(() => import("./pages/auth/Signup"));
const LoginPage = lazyWithReload(() => import("./pages/auth/Login"));
const Contact = lazyWithReload(() => import("./pages/general/Contact"));
const Profile = lazyWithReload(() => import("./pages/profile/Profile"));
const ChatApp = lazyWithReload(() => import("./pages/chatApp/ChatApp"));
const Dashboard = lazyWithReload(() => import("./pages/dashboard/DashBoard"));
const CommunityLayout = lazyWithReload(() => import("./pages/community/Community"));
const MainCalendar = lazyWithReload(() => import("./pages/Calendar/MainCalendar"));
const BasicInformation = lazyWithReload(() => import("./pages/community-settings/BasicInfo"));
const MemberManagement = lazyWithReload(() => import("./pages/community-settings/MemberManagement"));
const NotificationSettings = lazyWithReload(() => import("./pages/community-settings/NotificationSettings"));
const Permissions = lazyWithReload(() => import("./pages/community-settings/Permissions"));
const ProjectDashboard = lazyWithReload(() => import("./pages/project/ProjectDashboard"));
const TaskPage = lazyWithReload(() => import("./pages/tasks/TasksPage"));
const ChatSkeleton = lazyWithReload(() => import("./pages/chatApp/ChatSkeleton"));
const Code = lazyWithReload(() => import("./pages/code/Code"));
const Call = lazyWithReload(() => import("./pages/call/Call"));

// Created once at module scope so the query cache survives re-renders.
const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => {
      // The 401 interceptor in api-client.ts already logs the user out and
      // redirects on an expired/invalid session — a toast here would just
      // be redundant noise on top of that.
      if (axios.isAxiosError(error) && error.response?.status === 401) return;
      toast.error(getErrorMessage(error));
    },
  }),
});

const withSuspense = (element: React.ReactNode) => (
  <Suspense fallback={<PageLoader />}>{element}</Suspense>
);

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <HomePage />,
      errorElement: <NotFoundPage />,
    },
    {
      path: "SignUp",
      element: withSuspense(<SignUp />),
    },
    {
      path: "login",
      element: withSuspense(<LoginPage />),
    },
    {
      path: "dashboard",
      element: withSuspense(<Dashboard />),
      errorElement: <ErrorPage />,
    },
    {
      path: "contact",
      element: withSuspense(<Contact />),
    },
    {
      path: "profile/:username",
      element: withSuspense(<Profile />),
      errorElement: <ErrorPage />,
    },
    {
      path: "community/:ID",
      element: withSuspense(<CommunityLayout />),
      errorElement: <ErrorPage />,
      children: [
        {
          path: "calendar",
          element: withSuspense(<MainCalendar />),
        },
        {
          path: "call",
          element: withSuspense(<Call />),
        },
        {
          path: "settings/basic-info",
          element: withSuspense(<BasicInformation />),
        },
        {
          path: "settings/member-management",
          element: withSuspense(<MemberManagement />),
        },
        {
          path: "settings/privacy-permissions",
          element: withSuspense(<Permissions />),
        },
        {
          path: "settings/notification",
          element: withSuspense(<NotificationSettings />),
        },
        {
          path: "chat-skeleton",
          element: withSuspense(<ChatSkeleton />),
        },
        {
          path: "chat/:projectId",
          element: withSuspense(<ChatApp />),
        },
        {
          path: "project/:projectId",
          element: withSuspense(<ProjectDashboard />),
        },
        {
          path: "project",
          element: withSuspense(<ProjectDashboard />),
        },
        {
          path: "task",
          element: withSuspense(<TaskPage />),
        },
        {
          path: "task/:projectId",
          element: withSuspense(<TaskPage />),
        },
        {
          path: "code",
          element: withSuspense(<Code />),
        },
      ],
    },
  ]);

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster position="top-right" />
    </QueryClientProvider>
  );
}

export default App;
