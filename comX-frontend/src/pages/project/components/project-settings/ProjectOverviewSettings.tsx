import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { LabelInputContainer } from "@/pages/auth/components/SignUpExtraComponents";
import { CalendarIcon, Settings } from "lucide-react";
import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { ReloadIcon } from "@radix-ui/react-icons";
import { EditBasicInfo } from "@/api/project/ProjectSettingsAPI";
import DeleteProjectAPI from "@/api/project/DeleteProjectAPI";

export default function ProjectOverviewSettings({
  project,
}: {
  project: { name: string; description: string; deadline: Date };
}) {
  const [deadline, setDeadline] = useState<Date>(new Date(Date.now()));
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const {handleEditBasicInfo,editBasicInfoPending} = EditBasicInfo({name,description,deadline});
  const { handleDeleteProject, deleteProjectPending } = DeleteProjectAPI();

  const handleSubmit = (e: React.MouseEvent) => {
    e.preventDefault();
    handleEditBasicInfo();
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger aria-label="Edit project settings">
        <div className="absolute right-12 top-12 p-2 rounded-full hover:bg-gray-100">
          <Settings />
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {showDeleteConfirm ? "Delete this project?" : "Edit Project"}
          </AlertDialogTitle>
          {showDeleteConfirm ? (
            <AlertDialogDescription>
              This permanently removes the project and its related tasks. This
              action cannot be undone.
            </AlertDialogDescription>
          ) : (
            <>
              <AlertDialogDescription />
              <LabelInputContainer className="mb-4">
                <Label htmlFor="project-title">Title</Label>
                <Input
                  id="project-title"
                  placeholder={`${project.name}`}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </LabelInputContainer>
              <LabelInputContainer className="mb-4">
                <Label htmlFor="project-description">Description</Label>
                <Textarea
                  id="project-description"
                  placeholder={`${project.description}`}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </LabelInputContainer>
              <LabelInputContainer className="mb-4">
                <Label htmlFor="project-deadline">Deadline</Label>
                <Popover>
                  <PopoverTrigger asChild className="flex items-center">
                    <Button
                      id="project-deadline"
                      variant={"outline"}
                      className={cn(
                        "justify-start text-left font-normal bg-gray-50 h-11 w-[444px]",
                        !deadline && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {deadline ? (
                        format(deadline, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-white rounded-lg bottom-4 relative flex">
                    <Calendar
                      mode="single"
                      selected={deadline}
                      onSelect={(date) => setDeadline(date!)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </LabelInputContainer>
            </>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <div className="flex w-full justify-between gap-3">
            <AlertDialogCancel>
              <span className="min-w-full bg-red-500 px-4 py-2 font-semibold text-white rounded-lg">
                Cancel
              </span>
            </AlertDialogCancel>
            <div className="flex gap-3">
              {showDeleteConfirm ? (
                <AlertDialogAction
                  className="bg-red-600 hover:bg-red-700"
                  onClick={() => handleDeleteProject()}
                >
                  {deleteProjectPending ? "Deleting..." : "Confirm Delete"}
                </AlertDialogAction>
              ) : (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  Delete Project
                </Button>
              )}

              <div>
                {editBasicInfoPending ? (
                  <Button variant="default" disabled={true}>
                    <ReloadIcon className="mr-2 animate-spin w-4 h-4 flex justify-center items-center" />
                  </Button>
                ) : (
                  <Button
                    type={"submit"}
                    variant={"default"}
                    className="w-full"
                    onClick={handleSubmit}
                    disabled={showDeleteConfirm}
                  >
                    Edit Project
                  </Button>
                )}
              </div>
              {showDeleteConfirm && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Back to Edit
                </Button>
              )}
            </div>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
