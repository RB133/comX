import CommunityAPI from "@/api/community/CommunityAPI";
import ErrorPage from "@/pages/genral/ErrorPage";

export default function CommunityHeader() {
  const { community, communityLoading, communityError } = CommunityAPI();

  if (communityLoading) {
    return <div>Loading . . .</div>;
  }

  if (communityError) {
    return <ErrorPage />;
  }

  return (
    <div className="h-12 shadow-sm flex items-center px-4 font-semibold border-b justify-around">
      <p>
        {community.name.length < 10
          ? community.name!.charAt(0).toUpperCase() +
            community.name!.substring(1, community.name.length)
          : community.name!.charAt(0).toUpperCase() +
            community.name!.substring(1, 7).toLowerCase() +
            "..."}{" "}
      </p>
      <p>( {community.joinCode} )</p>
    </div>
  );
}
