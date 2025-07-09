import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Label } from "@radix-ui/react-label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

export default function CreateProjectDeadline({
  deadline,
  setDeadline,
}: {
  deadline: Date;
  setDeadline: React.Dispatch<React.SetStateAction<Date>>;
}) {
  return (
    <div className="space-y-4 flex flex-col w-[50%] translate-x-4">
      <Label htmlFor="deadline" className="font-semibold">Project Deadline</Label>
      <Popover>
        <PopoverTrigger asChild className="flex items-center">
          <Button
            variant={"outline"}
            className={cn(
              "justify-start text-left font-normal bg-gray-50 h-11 w-[444px]",
              !deadline && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {deadline ? format(deadline, "PPP") : <span>Pick a date</span>}
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
    </div>
  );
}
