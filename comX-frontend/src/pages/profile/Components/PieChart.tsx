"use client";

import { useState, useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Sector } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import ProfileAPI from "@/api/profile/ProfileAPI";
import ErrorPage from "@/pages/genral/ErrorPage";

const RADIAN = Math.PI / 180;
const renderActiveShape = (props: any) => {
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    value,
  } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={fill}
        fill="none"
      />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fill="#333"
      >{`${value} (${(percent * 100).toFixed(2)}%)`}</text>
    </g>
  );
};

export default function PieChartTask() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [animationComplete, setAnimationComplete] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimationComplete(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const { profile, profileLoading, profileError } = ProfileAPI();

  if (profileLoading) return <div>Loading ...</div>;
  if (profileError) return <ErrorPage />;

  console.log(profile);

  const data = [
    {
      name: "Low",
      value: profile.Task.filter(
        (item: { priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" }) =>
          item.priority === "LOW"
      ).length,
      color: "hsl(120, 60%, 50%)",
    },
    {
      name: "Medium",
      value: profile.Task.filter(
        (item: { priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" }) =>
          item.priority === "MEDIUM"
      ).length,
      color: "hsl(45, 90%, 55%)",
    },
    {
      name: "High",
      value: profile.Task.filter(
        (item: { priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" }) =>
          item.priority === "HIGH"
      ).length,
      color: "hsl(15, 80%, 50%)",
    },
    {
      name: "Critical",
      value: profile.Task.filter(
        (item: { priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" }) =>
          item.priority === "CRITICAL"
      ).length,
      color: "hsl(0, 70%, 50%)",
    },
  ];

  console.log(data);

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Task Distribution</CardTitle>
        <CardDescription>Distribution of Task by priority</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col">
        <ChartContainer
          config={{
            low: {
              label: "low",
              color: "hsl(120, 60%, 50%)",
            },
            medium: {
              label: "Medium",
              color: "hsl(45, 90%, 55%)",
            },
            high: {
              label: "high",
              color: "hsl(15, 80%, 50%)",
            },
            critical: {
              label: "low",
              color: "hsl(0, 70%, 50%)",
            },
          }}
          className="h-[182px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent />} />
              <Pie
                activeIndex={activeIndex}
                activeShape={renderActiveShape}
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                onMouseEnter={onPieEnter}
                animationBegin={0}
                animationDuration={1000}
                animationEasing="ease-out"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
        <div className="mt-4 flex justify-center space-x-4">
          {data.map((entry, index) => (
            <div key={`legend-${index}`} className="flex items-center">
              <div
                className="mr-2 h-3 w-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span
                className={`text-sm transition-opacity duration-1000 ${
                  animationComplete ? "opacity-100" : "opacity-0"
                }`}
              >
                {entry.name}: {entry.value} (
                {((entry.value / total) * 100).toFixed(1)}%)
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
