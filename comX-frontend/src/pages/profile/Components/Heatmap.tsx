import { useEffect, useMemo, useRef, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { scaleLinear } from "d3-scale";
import { interpolateGreens } from "d3-scale-chromatic";
import { PublicProfile } from "@/types/UserProfile";

interface ContributionData {
  date: Date;
  count: number;
}

interface HeatmapProps {
  profile: PublicProfile;
  title?: string;
  description?: string;
}

const DAYS_IN_WEEK = 7;
const WEEKS_IN_YEAR = 53;
// Data cells are placed at column (week index + 3), so the grid needs two
// extra columns beyond the week count: one for weekday labels, one so the
// very last (most recent) week isn't pushed into an implicit, unsized track.
const TOTAL_COLUMNS = WEEKS_IN_YEAR + 2;
const MARGIN_LEFT = 32;
// No upper bound: the grid should always stretch to fill its container
// exactly, however wide that is. Only a floor, so cells never shrink past
// legibility on narrow screens (the container scrolls horizontally instead).
const MIN_CELL_SIZE = 9;
const GAP = 2;

/** Tracks an element's rendered width so the grid can size its cells to fill it exactly. */
function useContainerWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      setWidth(entry.contentRect.width);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, width };
}

const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const weekdayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const NO_ACTIVITY_COLOR = "#ebedf0";

const CustomHeatmap = ({
  data,
  cellSize,
}: {
  data: ContributionData[];
  cellSize: number;
}) => {
  // Guard against a degenerate [0, 0] domain (no activity at all yet) —
  // scaleLinear would otherwise map every input to the top of the range,
  // rendering every cell at maximum green intensity instead of empty/grey.
  const maxCount = Math.max(...data.map((d) => d.count), 0);
  const colorScale = scaleLinear<number>()
    .domain([0, maxCount || 1])
    .range([0, 1]);

  const startDate = data[0].date;

  // Generate month labels based on start date. Placement uses the integer
  // week index directly (matching how data cells are placed below) instead
  // of round-tripping through pixel math — that round trip made label
  // columns sensitive to sub-pixel cellSize differences between browser
  // zoom levels, causing labels to visibly jump between weeks.
  const monthLabels = useMemo(() => {
    const labels = [];
    // i goes one month past 12 so the wrap-around label (e.g. a second
    // "Jul" a year later) is generated the same way as every other label,
    // instead of as a separately hardcoded, error-prone special case.
    for (let i = 0; i <= 12; i++) {
      const date = new Date(startDate);
      date.setMonth(startDate.getMonth() + i);
      const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
      const weekIndex = Math.floor(
        (firstDayOfMonth.getTime() - startDate.getTime()) /
          (7 * 24 * 60 * 60 * 1000)
      );

      if (weekIndex >= 0 && weekIndex < WEEKS_IN_YEAR) {
        labels.push({ label: monthNames[date.getMonth()], weekIndex });
      }
    }
    return labels;
  }, [startDate]);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${TOTAL_COLUMNS}, ${cellSize}px)`,
        gridTemplateRows: `repeat(${DAYS_IN_WEEK + 2}, ${cellSize}px)`,
        gap: `${GAP}px`,
        position: "relative",
        width: `${TOTAL_COLUMNS * cellSize + MARGIN_LEFT}px`,
        height: `${(DAYS_IN_WEEK + 2) * cellSize}px`,
      }}
    >
      {/* Month labels */}
      {monthLabels.map((month, index) => (
        <div
          key={index}
          style={{
            gridColumnStart: month.weekIndex + 3,
            gridRowStart: 1,
            fontSize: "12px",
            textAlign: "left",
          }}
        >
          {month.label}
        </div>
      ))}

      {/* Weekday labels */}
      {weekdayNames.map((day, index) => (
        <div
          key={day}
          style={{
            gridColumnStart: 1,
            gridRowStart: index + 2,
            fontSize: "12px",
            textAlign: "right",
          }}
        >
          {day}
        </div>
      ))}

      {/* Render heatmap cells */}
      {data.map((day, index) => {
        const col = Math.floor(index / DAYS_IN_WEEK);
        const row = index % DAYS_IN_WEEK;
        return (
          <div
            key={day.date.toISOString()}
            style={{
              gridColumnStart: col + 3,
              gridRowStart: row + 2,
              width: `${cellSize - GAP}px`,
              height: `${cellSize - GAP}px`,
              backgroundColor:
                day.count === 0 ? NO_ACTIVITY_COLOR : interpolateGreens(colorScale(day.count)),
              borderRadius: "3px",
              textAlign: "center",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "10px",
              color: "#fff",
              cursor: "pointer",
            }}
            title={`${day.date.toDateString()}: ${day.count} contribution${
              day.count !== 1 ? "s" : ""
            }`}
          ></div>
        );
      })}
    </div>
  );
};

export default function ImprovedCodeHeatmap({
  profile,
  title = "Contribution Heatmap",
  description = "Visualization of your coding activity over the past year",
}: HeatmapProps) {
  const { ref, width } = useContainerWidth<HTMLDivElement>();

  const data = useMemo(() => generateSampleData(365, profile.Task), [profile.Task]);

  // Solve for the cell size that makes the grid exactly fill the container's
  // measured width, so there's never dead space on the right.
  const cellSize = width
    ? Math.max(MIN_CELL_SIZE, (width - MARGIN_LEFT) / TOTAL_COLUMNS)
    : 19;

  // If the grid is ever wider than the container (only possible on very
  // narrow screens, where cellSize hits the floor), default to showing
  // today's end of the calendar instead of making the user scroll to it.
  useEffect(() => {
    const el = ref.current;
    if (el) el.scrollLeft = el.scrollWidth;
  }, [ref, cellSize]);

  return (
    <Card className="w-full mx-auto">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div ref={ref} className="w-full h-auto overflow-x-auto">
          <CustomHeatmap data={data} cellSize={cellSize} />
        </div>
      </CardContent>
    </Card>
  );
}

type Task = {
  id: number;
  title: string;
  priority: string;
  status: string;
  deadline: string;
  createdAt: string;
  completedDate: string | null;
};

const generateSampleData = (
  days: number,
  tasks: Task[]
): ContributionData[] => {
  const data: ContributionData[] = [];
  const endDate = new Date();
  endDate.setHours(0, 0, 0, 0);

  for (let i = 0; i < days; i++) {
    const date = new Date(endDate);
    date.setDate(date.getDate() - i);

    const completedCount = tasks.filter((task) => {
      if (task.completedDate) {
        const taskDate = new Date(task.completedDate);
        taskDate.setHours(0, 0, 0, 0);
        return taskDate.getTime() === date.getTime();
      }
      return false;
    }).length;

    data.unshift({
      date: date,
      count: completedCount,
    });
  }

  return data;
};
