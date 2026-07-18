import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { api } from "@/lib/api-client";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { RootState } from "@/state/store";
import { useSelector } from "react-redux";


export default function CreateCommunity() {
  const [selectedOption, setSelectedOption] = useState<"PUBLIC" | "PRIVATE">(
    "PUBLIC"
  );
  const [newCommunity, setNewCommunity] = useState("");
  const [communityDescription, setCommunityDescription] = useState("");

  const { user } = useSelector((state: RootState) => state.userDetails);

  const queryClient = useQueryClient();

  const { mutateAsync: createCommunity, isPending } = useMutation({
    mutationFn: (data: { name: string; description: string; scope: string }) => {
      return api.post(`/community/create-community`, data);
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: [`communityList${user?.id}`] });
      toast.success("Community created successfully!");
    },
    onError(error: unknown) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message ?? "Unable to create community."
        : "Unable to create community.";
      toast.error(message);
    },
  });

  const handleCreateCommunity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommunity.trim()) return;
    createCommunity({
      name: newCommunity,
      description: communityDescription,
      scope: selectedOption,
    });
    setNewCommunity("");
    setCommunityDescription("");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <PlusCircle className="h-5 w-5" /> Create New Community
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateCommunity} className="space-y-4">
            <div>
              <Label
                htmlFor="newCommunity"
                className="block text-sm font-medium mb-1"
              >
                Community Name
              </Label>
              <Input
                type="text"
                id="newCommunity"
                value={newCommunity}
                onChange={(e) => setNewCommunity(e.target.value)}
                placeholder="Enter community name"
              />
            </div>
            <div>
              <Label
                htmlFor="communityDescription"
                className="block text-sm font-medium mb-1"
              >
                Community Description
              </Label>
              <Textarea
                id="communityDescription"
                value={communityDescription}
                onChange={(e) => setCommunityDescription(e.target.value)}
                placeholder="Enter community description"
              />
            </div>
            <div className="flex space-x-4">
              <Button
                variant={selectedOption === "PUBLIC" ? "default" : "outline"}
                size="lg"
                onClick={() => setSelectedOption("PUBLIC")}
                type="button"
              >
                Public
              </Button>

              <Button
                variant={selectedOption === "PRIVATE" ? "default" : "outline"}
                size="lg"
                onClick={() => setSelectedOption("PRIVATE")}
                type="button"
              >
                Private
              </Button>
            </div>
            <Button type="submit" disabled={isPending} className="w-full">
              {isPending ? "Creating..." : "Create Community"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
