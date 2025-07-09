import { LockClosedIcon } from "@radix-ui/react-icons";
import { Hash, Info, Users, Bell, Calendar, Settings, MessageCircleMore, FolderKanban, CheckCheck, Braces } from "lucide-react";
import {
  CalendarDays,
  CloudDrizzle,
  CloudSnow,
  Sun,
  CloudSun,
  Leaf,
  Flower2,
  Flame,
} from "lucide-react";

export const Server = [
  {
    id: 1,
    name: "Calender",
    link: <Calendar />,
  },
  {
    id: 2,
    name: "Setting",
    link: <Settings />,
  },
  {
    id: 4,
    name: "General",
    link: <MessageCircleMore />,
  },
  {
    id: 5,
    name: "Projects",
    link: <FolderKanban />,
  },
  {
    id: 6,
    name: "Tasks",
    link: <CheckCheck />,
  },
  {
    id: 3,
    name: "Code",
    link: <Braces />,
  },
];

export const Groups = [
  {
    id: 1,
    name: "Text Channels",
    link: <Hash className={`w-5 h-5 mr-1.5 text-gray-400`} />,
  },
  // {
  //   id: 2,
  //   name: "Voice Channels",
  //   link: <Volume2 className="w-5 h-5 mr-1.5 text-gray-400" />,
  // },
  // {
  //   id: 3,
  //   name: "Video Channels",
  //   link: <Video className="w-5 h-5 mr-1.5 text-gray-400" />,
  // },
];

export const Setting = [
  {
    id: 1,
    name: "Basic Information",
    link: "settings/basic-info",
    icon: <Info className="w-5 h-5 mr-1.5 text-gray-400" />,
  },
  {
    id: 2,
    name: "Member Management",
    link: "settings/member-management",
    icon: <Users className="w-5 h-5 mr-1.5 text-gray-400" />,
  },
  {
    id: 3,
    name: "Privacy & Permissions",
    link: "settings/privacy-permissions",
    icon: <LockClosedIcon className="w-5 h-5 mr-1.5 text-gray-400" />,
  },
  {
    id: 4,
    name: "Notification Settings",
    link: "settings/notification",
    icon: <Bell className="w-5 h-5 mr-1.5 text-gray-400" />,
  },
];

export const Months = [
  {
    id: 1,
    name: "January",
    link: <CloudSnow className="w-6 h-6 text-gray-500" />,
  },
  {
    id: 2,
    name: "February",
    link: <CalendarDays className="w-6 h-6 text-purple-500" />,
  },
  {
    id: 3,
    name: "March",
    link: <Flower2 className="w-6 h-6 text-green-600" />,
  },
  {
    id: 4,
    name: "April",
    link: <CloudDrizzle className="w-6 h-6 text-blue-400" />,
  },
  {
    id: 5,
    name: "May",
    link: <Sun className="w-6 h-6 text-yellow-400" />,
  },
  {
    id: 6,
    name: "June",
    link: <Flame className="w-6 h-6 text-orange-500" />,
  },
  {
    id: 7,
    name: "July",
    link: <Sun className="w-6 h-6 text-orange-400" />,
  },
  {
    id: 8,
    name: "August",
    link: <Leaf className="w-6 h-6 text-green-700" />,
  },
  {
    id: 9,
    name: "September",
    link: <Leaf className="w-6 h-6 text-amber-500" />,
  },
  {
    id: 10,
    name: "October",
    link: <CloudSun className="w-6 h-6 text-orange-600" />,
  },
  {
    id: 11,
    name: "November",
    link: <CloudSun className="w-6 h-6 text-gray-600" />,
  },
  {
    id: 12,
    name: "December",
    link: <CloudSnow className="w-6 h-6 text-blue-500" />,
  },
];

export type Task = {
  id: number;
  title: string;
  description: string;
  referenceLinks: string[];
  milestone: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  status: "in-progress" | "pending" | "overdue" | "completed";
  deadline: Date;
  createdAt: Date;
  content: string;
  projectId: number;
  assignId: number;
};
