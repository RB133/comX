import { RootState } from "@/state/store";
import { Headphones, Mic, Settings, Users } from "lucide-react";
import { useSelector } from "react-redux";

export default function UserControlBox() {
  const user = useSelector((state: RootState) => state.userDetails);

  return (
    <div className="h-14 bg-muted flex items-center px-2 space-x-2 border-t">
      <div className="w-8 h-8 rounded-full bg-muted-foreground/30 flex items-center justify-center">
        <Users className="w-5 h-5 text-muted-foreground" />
      </div>
      <div className="flex-grow">
        <div className="text-sm font-semibold">{user.user?.username}</div>
        <div className="text-xs text-muted-foreground">{user.user?.name}</div>
      </div>
      <button className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-muted-foreground/30">
        <Mic className="w-5 h-5 text-muted-foreground" />
      </button>
      <button className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-muted-foreground/30">
        <Headphones className="w-5 h-5 text-muted-foreground" />
      </button>
      <button className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-muted-foreground/30">
        <Settings className="w-5 h-5 text-muted-foreground" />
      </button>
    </div>
  );
}
