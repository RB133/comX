export type Priority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export const PRIORITY_LEVELS: { key: Priority; label: string; color: string }[] = [
  { key: "LOW", label: "Low", color: "hsl(120, 60%, 50%)" },
  { key: "MEDIUM", label: "Medium", color: "hsl(45, 90%, 55%)" },
  { key: "HIGH", label: "High", color: "hsl(15, 80%, 50%)" },
  { key: "CRITICAL", label: "Critical", color: "hsl(0, 70%, 50%)" },
];
