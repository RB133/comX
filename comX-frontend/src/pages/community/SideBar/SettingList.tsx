import { Setting } from "@/lib/DummyData";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { useLocation, useNavigate } from "react-router-dom";
import UserControlBox from "./UserControlBox";
import CommunityHeader from "./ComunityHeader";


export default function SettingsList() {

  const location = useLocation();
  const currentUrl = location.pathname.split("/").filter(Boolean);

  const navigate = useNavigate();

  return (
    <>
      <div className="w-60 bg-white flex flex-col border-r">
        <CommunityHeader />
        <ScrollArea className="flex-grow">
          {Setting.map((category) => (
            <div key={category.id} className="m-2 mx-4">
              <button
                className={`flex items-center w-full px-2 py-2 mb-2 text-sm font-medium text-left rounded-lg transition-all duration-300 ease-in-out transform gap-2 ${
                  currentUrl.at(-1) === category.link.split("/").at(-1)
                    ? "bg-gradient-to-r from-blue-500 to-blue-700 text-white scale-105"
                    : "bg-white text-gray-600 hover:bg-gray-100 hover:text-gray-800 hover:shadow-md"
                }`}
                onClick={() => {
                  navigate(category.link,{replace:true});
                }}
              >
                {category.icon}
                <span className="truncate">{category.name}</span>
              </button>
            </div>
          ))}
        </ScrollArea>
        <UserControlBox />
      </div>
    </>
  );
}
