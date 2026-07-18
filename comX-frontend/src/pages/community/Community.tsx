import { Outlet } from "react-router-dom";
import Sidebar from "./SideBar/Sidebar";

function CommunityLayout() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="bg-white w-full h-screen overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}

export default CommunityLayout;
