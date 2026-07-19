import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// Mirrors Profile.tsx's real layout so the page doesn't visibly reflow once
// data arrives, and shows a single cohesive loading state instead of five
// separate "Loading..." texts popping in across the page.
export default function ProfileSkeleton() {
  return (
    <div className="px-8 py-8 flex gap-8">
      <div className="min-w-[360px]">
        <Card className="w-full max-w-lg border border-border">
          <CardHeader className="flex flex-col items-center space-y-3">
            <Skeleton className="w-24 h-24 rounded-full" />
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-5 w-28 rounded-md" />
          </CardHeader>
          <CardContent className="space-y-6">
            <Skeleton className="h-4 w-full" />
            <div className="grid grid-cols-3 gap-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-3">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="w-full flex flex-col gap-4">
        <div className="flex w-full justify-between gap-4">
          <Skeleton className="h-64 w-[49%] rounded-lg" />
          <Skeleton className="h-64 w-[49%] rounded-lg" />
        </div>
        <Skeleton className="h-72 w-full rounded-xl" />
        <div className="flex w-full justify-between gap-4">
          <Skeleton className="h-[440px] w-[49%] rounded-lg" />
          <Skeleton className="h-[440px] w-[49%] rounded-lg" />
        </div>
      </div>
    </div>
  );
}
