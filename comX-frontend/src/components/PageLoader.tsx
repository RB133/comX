import { Loader2 } from "lucide-react";

/** Generic full-page loading state for route-level code-split chunks. Each
 * page takes over with its own data-aware skeleton immediately after its
 * chunk loads, so this only ever shows briefly. */
export default function PageLoader() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  );
}
