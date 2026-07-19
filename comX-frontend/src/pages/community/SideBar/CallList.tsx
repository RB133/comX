import { ScrollArea } from "@radix-ui/react-scroll-area";
import CommunityHeader from "./CommunityHeader";

// The project list this reads from is already loaded and error-checked by
// the parent Sidebar before this ever mounts (same shared, cached query).
export default function CallList() {
  return (
    <>
      <div className="w-60 bg-card flex flex-col border-r">
        <CommunityHeader />
        <ScrollArea className="flex-grow">

        </ScrollArea>
      </div>
    </>
  );
}
