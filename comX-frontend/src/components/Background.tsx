import { SparklesCore } from "./ui/sparkles";

export function Background({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen relative w-full bg-white flex flex-col items-center justify-start">
      <div className="w-full absolute inset-0 h-screen">
        <SparklesCore
          id="tsparticlesfullpage"
          background="transparent"
          minSize={0.6}
          maxSize={1.4}
          particleDensity={100}
          className="w-full h-full"
          particleColor="#000000"
        />
      </div>
      <div className="z-10 no-scrollbar">{children}</div>
    </div>
  );
}
