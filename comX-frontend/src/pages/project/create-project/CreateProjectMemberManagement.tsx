import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import ErrorPage from "@/pages/genral/ErrorPage";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { useSelector } from "react-redux";
import { RootState } from "@/state/store";
import { Member } from "@/types/UserProfile";
import CommunityMembersAPI from "@/api/community/CommunityMembersAPI";

export default function CreateProjectMemberManagement({
  projectMembers,
  setProjectMembers,
  availableMembers,
  setAvailableMembers,
}: {
  projectMembers: Member[];
  setProjectMembers: React.Dispatch<React.SetStateAction<Member[]>>;
  availableMembers: Member[];
  setAvailableMembers: React.Dispatch<React.SetStateAction<Member[]>>;
}) {

  const [activeMember, setActiveMember] = useState<Member | null>(null);
  const [search, setSearch] = useState<string>("");

  const user = useSelector((state: RootState) => state.userDetails);

  const debounceSearch = useDebounce(search, 500);

  const {communityMembers,communityMembersLoading,communityMembersError} = CommunityMembersAPI();

  useEffect(() => {
    setAvailableMembers(
      communityMembers
        .filter((item) =>
          item.name.toLowerCase().includes(debounceSearch.toLowerCase())
        )
        .filter(
          (item) =>
            !projectMembers.some((projMember) => projMember.id === item.id)
        )
    );
  }, [debounceSearch, setAvailableMembers, communityMembers, projectMembers]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const draggedMember =
      availableMembers.find((m) => m.id === active.id) ||
      projectMembers.find((m) => m.id === active.id);
    setActiveMember(draggedMember || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveMember(null); // Reset the dragged item

    if (!over) return;

    const activeIndexInAvailable = availableMembers.findIndex(
      (m) => m.id === active.id
    );
    const activeIndexInProject = projectMembers.findIndex(
      (m) => m.id === active.id
    );

    if (activeIndexInAvailable !== -1 && over.id !== active.id) {
      // Move from available to project
      const [draggedMember] = availableMembers.splice(
        activeIndexInAvailable,
        1
      );
      setProjectMembers((current) => [...current, draggedMember]);
      setAvailableMembers([...availableMembers]);
    } else if (activeIndexInProject !== -1 && over.id !== active.id) {
      // Move from project to available
      const [draggedMember] = projectMembers.splice(activeIndexInProject, 1);
      setAvailableMembers((current) => [...current, draggedMember]);
      setProjectMembers([...projectMembers]);
    }
  };

  // Function to move a member from available to project
  const moveToProject = (member: Member) => {
    setProjectMembers((current) => [...current, member]);
    setAvailableMembers((current) => current.filter((m) => m.id !== member.id));
  };

  // Function to move a member from project to available
  const moveToAvailable = (member: Member) => {
    setAvailableMembers((current) => [...current, member]);
    setProjectMembers((current) => current.filter((m) => m.id !== member.id));
  };

  if (communityMembersLoading) {
    return <div>Loading ...</div>;
  }

  if (communityMembersError) {
    return <ErrorPage />;
  }

  return (
    <div>
      <Label className="text-xl font-semibold">Project Members</Label>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid md:grid-cols-2 gap-6 mt-4">
          <div className="p-4 rounded-lg  shadow-xl border border-gray-200 overflow-y-scroll no-scrollbar">
            <h3 className="font-semibold text-gray-600 mb-3 text-lg">
              Available Members
            </h3>
            <SortableContext
              items={availableMembers.map((m) => m.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2">
                <div className="relative w-full max-w-md mx-auto">
                  <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                    <Search className="w-5 h-5" />
                  </span>
                  <Input
                    type="text"
                    placeholder="Search Member"
                    className="pl-10 py-2 rounded-md border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-sm bg-white text-gray-700 placeholder-gray-400"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <div className="space-y-2 max-h-[200px] overflow-y-scroll no-scrollbar">
                  {availableMembers
                    .filter((member) => member.id !== user.user?.id)
                    .map((member) => {
                      return (
                        <div
                          className="flex relative items-center"
                          key={`${member.id}-1`}
                        >
                          <SortableMember key={member.id} member={member} />
                          <button
                            type="button"
                            onClick={() => moveToProject(member)}
                            className="h-8 absolute mt-2 right-6 bg-blue-500 text-white p-2 rounded-md shadow hover:bg-blue-600 flex justify-center items-center"
                          >
                            Add to Project
                          </button>
                        </div>
                      );
                    })}
                </div>
              </div>
            </SortableContext>
          </div>
          <div className="p-4 rounded-lg min-h-[220px] border border-gray-200 shadow-xl">
            <h3 className="font-semibold text-gray-600 mb-3 text-lg">
              Project Members
            </h3>
            <SortableContext
              items={projectMembers.map((m) => m.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2 max-h-[250px] overflow-y-scroll no-scrollbar">
                {projectMembers.map((member) => (
                  <div
                    className="flex relative items-center"
                    key={`${member.id}-2`}
                  >
                    <SortableMember key={member.id} member={member} />
                    <button
                      type="button"
                      onClick={() => moveToAvailable(member)}
                      className="h-8 absolute mt-2 right-6 bg-red-500 text-white p-2 rounded-md shadow hover:bg-red-600 flex justify-center items-center"
                    >
                      Remove from Project
                    </button>
                  </div>
                ))}
              </div>
            </SortableContext>
          </div>
        </div>

        {/* Drag Overlay */}
        <DragOverlay>
          {activeMember ? (
            <motion.div
              className="p-3 bg-white rounded-lg shadow-lg border border-gray-300 absolute left-[-175px] bottom-4"
              initial={{ opacity: 0.8, scale: 1 }}
              animate={{ opacity: 1, scale: 1.05 }}
            >
              <p className="text-gray-800 font-medium">{activeMember.name}</p>
            </motion.div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}

const SortableMember: React.FC<{ member: Member }> = ({ member }) => {
  const { attributes, listeners, setNodeRef } = useSortable({
    id: member.id,
  });

  return (
    <div
      key={`${member.id}-3`}
      className=" w-full flex items-center gap-3 p-4 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
      ref={setNodeRef}
      {...attributes}
      {...listeners}
    >
      <Avatar className="w-12 h-12 border border-gray-200 rounded-full overflow-hidden">
        <AvatarImage src={member.avatar} />
        <AvatarFallback>{member.name[0]}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <h1 className="font-medium text-gray-800">{member.name}</h1>
        <p className="text-sm text-gray-500">{member.designation}</p>
      </div>
    </div>
  );
};
