import CommunityAPI from "@/api/community/CommunityAPI";
import { Skeleton } from "@/components/ui/skeleton";

export default function CommunityHeader() {
  const { community, communityLoading, communityError } = CommunityAPI();

  if (communityLoading) {
    return (
      <div className="h-12 shadow-sm flex items-center px-4 justify-around">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-12" />
      </div>
    );
  }

  if (communityError) {
    return (
      <div className="h-12 shadow-sm flex items-center px-4 text-sm text-destructive">
        Couldn't load community
      </div>
    );
  }

  const displayName =
    community.name.length > 20 ? `${community.name.slice(0, 20)}...` : community.name;

  return (
    <div className="h-12 shadow-sm flex items-center px-4 font-semibold border-b justify-around">
      <p title={community.name} className="truncate">
        {displayName}
      </p>
      <p className="text-muted-foreground font-normal">({community.joinCode})</p>
    </div>
  );
}
