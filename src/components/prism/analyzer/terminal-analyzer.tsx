"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Terminal, X, Minimize2, Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface TerminalAnalyzerProps {
  prUrl: string;
  onComplete: () => void;
}

type Step = {
  text: string;
  status: "pending" | "running" | "done" | "error";
  result?: string;
  resultClass?: string;
};

export function TerminalAnalyzer({ prUrl, onComplete }: TerminalAnalyzerProps) {
  const [steps, setSteps] = useState<Step[]>([
    { text: "Fetching metadata...", status: "pending" },
    { text: "Running security agent...", status: "pending" },
    { text: "Running performance agent...", status: "pending" },
    { text: "Computing score...", status: "pending" },
  ]);
  const [currentStep, setCurrentStep] = useState(-1);
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
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 1.05, filter: "blur(4px)" }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-2xl mx-auto rounded-xl overflow-hidden border border-border shadow-2xl bg-[#0a0b0f] font-mono text-sm"
    >
      {/* Terminal Header */}
      <div className="flex items-center px-4 py-3 bg-[#12131a] border-b border-border/50">
        <div className="flex gap-2 mr-4">
          <div className="size-3 rounded-full bg-rose-500/80" />
          <div className="size-3 rounded-full bg-amber-500/80" />
          <div className="size-3 rounded-full bg-emerald-500/80" />
        </div>
        <div className="flex-1 flex justify-center text-xs text-muted-foreground font-medium flex items-center gap-2">
          <Terminal className="size-3" />
          prism-analyzer
        </div>
        <div className="flex gap-3 text-muted-foreground ml-4 opacity-50">
          <Minimize2 className="size-3" />
          <Maximize2 className="size-3" />
          <X className="size-3" />
        </div>
      </div>

      {/* Terminal Body */}
      <div className="p-6 h-[280px] text-[#e4e4e8] overflow-hidden relative">
        <div className="space-y-3">
          <div>
            <span className="text-emerald-400 mr-2">$</span>
            <span className="text-white font-medium">prism analyze pr-{prId}</span>
          </div>
          
          <AnimatePresence>
            {currentStep >= 0 && steps.map((step, idx) => {
              if (idx > currentStep) return null;
              
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center"
                >
                  {step.status === "running" ? (
                    <span className="text-primary mr-2 animate-pulse">⠋</span>
                  ) : (
                    <span className="text-emerald-400 mr-2">✓</span>
                  )}
                  <span className={step.status === "running" ? "text-muted-foreground" : ""}>
                    {step.text}
                  </span>
                  
                  {step.result && (
                    <motion.span 
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }}
                      className={cn("ml-2", step.resultClass || "text-[#6b7280]")}
                    >
                      {step.result}
                    </motion.span>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
          
          {isDone && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <span className="text-emerald-400 mr-2">$</span>
              <span className="animate-pulse">_</span>
            </motion.div>
          )}
        </div>
        
        {/* Subtle grid background for terminal */}
        <div className="absolute inset-0 pointer-events-none" style={{ 
          backgroundImage: "linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px)",
          backgroundSize: "100% 24px",
          zIndex: 0
        }} />
      </div>
    </motion.div>
  );
}
