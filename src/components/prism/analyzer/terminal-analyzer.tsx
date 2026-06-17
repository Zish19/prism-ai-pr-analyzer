"use client";

import { useEffect, useState } from "react";
import { Terminal, Circle, Loader2, CheckCircle2 } from "lucide-react";

interface TerminalAnalyzerProps {
  prUrl: string;
  onComplete: () => void;
}

export function TerminalAnalyzer({ prUrl, onComplete }: TerminalAnalyzerProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState([
    { id: 1, label: "Fetching Metadata", status: "pending", result: "", resultClass: "" },
    { id: 2, label: "Security Analysis", status: "pending", result: "", resultClass: "" },
    { id: 3, label: "Performance Profile", status: "pending", result: "", resultClass: "" },
    { id: 4, label: "Scoring Engine", status: "pending", result: "", resultClass: "" }
  ]);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    let isMounted = true;
    
    const runSequence = async () => {
      // Small initial delay
      await new Promise(r => setTimeout(r, 400));
      if (!isMounted) return;
      
      // Step 0: Fetching metadata
      setCurrentStep(0);
      setSteps(s => s.map((step, i) => i === 0 ? { ...step, status: "running" } : step));
      await new Promise(r => setTimeout(r, 300));
      if (!isMounted) return;
      setSteps(s => s.map((step, i) => i === 0 ? { ...step, status: "done", result: "done" } : step));
      
      // Step 1: Security
      setCurrentStep(1);
      setSteps(s => s.map((step, i) => i === 1 ? { ...step, status: "running" } : step));
      await new Promise(r => setTimeout(r, 600));
      if (!isMounted) return;
      setSteps(s => s.map((step, i) => i === 1 ? { ...step, status: "done", result: "2 issues", resultClass: "text-amber-400" } : step));
      
      // Step 2: Performance
      setCurrentStep(2);
      setSteps(s => s.map((step, i) => i === 2 ? { ...step, status: "running" } : step));
      await new Promise(r => setTimeout(r, 400));
      if (!isMounted) return;
      setSteps(s => s.map((step, i) => i === 2 ? { ...step, status: "done", result: "optimized", resultClass: "text-emerald-400" } : step));
      
      // Step 3: Score
      setCurrentStep(3);
      setSteps(s => s.map((step, i) => i === 3 ? { ...step, status: "running" } : step));
      await new Promise(r => setTimeout(r, 500));
      if (!isMounted) return;
      setSteps(s => s.map((step, i) => i === 3 ? { ...step, status: "done", result: "84%", resultClass: "text-primary" } : step));
      
      // Complete
      setIsDone(true);
      await new Promise(r => setTimeout(r, 600));
      if (!isMounted) return;
      onComplete();
    };
    
    runSequence();
    
    return () => { isMounted = false; };
  }, [onComplete]);

  // Extract PR id for command
  const prId = prUrl.match(/\/pull\/(\d+)/)?.[1] || "31336";

  return (
    <div className="w-full max-w-lg bg-[#0a0b0f] border border-border/50 rounded-none shadow-2xl overflow-hidden font-mono flex flex-col relative">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />
      {/* Header */}
      <div className="flex items-center px-4 py-2 bg-[#0d0d12] border-b border-border/50 relative z-10">
        <div className="flex gap-1.5">
          <div className="size-2 rounded-none bg-border/50" />
          <div className="size-2 rounded-none bg-border/50" />
          <div className="size-2 rounded-none bg-border/50" />
        </div>
        <div className="mx-auto text-[10px] text-muted-foreground uppercase tracking-widest flex items-center gap-2">
          <Terminal className="size-3" />
          prism-ai --analyze {prId}
        </div>
      </div>

      {/* Body */}
      <div className="p-5 text-xs text-[#a1a1aa] min-h-[260px] relative z-10">
        <div className="flex items-center gap-2 mb-4 text-emerald-500">
          <span className="font-bold">▶</span>
          <span className="uppercase tracking-widest text-[10px]">Initializing AI agents for {prId}...</span>
        </div>

        <div className="space-y-4 ml-2 border-l border-border/30 pl-4">
          {steps.map((step, idx) => (
            <div key={step.id} className={`transition-opacity duration-300 ${idx > currentStep ? "opacity-0" : "opacity-100"}`}>
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  {step.status === "pending" && <Circle className="size-3 text-muted-foreground/30" />}
                  {step.status === "running" && <Loader2 className="size-3 text-primary animate-spin" />}
                  {step.status === "done" && <CheckCircle2 className="size-3 text-emerald-500" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className={step.status === "running" ? "text-foreground font-bold uppercase tracking-wider text-[10px]" : "uppercase tracking-wider text-[10px]"}>
                      {step.label}
                    </span>
                    {step.result && (
                      <span className={`font-bold uppercase tracking-wider text-[10px] ${step.resultClass || ""}`}>
                        [{step.result}]
                      </span>
                    )}
                  </div>
                  {step.status === "running" && (
                    <div className="h-0.5 w-full bg-secondary mt-2 overflow-hidden rounded-none">
                      <div className="h-full bg-primary w-1/2 animate-[pulse_1s_ease-in-out_infinite]" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {isDone && (
          <div className="mt-6 flex items-center gap-2 text-emerald-500 animate-in fade-in slide-in-from-bottom-2">
            <span className="font-bold">▶</span>
            <span className="uppercase tracking-widest text-[10px]">Analysis complete. Rendering UI...</span>
          </div>
        )}
      </div>
    </div>
  );
}
