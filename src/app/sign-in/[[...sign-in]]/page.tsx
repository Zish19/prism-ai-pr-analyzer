import { SignIn } from "@clerk/nextjs";
import { BlueprintCrosshair } from "@/components/prism/blueprint-crosshair";

export default function SignInPage() {
  return (
    <div className="min-h-dvh flex items-center justify-center bg-background relative overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none" />
      
      {/* Crosshairs */}
      <BlueprintCrosshair className="top-1/4 left-1/4 opacity-30" />
      <BlueprintCrosshair className="top-3/4 right-1/4 opacity-30" />
      
      <div className="relative z-10 p-8 border border-[#1e2028] bg-[#0d0d12]/80 backdrop-blur-sm">
        <SignIn />
      </div>
    </div>
  );
}
