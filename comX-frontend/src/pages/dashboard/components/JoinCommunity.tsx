import { Input } from "@/components/ui/input";
import { RootState } from "@/state/store";
import { Label } from "@radix-ui/react-label";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import axios from "axios";
import { motion } from "framer-motion";
import { LogIn } from "lucide-react";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
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
      className="bg-white p-6 rounded-lg shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <LogIn className="mr-2" /> Join Community
      </h2>
      <form onSubmit={handleJoinCommunity} className="space-y-4">
        <div>
          <Label
            htmlFor="joinCode"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Community Code
          </Label>
          <Input
            type="text"
            id="joinCode"
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter community code"
          />
        </div>
        <motion.button
          type="submit"
          disabled={isPending}
          className={`w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition-colors duration-300 ${isPending && "bg-green-900 hover:bg-green-900 cursor-not-allowed"}`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isPending ? "Joining..." : "Join Community"}
        </motion.button>
      </form>
      <Toaster />
    </motion.div>
  );
}
