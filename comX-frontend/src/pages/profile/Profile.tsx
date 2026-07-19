import ProfileAPI from "@/api/profile/ProfileAPI";
import ErrorPage from "@/pages/general/ErrorPage";
import ImprovedCodeHeatmap from "./Components/Heatmap";
import PersonalInfo from "./Components/PersonalInfo";
import TaskForProfile from "./Components/TasksForProfile";
import FollowerList from "./Components/Follower";
import PieChartTask from "./Components/PieChart";
import ComingSoon from "./Components/CommingSoon";
import ProfileSkeleton from "./Components/ProfileSkeleton";

export default function Profile() {
  const { profile, profileLoading, profileError } = ProfileAPI();

  if (profileLoading) return <ProfileSkeleton />;
  if (profileError) return <ErrorPage />;

  return (
    <div className="px-8 py-8 flex gap-8">
      <div className="min-w-[360px]">
        <PersonalInfo profile={profile} />
      </div>
      <div className="w-full flex flex-col gap-4 bg-none">
        <div className="flex w-full justify-between">
          <div className="border border-border bg-card rounded-lg shadow-xl w-[49%]">
            <TaskForProfile profile={profile} />
          </div>
          <div className="border border-border bg-card rounded-lg shadow-xl w-[49%]">
            <PieChartTask profile={profile} />
          </div>
        </div>
        <div className="w-full shadow-xl rounded-xl">
          <ImprovedCodeHeatmap profile={profile} />
        </div>
        <div className="flex w-full justify-between">
          <div className="border border-border bg-card rounded-lg shadow-xl w-[49%] h-[440px]">
            <FollowerList profile={profile} />
          </div>
          <div className="border border-border bg-card rounded-lg shadow-xl w-[49%]">
            <ComingSoon />
          </div>
        </div>
      </div>
    </div>
  );
}
