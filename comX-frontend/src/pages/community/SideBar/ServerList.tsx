import { Server } from "@/lib/DummyData";
import { cn } from "@/lib/utils";
import { setActiveServer } from "@/state/sidebar/activeServer";
import { RootState } from "@/state/store";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

export default function ServerList() {
  const location = useLocation();
  const currentUrl = location.pathname.split("/").filter(Boolean);

  const activeServer = useSelector((state: RootState) => state.activeServer);

  const dispatch = useDispatch();

  return (
    <>
      <div className="w-[72px] bg-gray-200 flex flex-col items-center py-3 space-y-2">
        {Server.map((item) => (
          <button
            key={item.id}
            className={`
            w-12 h-12 rounded-full bg-white flex items-center justify-center transition-all duration-200 group relative shadow-md 
            before:absolute before:px-2 before:py-1 before:left-10 before:bg-gray-700 before:hidden hover:before:block 
            before:rounded-md before:z-50 before:text-white before:content-[attr(data-tooltip)] before:text-xs before:font-bold
            ${
              activeServer === item.id
                ? "rounded-2xl bg-gradient-to-r from-blue-500 to-blue-700 text-white shadow-lg"
                : "hover:bg-blue-500 hover:text-white"
            }
          `}
            data-tooltip={item.name}
            onClick={() => {
              dispatch(setActiveServer(item.id));
            }}
          >
            <span className="text-2xl font-semibold">{item.link}</span>
            <div
              className={cn(
                "absolute left-0 w-1 bg-blue-500 rounded-r-full transition-all duration-200",
                currentUrl.at(-1) === item.name ? "h-10" : "h-2 group-hover:h-5"
              )}
            ></div>
          </button>
        ))}
      </div>
    </>
  );
}
