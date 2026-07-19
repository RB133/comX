export type Milestone = {
  id: string;
  name: string;
};

export type ProjectMember = {
  id: number;
  name: string;
  username: string;
  email: string;
  avatar: string;
  designation: string;
};

export type ProjectDetails = {
  id: number;
  name: string;
  description: string | null;
  deadline: string;
  milestones: string[];
  ownerId: number;
  owner: ProjectMember;
  communityId: number;
  createdAt: string;
  projectMembers: ProjectMember[];
};
