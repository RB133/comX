import {
  AlertCircleIcon,
  CheckCircleIcon,
  CircleIcon,
  ClockIcon,
  LucideProps,
} from "lucide-react";

export type TaskStatusInfo = {
  color: string;
  icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
  label: string;
};

/** Visual treatment (color/icon/label) for a task's backend status. */
export function getStatusInfo(status: string): TaskStatusInfo {
  switch (status) {
    case "INPROGRESS":
      return { color: "bg-blue-500", icon: ClockIcon, label: "In Progress" };
    case "PENDING":
      return { color: "bg-yellow-500", icon: CircleIcon, label: "Pending Review" };
    case "OVERDUE":
      return { color: "bg-red-500", icon: AlertCircleIcon, label: "Overdue" };
    case "COMPLETED":
      return { color: "bg-green-500", icon: CheckCircleIcon, label: "Completed" };
    default:
      return { color: "bg-gray-500", icon: CircleIcon, label: "Unknown" };
  }
}
