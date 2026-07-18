import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./pages/general/Home";
import SignUp from "./pages/auth/Signup";
import LoginPage from "./pages/auth/Login";
import NotFoundPage from "./pages/general/404Page";
import ErrorPage from "./pages/general/ErrorPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Contact from "./pages/general/Contact";
import Profile from "./pages/profile/Profile";
import ChatApp from "./pages/chatApp/ChatApp";
import Dashboard from "./pages/dashboard/DashBoard";
import CommunityLayout from "./pages/community/Community";
import MainCalendar from "./pages/Calendar/MainCalendar";
import BasicInformation from "./pages/community-settings/BasicInfo";
import MemberManagement from "./pages/community-settings/MemberManagement";
import NotificationSettings from "./pages/community-settings/NotificationSettings";
import Permissions from "./pages/community-settings/Permissions";
import ProjectDashboard from "./pages/project/ProjectDashboard";
import TaskPage from "./pages/tasks/TasksPage";
import ChatSkeleton from "./pages/chatApp/ChatSkeleton";
import Code from "./pages/code/Code";
import Call from "./pages/call/Call";

// Created once at module scope so the query cache survives re-renders.
const queryClient = new QueryClient();

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <HomePage />,
      errorElement: <NotFoundPage />,
    },
    {
      path: "SignUp",
      element: <SignUp />,
    },
    {
      path: "login",
      element: <LoginPage />,
    },
    {
      path: "dashboard",
      element: <Dashboard />,
      errorElement: <ErrorPage />,
    },
    {
      path: "contact",
      element: <Contact />,
    },
    {
      path: "profile/:username",
      element: <Profile />,
      errorElement: <ErrorPage />,
    },
    {
      path: "community/:ID",
      element: <CommunityLayout />,
      errorElement: <ErrorPage />,
      children: [
        {
          path: "calendar",
          element: <MainCalendar />,
        },
        {
          path: "call",
          element: <Call />,
        },
        {
          path: "settings/basic-info",
          element: <BasicInformation />,
        },
        {
          path: "settings/member-management",
          element: <MemberManagement />,
        },
        {
          path: "settings/privacy-permissions",
          element: <Permissions />,
        },
        {
          path: "settings/notification",
          element: <NotificationSettings />,
        },
        {
          path: "chat-skeleton",
          element: <ChatSkeleton />,
        },
        {
          path: "chat/:projectId",
          element: <ChatApp />,
        },
        {
          path: "project/:projectId",
          element: <ProjectDashboard />,
        },
        {
          path: "project",
          element: <ProjectDashboard />,
        },
        {
          path: "task",
          element: <TaskPage />,
        },
        {
          path: "task/:projectId",
          element: <TaskPage />,
        },
        {
          path: "code",
          element: <Code />,
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
