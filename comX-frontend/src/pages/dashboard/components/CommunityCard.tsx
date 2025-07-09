import { Community } from "@/types/Community";
import { motion } from "framer-motion";
import { Calendar, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function CommunityCard({
  coverImage,
  createdAt,
  description,
  memberCount,
  name,
  owner,
  id
}: Community) {

  const tags = ["Maps", "Tech", "New"];
  
  function timeDifferenceFromNow(dateString: string): string {
    const now = new Date();
    const targetDate = new Date(dateString);

    let years = now.getFullYear() - targetDate.getFullYear();
    let months = now.getMonth() - targetDate.getMonth();
    let days = now.getDate() - targetDate.getDate();

    if (days < 0) {
      months--;
      const lastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
      days += lastMonth.getDate();
    }
    if (months < 0) {
      years--;
      months += 12;
    }

    let result = "";
    if (years > 0) result += `${years} year${years > 1 ? "s" : ""} `;
    if (months > 0) result += `${months} month${months > 1 ? "s" : ""} `;
    if (days > 0) result += `${days} day${days > 1 ? "s" : ""} `;

    return result.trim() || "less than a day";
  }

  const navigate = useNavigate();

  function redirectToCommunity() {
    navigate(`/community/${id.toString()}`);
  }

  // Hta dena
  if(coverImage==="coverImage") coverImage="../../public/Community.webp"

  return (
    <motion.div
      className="bg-gray-50 rounded-lg shadow overflow-hidden"
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
      onClick={redirectToCommunity}
    >
      <div
        className="relative h-48 w-full bg-cover bg-center"
        style={{
          backgroundImage: `url(${coverImage})`,
        }}
      />
      <div className="p-4">
        <h3 className="font-semibold text-xl mb-2">{name}</h3>
        <p className="text-sm text-gray-600 mb-4">{description}</p>
        <div className="flex items-center mb-4">
          <img
            src={owner.avatar? owner.avatar : "https://github.com/shadcn.png"}
            alt={owner.name}
            width={40}
            height={40}
            className="rounded-full mr-2"
          />
          <span className="text-sm text-gray-700">Founded by {owner.name}</span>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag: string) => (
            <span
              key={tag}
              className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center">
            <User className="w-4 h-4 mr-1" />
            <span>{memberCount} members</span>
          </div>
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            <span>{timeDifferenceFromNow(createdAt)}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
