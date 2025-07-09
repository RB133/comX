import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";

export default function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest updates and actions</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {projectData.recentActivity.map((activity, index) => (
            <motion.li
              key={activity.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex items-start gap-4"
            >
              <div className="mt-1">
                <Clock className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium">{activity.action}</p>
                <p className="text-xs text-muted-foreground">
                  {activity.user} -{" "}
                  {new Date(activity.timestamp).toLocaleString()}
                </p>
              </div>
            </motion.li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

const projectData = {
    title: "Website Redesign",
    description: "Overhaul of company website with modern design and improved UX",
    deadline: "2024-12-31",
    progress: 65,
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    ownerName: "Vardaan",
    ownerAvatar: "../../../public/Vardaan_Profile.jpg",
    recentActivity: [
      {
        id: 1,
        action: "Completed task: Design mockups",
        user: "Alice Johnson",
        timestamp: "2024-02-28T14:30:00Z",
      },
      {
        id: 2,
        action: "Added comment on Frontend development",
        user: "Bob Smith",
        timestamp: "2024-03-15T09:45:00Z",
      },
      {
        id: 3,
        action: "Uploaded new file: backend_schema.pdf",
        user: "Charlie Brown",
        timestamp: "2024-03-20T11:20:00Z",
      },
    ],
  };