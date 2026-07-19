import { Community } from "@/types/Community";
import { DEFAULT_AVATAR_URL } from "@/lib/constants";
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
  const ownerName = owner?.name ?? "Unknown owner";
  const ownerAvatar = owner?.avatar || DEFAULT_AVATAR_URL;
  const coverBackground = coverImage
    ? { backgroundImage: `url(${coverImage})` }
    : { background: "linear-gradient(135deg, #0f172a, #334155)" };

  function redirectToCommunity() {
    navigate(`/community/${id.toString()}`);
  }

  return (
    <motion.div
      className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden cursor-pointer"
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
      onClick={redirectToCommunity}
    >
      <div
        className="relative h-48 w-full bg-cover bg-center"
        style={coverBackground}
      />
      <div className="p-4">
        <h3 className="font-semibold text-xl mb-2">{name}</h3>
        <p className="text-sm text-muted-foreground mb-4">{description}</p>
        <div className="flex items-center mb-4">
          <img
            src={ownerAvatar}
            alt={ownerName}
            width={40}
            height={40}
            className="rounded-full mr-2"
          />
          <span className="text-sm text-foreground/80">Founded by {ownerName}</span>
        </div>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
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
