import { motion } from "framer-motion";
import { Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { Community } from "@/types/Community";
import useAuthCheck from "@/hooks/useAuthCheck";
import { useSelector } from "react-redux";
import { RootState } from "@/state/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import InlineError from "@/components/InlineError";
import CommunityCard from "./components/CommunityCard";
import CreateCommunity from "./components/CreateCommunity";
import JoinCommunity from "./components/JoinCommunity";
import LastTask from "./components/Last-Task";
import DashboardSkeleton from "./components/DashboardSkeleton";

const fetchCommunityList = async () => {
  const response = await api.get(`/community/get-user-communities`);
  return response.data.data;
};

export default function Dashboard() {
  const user = useSelector((state: RootState) => state.userDetails);

  useAuthCheck(user.user);

  const { isError, data: communities, isPending } = useQuery({
    queryKey: [`communityList${user.user?.id}`],
    queryFn: fetchCommunityList,
    staleTime: Infinity,
  });

  if (isPending) {
    return <DashboardSkeleton />;
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-muted/40 p-4 sm:p-6 lg:p-8">
        <InlineError message="Couldn't load your dashboard. Please refresh the page." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/40 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold tracking-tight mb-6">Dashboard</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Users className="h-5 w-5" /> Your Communities
                </CardTitle>
              </CardHeader>
              <CardContent>
                {communities.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    You haven't joined or created any communities yet. Create
                    one or join with a code to get started.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 gap-6">
                    {communities.map((community: Community) => (
                      <CommunityCard
                        key={community.id}
                        coverImage={community.coverImage}
                        createdAt={community.createdAt}
                        description={community.description}
                        memberCount={community.memberCount}
                        name={community.name}
                        owner={community.owner}
                        id={community.id}
                        joinCode={community.joinCode}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <div className="space-y-6">
            <CreateCommunity />
            <JoinCommunity />
            <LastTask />
          </div>
        </div>
      </div>
    </div>
  );
}
