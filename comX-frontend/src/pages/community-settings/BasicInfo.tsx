import { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Users, FileText, Image, Hash, Key, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { ReloadIcon } from "@radix-ui/react-icons";
import CommunityAPI from "@/api/community/CommunityAPI";
import { CommunitySettingsAPI } from "@/api/community/CommunitySettingsAPI";

export default function BasicInformation() {
  const { ID } = useParams();

  // State variables
  const coverImage = useRef<HTMLInputElement>(null);
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");

  const { community, communityLoading, communityError } = CommunityAPI();

  // Effect to set initial state values when community data is loaded
  useEffect(() => {
    if (community) {
      setName(community.name);
      setDescription(community.description);
    }
  }, [community]);

  const { handleEditCommunityBasicInfo, editCommunityBasicInfoPending } =
    CommunitySettingsAPI();

  // Update community function
  const handleUpdateCommunity = () => {
    handleEditCommunityBasicInfo({
      name,
      description,
      scope: "PUBLIC",
      communityId: parseInt(ID!, 10),
      file: coverImage.current?.files?.[0],
    });
  };

  // Show loading state
  if (communityLoading) {
    return <div>Loading . . .</div>;
  }

  // Handle error state
  if (communityError) {
    return <div>Error loading community details.</div>;
  }

  return (
    <>
      <div className="w-full">
        <motion.div variants={itemAnimation} className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-blue-600 leading-snug">
            Basic Information
          </h1>
          <p className="mt-2 text-lg text-gray-500">
            Customize and manage your community experience.
          </p>
        </motion.div>
        <Card className="w-full h-full rounded-none border-none flex items-center">
          <CardContent className="space-y-6 w-full">
            <div className="space-y-2">
              <Label
                htmlFor="communityName"
                className="flex items-center text-sm font-medium"
              >
                <Users className="mr-2 h-4 w-4" />
                Community Name
              </Label>
              <Input
                id="communityName"
                placeholder={community.name}
                className="w-full transition-all duration-300 focus:ring-2 focus:ring-blue-500"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="communityDescription"
                className="flex items-center text-sm font-medium"
              >
                <FileText className="mr-2 h-4 w-4" />
                Community Description
              </Label>
              <Textarea
                id="communityDescription"
                placeholder={community.description}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full min-h-[100px] transition-all duration-300 focus:ring-2 focus:ring-blue-500"
                style={{
                  height: `${Math.max(
                    100,
                    description.split("\n").length * 20
                  )}px`,
                }}
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="coverImage"
                className="flex items-center text-sm font-medium"
              >
                <Image className="mr-2 h-4 w-4" />
                Cover Image
              </Label>
              <div className="flex items-center space-x-4">
                <Input
                  id="coverImage"
                  type="file"
                  accept="image/*"
                  ref={coverImage}
                  className="w-full"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="scope"
                className="flex items-center text-sm font-medium"
              >
                <Hash className="mr-2 h-4 w-4" />
                Community Scope
              </Label>
              <Input
                id="scope"
                value={community.scope}
                readOnly
                className="w-full bg-gray-100 text-gray-500 cursor-not-allowed"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="joinCode"
                className="flex items-center text-sm font-medium"
              >
                <Key className="mr-2 h-4 w-4" />
                Join Code
              </Label>
              <Input
                id="joinCode"
                value={community.joinCode}
                readOnly
                className="w-full bg-gray-100 text-gray-500 cursor-not-allowed"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="createdAt"
                className="flex items-center text-sm font-medium"
              >
                <Calendar className="mr-2 h-4 w-4" />
                Created At
              </Label>
              <Input
                id="createdAt"
                type="string"
                value={community.createdAt.slice(0, 10)}
                readOnly
                className="w-full bg-gray-100 text-gray-500 cursor-not-allowed"
              />
            </div>

            {editCommunityBasicInfoPending ? (
              <Button
                disabled
                className="w-full bg-blue-800 hover:bg-blue-900 text-white transition-colors duration-300"
              >
                <ReloadIcon className="mr-2 animate-spin w-4 h-4 flex justify-center items-center" />
                Please wait
              </Button>
            ) : (
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-300"
                onClick={handleUpdateCommunity}
              >
                Save Changes
              </Button>
            )}
          </CardContent>
        </Card>
        <Toaster />
      </div>
    </>
  );
}

const itemAnimation = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 80 } },
};
