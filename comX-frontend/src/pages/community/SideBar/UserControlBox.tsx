import { RootState } from "@/state/store";
import { setActiveServer } from "@/state/sidebar/activeServer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DEFAULT_AVATAR_URL } from "@/lib/constants";
import { Settings } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

export default function UserControlBox() {
  const user = useSelector((state: RootState) => state.userDetails);
  const dispatch = useDispatch();

  return (
    <div className="h-14 bg-muted flex items-center px-2 space-x-2 border-t">
      <Avatar className="w-8 h-8">
        <AvatarImage src={user.user?.avatar || DEFAULT_AVATAR_URL} alt={user.user?.name} />
        <AvatarFallback>{user.user?.name?.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="flex-grow">
        <div className="text-sm font-semibold">{user.user?.username}</div>
        <div className="text-xs text-muted-foreground">{user.user?.name}</div>
      </div>
      <button
        aria-label="Community settings"
        title="Community settings"
        className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-muted-foreground/30"
        onClick={() => dispatch(setActiveServer(2))}
      >
        <Settings className="w-5 h-5 text-muted-foreground" />
      </button>
    </div>
  );
}
