import { LockClosedIcon } from "@radix-ui/react-icons";
import { Hash, Info, MessageCircleMore, Users, Bell, Calendar, CalendarDays, Settings, Phone, FolderKanban, CheckCheck} from "lucide-react";

export const Server = [
  {
    id: 1,
    name: "Calendar",
    icon: Calendar,
  },
  {
    id: 2,
    name: "Setting",
    icon: Settings,
  },
  {
    id: 4,
    name: "Chat",
    icon: MessageCircleMore,
  },
  {
    id: 5,
    name: "Projects",
    icon: FolderKanban,
  },
  {
    id: 6,
    name: "Tasks",
    icon: CheckCheck,
  },
  {
    id: 3,
    name: "Call",
    icon: Phone,
  },
];

export const Groups = [
  {
    id: 1,
    name: "Text Channels",
    link: <Hash className="w-5 h-5 mr-1.5 text-muted-foreground" />,
  },
];

export const Setting = [
  {
    id: 1,
    name: "Basic Information",
    link: "settings/basic-info",
    icon: <Info className="w-5 h-5 mr-1.5 text-muted-foreground" />,
  },
  {
    id: 2,
    name: "Member Management",
    link: "settings/member-management",
    icon: <Users className="w-5 h-5 mr-1.5 text-muted-foreground" />,
  },
  {
    id: 3,
    name: "Privacy & Permissions",
    link: "settings/privacy-permissions",
    icon: <LockClosedIcon className="w-5 h-5 mr-1.5 text-muted-foreground" />,
  },
  {
    id: 4,
    name: "Notification Settings",
    link: "settings/notification",
    icon: <Bell className="w-5 h-5 mr-1.5 text-muted-foreground" />,
  },
];

// Every month uses the same calendar icon — a matching set of themed icons
// (snowflake for January, flame for June, etc.) looked playful but made the
// list harder to scan, since the icon carried no real meaning of its own.
const monthIcon = <CalendarDays className="w-5 h-5 mr-1.5 text-muted-foreground" />;

export const Months = [
  { id: 1, name: "January", icon: monthIcon },
  { id: 2, name: "February", icon: monthIcon },
  { id: 3, name: "March", icon: monthIcon },
  { id: 4, name: "April", icon: monthIcon },
  { id: 5, name: "May", icon: monthIcon },
  { id: 6, name: "June", icon: monthIcon },
  { id: 7, name: "July", icon: monthIcon },
  { id: 8, name: "August", icon: monthIcon },
  { id: 9, name: "September", icon: monthIcon },
  { id: 10, name: "October", icon: monthIcon },
  { id: 11, name: "November", icon: monthIcon },
  { id: 12, name: "December", icon: monthIcon },
];
