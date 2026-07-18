import { useNavigate, useRouteError } from "react-router-dom";
import { Button } from "@/components/ui/button";

/**
 * Route-level error boundary. React Router renders this (via a route's
 * `errorElement`) when a loader or component in that route throws, instead of
 * leaving the user on a blank screen.
 */
export default function ErrorPage() {
  const error = useRouteError() as Error | undefined;
  const navigate = useNavigate();
  const message =
    (error as { statusText?: string })?.statusText || error?.message || "Something went wrong.";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-100 p-6 text-center">
      <h1 className="text-2xl font-bold text-gray-900">Oops — something broke</h1>
      <p className="max-w-md text-sm text-gray-600">{message}</p>
      <div className="flex gap-3">
        <Button onClick={() => navigate("/dashboard")}>Back to dashboard</Button>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Reload
        </Button>
      </div>
    </div>
  );
}
