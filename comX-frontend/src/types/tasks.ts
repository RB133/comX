export type Task = {
  title: string;
  description: string;
  referenceLinks: Array<string>;
  milestone: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  deadline: Date;
  content: string;
  projectId: number;
  assignId: number;
};

export type TaskGet = {
  id: number;
  title: string;
  content: string;
  description: string;
  milestone: string;
  priority: "HIGH" | "MEDIUM" | "LOW" | "CRITICAL";
  status: "INPROGRESS" | "COMPLETED" | "PENDING";
  createdAt: string;
  completedDate: string | null;
  deadline: string;
  projectId: number;
  referenceLinks: string[];
  user: {
    id: number;
    name: string;
    username: string;
    email: string;
    avatar: string;
    designation: string;
  };
};
