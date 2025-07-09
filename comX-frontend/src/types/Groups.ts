export type Channel = {
  id: number;
  name: string;
};

export type Group = {
  id: number;
  name: string;
  channels: Channel[];
  link: JSX.Element; 
};
