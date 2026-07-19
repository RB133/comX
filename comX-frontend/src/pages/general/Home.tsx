import Navbar from "@/components/Navbar";
import { Cover } from "@/components/ui/cover";
import { SparklesCore } from "@/components/ui/sparkles";
import { setTab } from "@/state/tab/tabSlice";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { useDispatch } from "react-redux";

export default function HomePage() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setTab("Home"));
  }, [dispatch]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      {/* flex-1 + items-center centers the hero in the space below the navbar,
          regardless of navbar height or viewport size — no guessed padding. */}
      <div className="flex-1 w-full flex flex-col items-center justify-center overflow-hidden rounded-md z-0">
        <h1 className="text-4xl md:text-4xl lg:text-6xl font-semibold max-w-7xl mx-auto text-center relative z-20 py-6 bg-clip-text text-transparent bg-gradient-to-b from-neutral-800 via-neutral-700 to-neutral-700">
          A Unified Workspace for Software Teams
          <br /> <Cover>COM-X</Cover>
        </h1>
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
            particleColor="#000000"
          />

          <div className="absolute inset-0 w-full h-full bg-white [mask-image:radial-gradient(350px_200px_at_top,transparent_20%,white)]"></div>
        </div>
        <Toaster />
      </div>
    </div>
  );
}
