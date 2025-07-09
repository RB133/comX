import { useSelector } from "react-redux";
import { SparklesCore } from "./ui/sparkles";
import { RootState } from "@/state/store";
import { Theme } from "@/types/Theme";

export function Background({ children }: { children: React.ReactNode }) {
  const theme: Theme = useSelector((state: RootState) => state.theme);

  function particleColor() {
    if (theme === "dark") return "#FFFFFF";
    else return "#000000";
  }

  return (
    <div className="h-screen relative w-full bg-white dark:bg-background flex flex-col items-center justify-start">
      <div className="w-full absolute inset-0 h-screen">
        <SparklesCore
          id="tsparticlesfullpage"
          background="transparent"
          minSize={0.6}
          maxSize={1.4}
          particleDensity={100}
          className="w-full h-full"
          particleColor={particleColor()}
        />
      </div>
      <div className="z-10 no-scrollbar">{children}</div>
    </div>
  );
}
