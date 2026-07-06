import { Member } from "./UserProfile";

export default interface PROPS {
  setConfirmAction: React.Dispatch<React.SetStateAction<() => void>>;
  setConfirmMessage: React.Dispatch<React.SetStateAction<string>>;
  setShowConfirmDialog: React.Dispatch<React.SetStateAction<boolean>>;
  filteredMembers: Member[];
}
