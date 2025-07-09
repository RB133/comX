import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { DateTime } from "luxon";
import { useSelector } from "react-redux";
import { RootState } from "@/state/store";
import CalendarAPI from "@/api/calendar/CalendarAPI";
import ErrorPage from "../genral/ErrorPage";

interface CalendarEvent {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  color: string;
}

const colorPalette = [
  "bg-red-400",
  "bg-blue-400",
  "bg-green-400",
  "bg-yellow-400",
  "bg-purple-400",
  "bg-pink-400",
];

const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function MainCalendar() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  const { tasks, tasksLoading, tasksError } = CalendarAPI();

  const activeChannel = useSelector((state: RootState) => state.activeChannel);
  const year = useSelector((state: RootState) => state.year);

  const [currentDate, setCurrentDate] = useState(DateTime.now());

  useEffect(() => {
    const handleSetMonth = (month: number) => {
      if (currentDate.month !== month) {
        setCurrentDate((prevDate) => prevDate.set({ month }));
      }
    };

    const handleSetYear = (newYear: number) => {
      if (currentDate.year !== newYear) {
        setCurrentDate((prevDate) => prevDate.set({ year: newYear }));
      }
    };

    if (activeChannel > 0 && activeChannel <= 12) {
      handleSetMonth(activeChannel);
    }

    const parsedYear = parseInt(year, 10);
    if (!isNaN(parsedYear)) {
      handleSetYear(parsedYear);
    }
  }, [year, activeChannel, currentDate]);

  // useEffect(()=>{
  // if(!tasksLoading) setEvents(tasks);
  // },[tasksLoading,tasks])

  if (tasksLoading) return <div>Loading ...</div>;
  if (tasksError) return <ErrorPage />;

  console.log(tasks[0].projects);
  let taskList;
  // tasks[0].projects.forEach((tasks: { tasks: unknown }[]) => {
  //   tasks.tasks.forEach((item: unknown) => {
  //     // taskList.push(item);
  //     console.log(item);
  //   });
  // });

  console.log(taskList);

  const getDaysInMonth = (year: number, month: number) => {
    const firstDay = DateTime.local(year, month, 1);
    const lastDay = firstDay.endOf("month");
    const days = [];

    for (let i = 1; i <= lastDay.day; i++) {
      days.push(DateTime.local(year, month, i));
    }
    return days;
  };

  const renderCalendar = () => {
    const days = getDaysInMonth(currentDate.year, currentDate.month);
    const firstDayOfMonth = days[0].weekday;
    const paddingDays = firstDayOfMonth === 7 ? 0 : firstDayOfMonth;

    return (
      <div className="grid grid-cols-7 gap-1 w-full">
        {weekdays.map((day) => (
          <div key={day} className="text-center font-bold py-2">
            {day}
          </div>
        ))}
        {Array(paddingDays)
          .fill(null)
          .map((_, index) => (
            <div key={`padding-${index}`} className="p-2"></div>
          ))}
        {days.map((day) => {
          const dayEvents = events.filter((event) => {
            const start = DateTime.fromISO(event.startTime);
            const end = DateTime.fromISO(event.endTime);
            return day >= start && day <= end;
          });
          return (
            <motion.div
              key={day.toISO()}
              className="p-2 border border-gray-200 rounded-lg aspect-square"
              whileHover={{ scale: 1.05 }}
            >
              <div
                className={`text-center ${
                  day.hasSame(DateTime.now(), "day")
                    ? "font-bold text-blue-500"
                    : ""
                }`}
              >
                {day.day}
              </div>
              {dayEvents.map((event) => (
                <motion.div
                  key={event.id}
                  className={`${event.color} text-white text-xs p-1 mt-1 rounded-md cursor-pointer`}
                  whileHover={{ scale: 1.1 }}
                >
                  {event.title}
                </motion.div>
              ))}
            </motion.div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen text-black w-full">
      <main className="flex-grow overflow-scroll no-scrollbar w-full pb-8 ">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full px-4"
        >
          {renderCalendar()}
        </motion.div>
      </main>
    </div>
  );
}
