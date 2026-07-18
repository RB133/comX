import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { endOfMonth, isSameDay, parseISO } from "date-fns";
import { useSelector } from "react-redux";
import { RootState } from "@/state/store";
import CalendarAPI from "@/api/calendar/CalendarAPI";
import ErrorPage from "../general/ErrorPage";

interface CalendarEvent {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  color: string;
}

const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function MainCalendar() {
  const { tasks, tasksLoading, tasksError } = CalendarAPI();

  const activeChannel = useSelector((state: RootState) => state.activeChannel);
  const year = useSelector((state: RootState) => state.year);

  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    // activeChannel carries the selected month as 1-12 (from the sidebar's
    // Months list); Date's own month is 0-11, so it's converted at the edge.
    const handleSetMonth = (month: number) => {
      if (currentDate.getMonth() !== month - 1) {
        setCurrentDate((prevDate) => {
          const next = new Date(prevDate);
          next.setDate(1); // avoid rolling into the wrong month for day 29-31
          next.setMonth(month - 1);
          return next;
        });
      }
    };

    const handleSetYear = (newYear: number) => {
      if (currentDate.getFullYear() !== newYear) {
        setCurrentDate((prevDate) => {
          const next = new Date(prevDate);
          next.setDate(1);
          next.setFullYear(newYear);
          return next;
        });
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

  if (tasksLoading) return <div>Loading...</div>;
  if (tasksError) return <ErrorPage />;

  const events: CalendarEvent[] = Array.isArray(tasks) ? tasks : [];

  const getDaysInMonth = (year: number, month: number) => {
    const firstDay = new Date(year, month, 1);
    const lastDay = endOfMonth(firstDay);
    const days: Date[] = [];

    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const renderCalendar = () => {
    const days = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());
    // getDay() is already Sun=0..Sat=6, matching the weekdays array order,
    // so no special-casing is needed for the padding count.
    const paddingDays = days[0].getDay();

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
            const start = parseISO(event.startTime);
            const end = parseISO(event.endTime);
            return day >= start && day <= end;
          });
          return (
            <motion.div
              key={day.toISOString()}
              className="p-2 border border-gray-200 rounded-lg aspect-square"
              whileHover={{ scale: 1.05 }}
            >
              <div
                className={`text-center ${
                  isSameDay(day, new Date()) ? "font-bold text-blue-500" : ""
                }`}
              >
                {day.getDate()}
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
