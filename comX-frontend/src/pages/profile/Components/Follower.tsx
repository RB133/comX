"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

// Sample user data
const initialFollowingUsers = [
  {
    id: 1,
    name: "John Doe",
    username: "@johndoe",
    designation: "Software Engineer",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 2,
    name: "Jane Smith",
    username: "@janesmith",
    designation: "UX Designer",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 3,
    name: "Bob Johnson",
    username: "@bobjohnson",
    designation: "Product Manager",
    avatar: "/placeholder.svg?height=40&width=40",
  },
];

const initialRecommendedUsers = [
  {
    id: 4,
    name: "Alice Brown",
    username: "@alicebrown",
    designation: "Data Scientist",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 5,
    name: "Charlie Green",
    username: "@charliegreen",
    designation: "Marketing Specialist",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 6,
    name: "Diana White",
    username: "@dianawhite",
    designation: "Frontend Developer",
    avatar: "/placeholder.svg?height=40&width=40",
  },
];

type User = {
  name: string;
  avatar: string;
  username: string;
  designation: string;
  id: number;
};

const UserCard = ({
  user,
  isFollowing = true,
  onToggleFollow,
}: {
  user: User;
  isFollowing: boolean;
  onToggleFollow: (userId: number) => void;
}) => (
  <div className="rounded-lg shadow-even p-4 mb-4 transition-all hover:shadow-even2 bg-white">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <Avatar>
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-semibold text-lg">{user.name}</h3>
          <p className="text-gray-600 text-sm">{user.designation}</p>
          <p className="text-blue-500 text-sm">{user.username}</p>
        </div>
      </div>
      <Button
        variant={isFollowing ? "outline" : "default"}
        onClick={() => onToggleFollow(user.id)}
      >
        {isFollowing ? "Following" : "Follow"}
      </Button>
    </div>
  </div>
);

export default function Component() {
  const [activeTab, setActiveTab] = useState("following");
  const [followingUsers, setFollowingUsers] = useState(initialFollowingUsers);
  const [recommendedUsers, setRecommendedUsers] = useState<User[]>(
    initialRecommendedUsers
  );

  const tabVariants = {
    hidden: { x: "-100%", opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.5 } },
    exit: { x: "100%", opacity: 0, transition: { duration: 0.5 } },
  };

  const handleToggleFollow = (userId: number) => {
    if (activeTab === "following") {
      setFollowingUsers(followingUsers.filter((user) => user.id !== userId));
      const userToAdd = followingUsers.find((user) => user.id === userId);

      if (userToAdd) {
        setRecommendedUsers([...recommendedUsers, userToAdd]);
      }
    } else {
      setRecommendedUsers(
        recommendedUsers.filter((user) => user.id !== userId)
      );

      const userToAdd = recommendedUsers.find((user) => user.id === userId);

      if (userToAdd) {
        setFollowingUsers([...followingUsers, userToAdd]);
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="flex mb-6 border-b">
        <button
          className={`py-2 px-4 font-semibold transition-colors ${
            activeTab === "following"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-600"
          }`}
          onClick={() => setActiveTab("following")}
        >
          Following
        </button>
        <button
          className={`py-2 px-4 font-semibold transition-colors ${
            activeTab === "recommended"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-600"
          }`}
          onClick={() => setActiveTab("recommended")}
        >
          Recommended
        </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          variants={tabVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {activeTab === "following" && (
            <div className="space-y-4">
              {followingUsers.map((user) => (
                <UserCard
                  key={user.id}
                  user={user}
                  isFollowing={true}
                  onToggleFollow={handleToggleFollow}
                />
              ))}
            </div>
          )}
          {activeTab === "recommended" && (
            <div className="space-y-4">
              {recommendedUsers.map((user) => (
                <UserCard
                  key={user.id}
                  user={user}
                  isFollowing={false}
                  onToggleFollow={handleToggleFollow}
                />
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
