import Navbar from "@/components/Navbar";
import { Cover } from "@/components/ui/cover";
import { SparklesCore } from "@/components/ui/sparkles";
import { RootState } from "@/state/store";
import { setTab } from "@/state/tab/tabSlice";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

export default function HomePage() {
  const theme = useSelector((state: RootState) => state.theme);
  
  const dispatch = useDispatch();

  useEffect(()=>{
    dispatch(setTab("Home"));
  })

  function sparkleColor() {
    if (theme === "dark") return "#FFFFFF";
    else return "#000000";
  }

  return (
    <>
      <Navbar />
      <div className="w-full flex flex-col items-center justify-center overflow-hidden rounded-md pt-[15%] z-0">
        <h1 className="md:text-7xl text-3xl lg:text-9xl font-bold text-center text-white relative z-0">
          <div>
            <h1 className="text-4xl md:text-4xl lg:text-6xl font-semibold max-w-7xl mx-auto text-center mt-6 relative z-20 py-6 bg-clip-text text-transparent bg-gradient-to-b from-neutral-800 via-neutral-700 to-neutral-700 dark:from-neutral-800 dark:via-white dark:to-white">
              Team Communication and Task Management
              <br /> <Cover>COM-X</Cover>
            </h1>
          </div>
        </h1>
        {/* something */}
        <div className="w-[40rem] h-40 relative">
          <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-[2px] w-3/4 blur-sm" />
          <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-px w-3/4" />
          <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-[5px] w-1/4 blur-sm" />
          <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px w-1/4" />

          <SparklesCore
            background="transparent"
            minSize={0.4}
            maxSize={1}
            particleDensity={1200}
            className="w-full h-full z-0"
            particleColor={sparkleColor()}
          />

          <div className="absolute inset-0 w-full h-full bg-white dark:bg-black [mask-image:radial-gradient(350px_200px_at_top,transparent_20%,white)]"></div>
        </div>
        <Toaster />
      </div>
    </>
  );
}
