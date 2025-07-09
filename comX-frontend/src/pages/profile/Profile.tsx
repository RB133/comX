import ImprovedCodeHeatmap from "./Components/Heatmap";
import PersonalInfo from "./Components/PersonalInfo";
import TaskForProfile from "./Components/TasksForProfile";
import FollowerList from "./Components/Follower";
import PieChartTask from "./Components/PieChart";
import ComingSoon from "./Components/CommingSoon";

export default function Profile() {
  return (
    <div className="px-8 py-8 flex gap-8">
      <div className="min-w-[360px]">
        <PersonalInfo />
      </div>
      <div className="w-full flex flex-col gap-4 bg-none">
        <div className="flex w-full justify-between">
          <div className="border border-gray-200 bg-card rounded-lg shadow-xl w-[49%]">
            <TaskForProfile />
          </div>
          <div className="border border-gray-200 bg-card rounded-lg shadow-xl w-[49%]">
            <PieChartTask />
          </div>
        </div>
        <div className="w-full shadow-xl rounded-xl">
          <ImprovedCodeHeatmap />
        </div>
        <div className="flex w-full justify-between">
          <div className="border border-gray-200 bg-card rounded-lg shadow-xl w-[49%] h-[440px]">
            <FollowerList />
          </div>
          <div className="border border-gray-200 bg-card rounded-lg shadow-xl w-[49%]">
            <ComingSoon />
          </div>
        </div>
      </div>
    </div>
  );
}
