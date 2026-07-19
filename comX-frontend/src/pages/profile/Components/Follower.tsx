import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { DEFAULT_AVATAR_URL } from "@/lib/constants";
import { PublicProfile } from "@/types/UserProfile";

type ConnectionSummary = { name: string; username: string; avatar: string };

const ConnectionCard = ({ user }: { user: ConnectionSummary }) => (
  <Link to={`/profile/${user.username}`}>
    <div className="rounded-lg shadow-even p-4 mb-4 transition-all hover:shadow-even2 bg-white">
      <div className="flex items-center space-x-4">
        <Avatar>
          <AvatarImage src={user.avatar || DEFAULT_AVATAR_URL} alt={user.name} />
          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-semibold text-lg">{user.name}</h3>
          <p className="text-primary text-sm">@{user.username}</p>
        </div>
      </div>
    </div>
  </Link>
);

export default function FollowerList({ profile }: { profile: PublicProfile }) {
  const [activeTab, setActiveTab] = useState<"following" | "followers">("following");

  const tabVariants = {
    hidden: { x: "-100%", opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.5 } },
    exit: { x: "100%", opacity: 0, transition: { duration: 0.5 } },
  };

  const connections = activeTab === "following" ? profile.following : profile.followers;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="flex mb-6 border-b">
        <button
          className={`py-2 px-4 font-semibold transition-colors ${
            activeTab === "following"
              ? "text-primary border-b-2 border-primary"
              : "text-muted-foreground"
          }`}
          onClick={() => setActiveTab("following")}
        >
          Following
        </button>
        <button
          className={`py-2 px-4 font-semibold transition-colors ${
            activeTab === "followers"
              ? "text-primary border-b-2 border-primary"
              : "text-muted-foreground"
          }`}
          onClick={() => setActiveTab("followers")}
        >
          Followers
        </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={activeTab} variants={tabVariants} initial="hidden" animate="visible" exit="exit">
          {connections.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              {activeTab === "following" ? "Not following anyone yet." : "No followers yet."}
            </p>
          ) : (
            <div className="space-y-4">
              {connections.map((user) => (
                <ConnectionCard key={user.username} user={user} />
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
