import React, { useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import CreateProjectDeadline from "./CreateProjectDeadline";
import CreateProjectMilestone from "./CreateProjectMilestone";
import { Milestone } from "@/types/Project";
import CreateProjectMemberManagement from "./CreateProjectMemberManagement";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useParams } from "react-router-dom";
import { ProjectMember } from "@/types/Project";
import InlineError from "@/components/InlineError";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { AlertDialogCancel } from "@radix-ui/react-alert-dialog";
import { X } from "lucide-react";
import CreateProjectAPI from "@/api/project/CreateProjectAPI";
import CommunityMembersAPI from "@/api/community/CommunityMembersAPI";

const CreateProjectComponent: React.FC = () => {
  const { ID } = useParams();

  const { communityMembers, communityMembersLoading, communityMembersError } =
    CommunityMembersAPI();

  const [availableMembers, setAvailableMembers] =
    useState<ProjectMember[]>(communityMembers);
  const [projectMembers, setProjectMembers] = useState<ProjectMember[]>([]);
  const [deadline, setDeadline] = useState<Date>(new Date());
  const [milestones, setMilestones] = useState<Milestone[]>([]);

  const { handleCreateProject, createProjectPending } = CreateProjectAPI();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    await handleCreateProject({
      communityId: parseInt(ID!, 10),
      name: formData.get("projectName") as string,
      description: formData.get("projectDescription") as string,
      members: projectMembers.map((item) => item.id),
      milestones: milestones.map((item) => item.name),
      deadline: deadline,
    });
  };

  if (communityMembersLoading) {
    return (
      <div className="w-full mx-auto p-6 space-y-8">
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (communityMembersError) {
    return <InlineError message="Couldn't load community members." />;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full mx-auto p-6 space-y-8 overflow-y-scroll max-h-screen no-scrollbar"
    >
      <div className="space-y-2">
        <div className="flex w-full justify-between">
          <h1 className="text-3xl font-bold">Create New Project</h1>
          <div className="relative">
            <AlertDialogCancel>
              <span className="absolute top-0 right-0 p-2 bg-white rounded-full text-neutral-600 hover:bg-neutral-100 transition-colors cursor-pointer">
                <X size={20} />
              </span>
            </AlertDialogCancel>
          </div>
        </div>
        <p className="text-muted-foreground">
          Set up your project details, team, and milestones.
        </p>
      </div>

      <div className="flex w-full items-center justify-between">
        <div className="space-y-4 w-[49%]">
          <Label htmlFor="projectName">Project Name</Label>
          <Input name="projectName" placeholder="Enter project name" required />
        </div>
        <CreateProjectDeadline deadline={deadline} setDeadline={setDeadline} />
      </div>

      <div className="space-y-4 w-full">
        <Label htmlFor="projectDescription">Project Description</Label>
        <Textarea
          name="projectDescription"
          placeholder="Enter project description"
        />
      </div>

      <CreateProjectMemberManagement
        projectMembers={projectMembers}
        setProjectMembers={setProjectMembers}
        availableMembers={availableMembers}
        setAvailableMembers={setAvailableMembers}
      />

      <CreateProjectMilestone
        milestones={milestones}
        setMilestones={setMilestones}
      />

      <div className="flex w-full justify-between">
        <AlertDialogCancel>
          <span className="min-w-full bg-red-500 px-4 py-2 font-semibold text-white rounded-lg">
            Cancel
          </span>
        </AlertDialogCancel>
        <div>
          {createProjectPending ? (
            <Button variant="default" disabled={true}>
              <ReloadIcon className="mr-2 animate-spin w-4 h-4 flex justify-center items-center" />
            </Button>
          ) : (
            <Button type={"submit"} variant={"default"} className="w-full">
              Create Project
            </Button>
          )}
        </div>
      </div>
    </form>
  );
};

export default CreateProjectComponent;
