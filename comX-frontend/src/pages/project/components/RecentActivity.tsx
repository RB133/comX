import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest updates and actions</CardDescription>
      </CardHeader>
      <CardContent>
        {/* No activity-log endpoint exists yet on the backend — this is a
            placeholder rather than fabricated activity data. */}
        <p className="text-sm text-muted-foreground">
          Activity tracking is coming soon.
        </p>
      </CardContent>
    </Card>
  );
}
