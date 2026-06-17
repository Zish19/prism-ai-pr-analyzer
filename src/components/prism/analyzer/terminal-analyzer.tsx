"use client";

import { useEffect, useState } from "react";
import { Terminal, Circle, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { analyzePRAction } from "@/app/actions/analyze-pr";

interface TerminalAnalyzerProps {
  prUrl: string;
  onComplete: (data: { pr: any; diffs: any[]; reviewResult?: any } | null) => void;
}

type StepStatus = "pending" | "running" | "done" | "error";

interface Step {
  id: number;
  label: string;
  status: StepStatus;
  result: string;
  resultClass: string;
}

export function TerminalAnalyzer({ prUrl, onComplete }: TerminalAnalyzerProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<Step[]>([
    { id: 1, label: "Fetching PR Data", status: "pending", result: "", resultClass: "" },
    { id: 2, label: "Parsing Diff", status: "pending", result: "", resultClass: "" },
    { id: 3, label: "Running Analysis", status: "pending", result: "", resultClass: "" },
    { id: 4, label: "Scoring Engine", status: "pending", result: "", resultClass: "" },
  ]);
  const [isDone, setIsDone] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const updateStep = (index: number, updates: Partial<Step>) => {
      if (!isMounted) return;
      setSteps((s) =>
        s.map((step, i) => (i === index ? { ...step, ...updates } : step))
      );
    };

    const runSequence = async () => {
      await new Promise((r) => setTimeout(r, 400));
      if (!isMounted) return;

      // Step 0: Fetch PR data from our API route
      setCurrentStep(0);
      updateStep(0, { status: "running" });

      // Parse the URL to get owner/repo/pr
      const urlMatch = prUrl.match(
        /(?:https?:\/\/)?github\.com\/([^/]+)\/([^/]+)\/pull\/(\d+)/
      );

      if (!urlMatch) {
        updateStep(0, {
          status: "error",
          result: "invalid url",
          resultClass: "text-rose-400",
        });
        setErrorMessage("Invalid GitHub PR URL. Expected format: https://github.com/owner/repo/pull/123");
        return;
      }

      const [, owner, repo, prNumber] = urlMatch;

      try {
        const res = await analyzePRAction(prUrl);

        if (!res.success) {
          updateStep(0, {
            status: "error",
            result: "failed",
            resultClass: "text-rose-400",
          });
          setErrorMessage(res.error || "Failed to fetch PR data.");
          return;
        }

        if (!isMounted) return;

        updateStep(0, {
          status: "done",
          result: `${res.metadata.changed_files} files`,
          resultClass: "text-emerald-400",
        });

        // Step 1: Parse diff
        await new Promise((r) => setTimeout(r, 300));
        if (!isMounted) return;
        setCurrentStep(1);
        updateStep(1, { status: "running" });

        await new Promise((r) => setTimeout(r, 400));
        if (!isMounted) return;

        const diffCount = res.files?.length || 0;
        let diffLabel = `${diffCount} diffs`;
        if (res.isPartial) diffLabel += " (capped)";

        updateStep(1, {
          status: "done",
          result: diffLabel,
          resultClass: "text-emerald-400",
        });

        // Step 2: Running analysis
        await new Promise((r) => setTimeout(r, 300));
        if (!isMounted) return;
        setCurrentStep(2);
        updateStep(2, { status: "running" });

        await new Promise((r) => setTimeout(r, 600));
        if (!isMounted) return;
        updateStep(2, {
          status: "done",
          result: "complete",
          resultClass: "text-emerald-400",
        });

        // Step 3: Scoring
        await new Promise((r) => setTimeout(r, 300));
        if (!isMounted) return;
        setCurrentStep(3);
        updateStep(3, { status: "running" });

        await new Promise((r) => setTimeout(r, 500));
        if (!isMounted) return;
        updateStep(3, {
          status: "done",
          result: "ready",
          resultClass: "text-primary",
        });

        // Complete
        setIsDone(true);
        await new Promise((r) => setTimeout(r, 600));
        if (!isMounted) return;
        
        onComplete({
          pr: {
            id: res.metadata.id.toString(),
            title: res.metadata.title,
            description: res.metadata.body || "",
            author: res.metadata.user.login,
            authorAvatar: res.metadata.user.avatar_url,
            createdAt: res.metadata.created_at,
            repo: `${owner}/${repo}`,
            number: parseInt(prNumber, 10),
            additions: res.metadata.additions,
            deletions: res.metadata.deletions,
            filesChanged: res.metadata.changed_files,
            state: res.metadata.state,
          },
          diffs: res.files,
          reviewResult: res.result
        });
      } catch (err) {
        console.error("Fetch error:", err);
        updateStep(0, {
          status: "error",
          result: "network error",
          resultClass: "text-rose-400",
        });
        setErrorMessage("Network error. Please check your connection and try again.");
      }
    };

    runSequence();

    return () => {
      isMounted = false;
    };
  }, [prUrl, onComplete]);

  // Extract PR id for command display
  const prId = prUrl.match(/\/pull\/(\d+)/)?.[1] || "???";

  return (
    <div className="w-full max-w-lg bg-background border border-border/50 rounded-none shadow-2xl overflow-hidden font-mono flex flex-col relative">
      <div className="absolute inset-0 dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[linear-gradient(rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.05)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />
      {/* Header */}
      <div className="flex items-center px-4 py-2 bg-secondary border-b border-border/50 relative z-10">
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
          <span className="uppercase tracking-widest text-[10px]">Initializing AI agents for PR #{prId}...</span>
        </div>

        <div className="space-y-4 ml-2 border-l border-border/30 pl-4">
          {steps.map((step, idx) => (
            <div key={step.id} className={`transition-opacity duration-300 ${idx > currentStep ? "opacity-0" : "opacity-100"}`}>
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  {step.status === "pending" && <Circle className="size-3 text-muted-foreground/30" />}
                  {step.status === "running" && <Loader2 className="size-3 text-primary animate-spin" />}
                  {step.status === "done" && <CheckCircle2 className="size-3 text-emerald-500" />}
                  {step.status === "error" && <XCircle className="size-3 text-rose-500" />}
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

        {errorMessage && (
          <div className="mt-6 flex items-start gap-2 text-rose-400 animate-in fade-in slide-in-from-bottom-2">
            <span className="font-bold shrink-0">✕</span>
            <div>
              <span className="uppercase tracking-widest text-[10px] block">{errorMessage}</span>
              <button
                onClick={() => window.location.reload()}
                className="mt-2 text-[10px] uppercase tracking-widest text-primary hover:text-primary/80 underline underline-offset-2 transition-colors"
              >
                Try again
              </button>
            </div>
          </div>
        )}

        {isDone && !errorMessage && (
          <div className="mt-6 flex items-center gap-2 text-emerald-500 animate-in fade-in slide-in-from-bottom-2">
            <span className="font-bold">▶</span>
            <span className="uppercase tracking-widest text-[10px]">Analysis complete. Rendering UI...</span>
          </div>
        )}
      </div>
    </div>
  );
}
