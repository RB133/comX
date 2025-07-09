import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function Search_MemberManagement({
  searchTerm,
  setSearchTerm,
}: {
  searchTerm: string;
  setSearchTerm: (value: unknown) => void;
}) {
  return (
    <div className="mb-6 relative flex items-center w-full">
      <Search className="h-6 w-6 text-gray-500 left-3 absolute pointer-events-none" />
      <Input
        type="text"
        placeholder="Search members..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
      />
    </div>
  );
}
