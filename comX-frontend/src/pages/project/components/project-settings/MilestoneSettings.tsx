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
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ReloadIcon } from "@radix-ui/react-icons";
import { Milestone } from "@/types/Project";
import CreateProjectMilestone from "../../create-project/CreateProjectMilestone";
import { EditMilestone } from "@/api/project/ProjectSettingsAPI";

export default function MilestonesSettings({
  project,
}: {
  project: { milestones: string[] };
}) {
  const [milestones, setMilestones] = useState<Milestone[]>([]);

  useEffect(() => {
    setMilestones(
      project.milestones.map((item) => {
        return { id: item, name: item };
      })
    );
  }, [project]);

  const { handleEditMilestones, editMilestonesPending } = EditMilestone({
    milestones,
  });

  const handleSubmit = (e: React.MouseEvent) => {
    e.preventDefault();
    handleEditMilestones();
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <div className="relative left-4 top-2 p-2 rounded-full hover:bg-gray-100">
          <Settings />
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Edit Project</AlertDialogTitle>
          <AlertDialogDescription />
          <CreateProjectMilestone
            milestones={milestones}
            setMilestones={setMilestones}
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
              {editMilestonesPending ? (
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
