import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Months } from "@/lib/DummyData";
import { setYear } from "@/state/calendar/year";
import { setActiveChannel } from "@/state/sidebar/activeChannel";
import { RootState } from "@/state/store";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import CommunityHeader from "./ComunityHeader";
import UserControlBox from "./UserControlBox";

export default function CalendarList() {
  const groups = Months;

  const activeChannel = useSelector((state: RootState) => state.activeChannel);
  const year = useSelector((state: RootState) => state.year);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setActiveChannel(new Date().getMonth()));
  }, [dispatch]);

  const startingYear = 2020;
  const Years = Array.from(
    { length: new Date().getFullYear() - startingYear + 1 },
    (_, index) => startingYear + index
  );

  return (
    <>
      <div className="w-60 bg-white flex flex-col border-r">
        <CommunityHeader />
        <div className="flex justify-center items-center mt-2 w-full">
          <Select value={year} onValueChange={setYear}>
            <SelectTrigger className="w-[90%]">
              <SelectValue placeholder="Select a year" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {Years.map((year) => {
                  return (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  );
                })}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <ScrollArea className="flex-grow">
          {groups.map((category) => (
            <div key={category.id} className="m-2 mx-4">
              <button
                className={`flex items-center w-full px-2 py-2 mb-2 text-sm font-medium text-left rounded-lg transition-all duration-300 ease-in-out transform gap-2 ${
                  activeChannel === category.id
                    ? "bg-gradient-to-r from-blue-500 to-blue-700 text-white scale-105"
                    : "bg-white text-gray-600 hover:bg-gray-100 hover:text-gray-800 hover:shadow-md"
                }`}
                onClick={() => dispatch(setActiveChannel(category.id))}
              >
                {category.link}
                <span className="truncate">{category.name}</span>
              </button>
            </div>
          ))}
        </ScrollArea>
        <UserControlBox />
      </div>
    </>
  );
}
