export type Community = {
  coverImage: string;
  createdAt: string;
  description: string;
  id: number;
  joinCode: string;
  memberCount: number;
  name: string;
  owner: {
    avatar: string;
    email: string;
    id: number;
    name: string;
  };
};
