import { AlertTriangle } from "lucide-react";

/**
 * Compact in-place error state for a single section/card whose data failed
 * to load — as opposed to ErrorPage, which is a full-screen route-level
 * error boundary. Keeps the surrounding layout intact instead of replacing
 * it with a full-page takeover.
 */
export default function InlineError({
  message = "Couldn't load this. Please try again.",
}: {
  message?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 p-8 text-center text-muted-foreground">
      <AlertTriangle className="h-6 w-6 text-destructive" />
      <p className="text-sm">{message}</p>
    </div>
  );
}
