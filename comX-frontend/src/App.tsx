import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import HomePage from "./pages/general/Home";
import NotFoundPage from "./pages/general/404Page";
import ErrorPage from "./pages/general/ErrorPage";

const SignUp = lazy(() => import("./pages/auth/Signup"));
const LoginPage = lazy(() => import("./pages/auth/Login"));
const Contact = lazy(() => import("./pages/general/Contact"));
const Profile = lazy(() => import("./pages/profile/Profile"));
const ChatApp = lazy(() => import("./pages/chatApp/ChatApp"));
const Dashboard = lazy(() => import("./pages/dashboard/DashBoard"));
const CommunityLayout = lazy(() => import("./pages/community/Community"));
const MainCalendar = lazy(() => import("./pages/Calendar/MainCalendar"));
const BasicInformation = lazy(() => import("./pages/community-settings/BasicInfo"));
const MemberManagement = lazy(() => import("./pages/community-settings/MemberManagement"));
const NotificationSettings = lazy(() => import("./pages/community-settings/NotificationSettings"));
const Permissions = lazy(() => import("./pages/community-settings/Permissions"));
const ProjectDashboard = lazy(() => import("./pages/project/ProjectDashboard"));
const TaskPage = lazy(() => import("./pages/tasks/TasksPage"));
const ChatSkeleton = lazy(() => import("./pages/chatApp/ChatSkeleton"));
const Code = lazy(() => import("./pages/code/Code"));
const Call = lazy(() => import("./pages/call/Call"));

// Created once at module scope so the query cache survives re-renders.
const queryClient = new QueryClient();

const withSuspense = (element: React.ReactNode) => (
  <Suspense fallback={<div>Loading...</div>}>{element}</Suspense>
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
    <>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </>
  );
}

export default App;
