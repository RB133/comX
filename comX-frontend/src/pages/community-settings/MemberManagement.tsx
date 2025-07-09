import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useDebounce } from "@/hooks/useDebounce";
import Top_MemoryManagement from "./MemberManagement/Top-MemoryManagement";
import Search_MemberManagement from "./MemberManagement/Search-MemberManagement";
import { motion } from "framer-motion";
import Members_MemberManagement from "./MemberManagement/Member-MemberManagement";
import Admin_MemberManagement from "./MemberManagement/Admin-MemberManagement";
import Invite_MemberManagement from "./MemberManagement/Invite-MemberManagement";
import Ban_MemberManagement from "./MemberManagement/Ban-MemberManagement";
import CommunityMembersAPI from "@/api/community/CommunityMembersAPI";

const itemAnimation = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 80 } },
};

export default function MemberManagement() {
  const { communityMembers, communityMembersLoading, communityMembersError } =
    CommunityMembersAPI();

  // Confirmation dialog state
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmAction, setConfirmAction] = useState<() => void>(() => {});
  const [confirmMessage, setConfirmMessage] = useState("");
  const { value: searchTerm, setItem: setSearchTerm } = useLocalStorage(
    "search_member",
    ""
  );
  const debouncedSearchTerm = useDebounce(searchTerm);

  // Counting members based on their roles
  const memberCount = communityMembers.filter((m) => m.role === "MEMBER").length;
  const adminCount = communityMembers.filter(
    (m) => m.role === "ADMIN" || m.role === "OWNER"
  ).length;
  const bannedCount = communityMembers.filter((m) => m.role === "BANNED").length;
  const inviteCount = communityMembers.filter((m) => m.role === "QUEUE").length;

  // Filtered members based on search
  const filteredMembers = communityMembers.filter(
    (member) =>
      member.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
  );

  const confirmActionAndCloseDialog = () => {
    confirmAction();
    setShowConfirmDialog(false);
  };

  if (communityMembersLoading) {
    return <div>Loading...</div>;
  }

  // Handle error case
  if (communityMembersError) {
    return <div>Error loading members: {communityMembersError.message}</div>;
  }

  return (
    <div className="h-full overflow-scroll w-full no-scrollbar p-4 md:p-8">
      {/* Page Header */}
      <motion.div variants={itemAnimation} className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-blue-600 leading-snug">
          Member Management
        </h1>
        <p className="mt-2 text-lg text-gray-500">
          Customize and manage your community experience.
        </p>
      </motion.div>
      <Top_MemoryManagement
        memberCount={memberCount}
        adminCount={adminCount}
        bannedCount={bannedCount}
        inviteCount={inviteCount}
      />

      <Search_MemberManagement
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      <div className="grid grid-cols-1 gap-6">
        {memberCount > 0 && (
          <Members_MemberManagement
            setConfirmAction={setConfirmAction}
            setConfirmMessage={setConfirmMessage}
            setShowConfirmDialog={setShowConfirmDialog}
            filteredMembers={filteredMembers}
          />
        )}

        {adminCount > 0 && (
          <Admin_MemberManagement
            setConfirmAction={setConfirmAction}
            setConfirmMessage={setConfirmMessage}
            setShowConfirmDialog={setShowConfirmDialog}
            filteredMembers={filteredMembers}
          />
        )}

        {inviteCount > 0 && (
          <Invite_MemberManagement
            setConfirmAction={setConfirmAction}
            setConfirmMessage={setConfirmMessage}
            setShowConfirmDialog={setShowConfirmDialog}
            filteredMembers={filteredMembers}
          />
        )}

        {bannedCount > 0 && (
          <Ban_MemberManagement
            setConfirmAction={setConfirmAction}
            setConfirmMessage={setConfirmMessage}
            setShowConfirmDialog={setShowConfirmDialog}
            filteredMembers={filteredMembers}
          />
        )}
      </div>

      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Action</DialogTitle>
            <DialogDescription>{confirmMessage}</DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setShowConfirmDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={confirmActionAndCloseDialog}>Confirm</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
