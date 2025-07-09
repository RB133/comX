import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { Textarea } from "@/components/ui/textarea";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { RootState } from "@/state/store";
import { useSelector } from "react-redux";

const backend_url = import.meta.env.VITE_BACKEND_URL;

export default function CreateCommunity() {
  const [selectedOption, setSelectedOption] = useState<"PUBLIC" | "PRIVATE">(
    "PUBLIC"
  );
  const [newCommunity, setNewCommunity] = useState("");
  const [communityDescription, setCommunityDescription] = useState("");

  const { user } = useSelector((state: RootState) => state.userDetails);

  const queryClient = useQueryClient();

  const { mutateAsync: createCommunity, isPending } = useMutation({
    mutationFn: (data: {
      name: string;
      description: string;
      scope: string;
      userId: number;
      coverImage: string;
    }) => {
      return axios.post(`${backend_url}/community/create-community`, data, {
        withCredentials: true,
      });
    },
    onSuccess(data) {
      console.log(data);
      queryClient.invalidateQueries({ queryKey: [`communityList${user?.id}`] });
    },
    onError(error: AxiosError) {
      console.log(error);
      toast.error("Invalid");
    },
  });

  const handleCreateCommunity = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      name: newCommunity,
      description: communityDescription,
      scope: selectedOption,
      userId: user!.id,
      coverImage: "coverImage",
    };
    createCommunity(data);
    setNewCommunity("");
    setCommunityDescription("");
  };

  return (
    <motion.div
      className="bg-white p-6 rounded-lg shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <PlusCircle className="mr-2" /> Create New Community
      </h2>
      <form onSubmit={handleCreateCommunity} className="space-y-4">
        <div>
          <Label
            htmlFor="newCommunity"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Community Name
          </Label>
          <Input
            type="text"
            id="newCommunity"
            value={newCommunity}
            onChange={(e) => setNewCommunity(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter community name"
          />
        </div>
        <div>
          <Label
            htmlFor="communityDescription"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Community Description
          </Label>
          <Textarea
            id="communityDescription"
            value={communityDescription}
            onChange={(e) => setCommunityDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        <motion.button
          type="submit"
          className={`w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors duration-300 ${
            isPending && "hover:bg-blue-900 bg-blue-900 cursor-not-allowed"
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Create Community
        </motion.button>
      </form>
    </motion.div>
  );
}
