import { Label } from "@radix-ui/react-label";
import { AnimatePresence } from "framer-motion";
import { Plus, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Milestone } from "@/types/Project";

export default function CreateProjectMilestone({
  milestones,
  setMilestones,
}: {
  milestones: Milestone[];
  setMilestones: React.Dispatch<React.SetStateAction<Milestone[]>>;
}) {
  const addMilestone = () => {
    setMilestones([
      ...milestones,
      { id: Date.now().toString(), name: "" },
    ]);
  };

  const removeMilestone = (id: string) => {
    setMilestones((prevMilestones) =>
      prevMilestones.filter((m) => m.id !== id)
    );
  };

  const updateMilestone = (id: string, name: string) => {
    setMilestones((prevMilestones) =>
      prevMilestones.map((milestone) =>
        milestone.id === id ? { ...milestone, name } : milestone
      )
    );
  };

  return (
    <div className="space-y-4">
      <Label>Milestones</Label>
      <AnimatePresence>
        {milestones.map((milestone) => (
          <motion.div
            key={milestone.id}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-center space-x-2 mb-2"
          >
            <Input
              placeholder="Milestone name"
              value={milestone.name}
              onChange={(e) =>
                updateMilestone(
                  milestone.id,
                  e.target.value,
                )
              }
              className="flex-grow"
            />

            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => removeMilestone(milestone.id)}
              className="w-12 h-10 bg-gray-50"
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Remove milestone</span>
            </Button>
          </motion.div>
        ))}
      </AnimatePresence>
      <Button
        type="button"
        variant="outline"
        onClick={addMilestone}
        className="w-full"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Milestone
      </Button>
    </div>
  );
}
