import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { RootState } from "@/state/store";
import { Label } from "@radix-ui/react-label";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import axios from "axios";
import { motion } from "framer-motion";
import { LogIn } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";


export default function JoinCommunity() {
  const [joinCode, setJoinCode] = useState("");
  const user = useSelector((state:RootState) => state.userDetails);

  const queryClient = useQueryClient();

  const { mutateAsync: joinCommunity, isPending } = useMutation({
    mutationFn: async (joinCode: string) => {
      const response = await api.post(`/member/join-community`, { joinCode });
      return response.data;
    },
    onSuccess: () => {
      toast.success("Joined Successfully");
      queryClient.invalidateQueries({ queryKey: [`communityList${user.user?.id}`] });
      setJoinCode("");
    },
    onError(error: unknown) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message ?? "Unable to join community."
        : "Unable to join community.";
      toast.error(message);
    },
  });

  const handleJoinCommunity = (e: React.FormEvent) => {
    e.preventDefault();
    if (joinCode.trim()) {
      joinCommunity(joinCode);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <LogIn className="h-5 w-5" /> Join Community
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleJoinCommunity} className="space-y-4">
            <div>
              <Label
                htmlFor="joinCode"
                className="block text-sm font-medium mb-1"
              >
                Community Code
              </Label>
              <Input
                type="text"
                id="joinCode"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value)}
                placeholder="Enter community code"
              />
            </div>
            <Button type="submit" disabled={isPending} className="w-full">
              {isPending ? "Joining..." : "Join Community"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
