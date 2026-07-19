import { Server } from "@/lib/sidebarNavigation";
import { cn } from "@/lib/utils";
import { setActiveServer } from "@/state/sidebar/activeServer";
import { RootState } from "@/state/store";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function ServerList() {
  const location = useLocation();
  const currentUrl = location.pathname.split("/").filter(Boolean);

  const activeServer = useSelector((state: RootState) => state.activeServer);

  const dispatch = useDispatch();

  return (
    <TooltipProvider delayDuration={200}>
      <div className="w-[72px] bg-muted flex flex-col items-center py-3 space-y-2">
        {Server.map((item) => (
          <Tooltip key={item.id}>
            <TooltipTrigger asChild>
              <button
                aria-label={item.name}
                className={cn(
                  "w-12 h-12 rounded-full bg-card flex items-center justify-center transition-all duration-200 group relative shadow-md",
                  activeServer === item.id
                    ? "rounded-2xl bg-primary text-primary-foreground shadow-lg"
                    : "hover:bg-primary hover:text-primary-foreground"
                )}
                onClick={() => {
                  dispatch(setActiveServer(item.id));
                }}
              >
                <item.icon className="h-6 w-6" />
                <div
                  className={cn(
                    "absolute left-0 w-1 bg-primary rounded-r-full transition-all duration-200",
                    currentUrl.at(-1) === item.name ? "h-10" : "h-2 group-hover:h-5"
                  )}
                ></div>
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">{item.name}</TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
}
