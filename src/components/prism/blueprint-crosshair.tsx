import { cn } from "@/lib/utils";

export function BlueprintCrosshair({ className }: { className?: string }) {
  return (
    <div className={cn("absolute size-3 pointer-events-none z-10 flex items-center justify-center", className)}>
      <div className="absolute w-full h-[1px] bg-border/80" />
      <div className="absolute h-full w-[1px] bg-border/80" />
    </div>
  );
}
