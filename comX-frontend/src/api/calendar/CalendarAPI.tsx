import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { useParams } from "react-router-dom";


export default function CalendarAPI() {
  const { ID } = useParams();

  const { data, isLoading, error } = useQuery({
    queryKey: [`calendar/${ID}`],
    queryFn: async () => {
      const response = await api.get(
        `/calendar/get-calendar-task/${ID}`
      );
      return response.data.data;
    },
    staleTime: Infinity,
  });

  return { tasks: data, tasksLoading: isLoading, tasksError: error };
}
