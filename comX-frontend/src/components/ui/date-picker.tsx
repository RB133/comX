import { cn } from "@/lib/utils";
import { Button } from "./button";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "./calendar";

export function DatePicker({
  date,
  setDate,
}: {
  date: Date;
  setDate: React.Dispatch<React.SetStateAction<Date>>;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild className="flex items-center">
        <Button
          variant={"outline"}
          className={cn(
            "justify-start text-left font-normal bg-gray-50 h-11",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-white rounded-lg bottom-4 relative flex">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(date) => setDate(date!)}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
