import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReloadIcon } from "@radix-ui/react-icons";
import CreateProjectMemberManagement from "../../create-project/CreateProjectMemberManagement";
import { useEffect, useState } from "react";
import { Member } from "@/types/UserProfile";
import { useSelector } from "react-redux";
import { RootState } from "@/state/store";
import { EditTeamMembers } from "@/api/project/ProjectSettingsAPI";

export default function TeamMembersSettings({
  project,
}: {
  project: { projectMembers: Member[] };
}) {

  const user = useSelector((state: RootState) => state.userDetails);

  const [availableMembers, setAvailableMembers] = useState<Member[]>([]);
  const [projectMembers, setProjectMembers] = useState<Member[]>(
    project.projectMembers
  );

  useEffect(() => {
    setProjectMembers(
      project.projectMembers.filter((item) => item.id !== user.user?.id)
    );
  }, [project, user]);

  const { handleEditTeamMembers, editTeamMembersPending } = EditTeamMembers({
    project: project.projectMembers,
    projectMembers,
  });

  const handleSubmit = (e: React.MouseEvent) => {
    e.preventDefault();
    handleEditTeamMembers();
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <div className="absolute right-12 top-96 p-2 rounded-full hover:bg-gray-100">
          <Settings />
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent className="min-w-[1000px] *:">
        <AlertDialogHeader>
          <AlertDialogTitle>Edit Members</AlertDialogTitle>
          <AlertDialogDescription />
          <CreateProjectMemberManagement
            availableMembers={availableMembers}
            setAvailableMembers={setAvailableMembers}
            projectMembers={projectMembers}
            setProjectMembers={setProjectMembers}
          />
        </AlertDialogHeader>
        <AlertDialogFooter>
          <div className="flex w-full justify-between">
            <AlertDialogCancel>
              <span className="min-w-full bg-red-500 px-4 py-2 font-semibold text-white rounded-lg">
                Cancel
              </span>
            </AlertDialogCancel>
            <div>
              {editTeamMembersPending ? (
                <Button variant="default" disabled={true}>
                  <ReloadIcon className="mr-2 animate-spin w-4 h-4 flex justify-center items-center" />
                </Button>
              ) : (
                <Button
                  type={"submit"}
                  variant={"default"}
                  className="w-full"
                  onClick={handleSubmit}
                >
                  Edit Project
                </Button>
              )}
            </div>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
