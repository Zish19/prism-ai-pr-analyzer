import { SignUp } from "@clerk/nextjs";
import { BlueprintCrosshair } from "@/components/prism/blueprint-crosshair";

export default function SignUpPage() {
  return (
    <div className="min-h-dvh flex items-center justify-center bg-background relative overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 dark:bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[linear-gradient(rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.05)_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none" />
      
      {/* Crosshairs */}
      <BlueprintCrosshair className="top-1/4 left-1/4 opacity-30" />
      <BlueprintCrosshair className="top-3/4 right-1/4 opacity-30" />
      
      <div className="relative z-10 p-8 border border-border bg-secondary/80 backdrop-blur-sm">
        <SignUp />
      </div>
    </div>
  );
}
