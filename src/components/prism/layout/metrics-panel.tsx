"use client";

import { ShieldAlert, FileBox, CheckCircle2, Zap, Download, Copy, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { MetricCard } from "@/components/prism/metric-card";
import { BlueprintCrosshair } from "@/components/prism/blueprint-crosshair";
import type { ReviewResult } from "@/lib/analyzer/types";
import { generateMarkdownReport } from "@/lib/exporters/markdown";
import { generateJSONReport } from "@/lib/exporters/json";
import { useState } from "react";

interface MetricsPanelProps {
  review: ReviewResult;
  repoPath: string;
}

export function MetricsPanel({ review, repoPath }: MetricsPanelProps) {
  const scores = review.scores;
  const [copiedMd, setCopiedMd] = useState(false);

  const handleCopyMarkdown = async () => {
    const md = generateMarkdownReport(repoPath, review);
    await navigator.clipboard.writeText(md);
    setCopiedMd(true);
    setTimeout(() => setCopiedMd(false), 2000);
  };

  const handleDownloadJSON = () => {
    const json = generateJSONReport(repoPath, review);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `prism-report-${repoPath.replace("/", "-")}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex h-full flex-col bg-background overflow-y-auto relative">
      <div className="p-5 border-b border-border/50 bg-secondary">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[11px] font-mono tracking-[0.2em] uppercase text-muted-foreground">
            AI Review Summary
          </h2>
          <div className="flex gap-2">
            <button 
              onClick={handleCopyMarkdown}
              className="text-[9px] uppercase tracking-widest font-mono text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors px-2 py-1 border border-border/50 bg-background hover:bg-card"
            >
              {copiedMd ? <Check className="size-3 text-emerald-500" /> : <Copy className="size-3" />}
              {copiedMd ? "COPIED" : "MD"}
            </button>
            <button 
              onClick={handleDownloadJSON}
              className="text-[9px] uppercase tracking-widest font-mono text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors px-2 py-1 border border-border/50 bg-background hover:bg-card"
            >
              <Download className="size-3" />
              JSON
            </button>
          </div>
        </div>
        
        <div className="border border-emerald-500/30 bg-emerald-500/[0.02] p-4 relative overflow-hidden">
          <BlueprintCrosshair className="absolute top-0 left-0 opacity-50" />
          <BlueprintCrosshair className="absolute top-0 right-0 opacity-50" />
          <BlueprintCrosshair className="absolute bottom-0 left-0 opacity-50" />
          <BlueprintCrosshair className="absolute bottom-0 right-0 opacity-50" />
          {/* Blueprint corner accents */}
          <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-emerald-500/50" />
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-emerald-500/50" />
          
          <div className="flex justify-between items-end mb-3">
            <span className="text-[10px] font-mono tracking-widest uppercase text-emerald-500/70">Merge Probability</span>
            <span className="text-5xl font-mono tracking-tighter text-emerald-500">{review.mergeProbability}%</span>
          </div>
          <div className="text-[11px] font-bold text-emerald-500 mb-2 tracking-[0.2em] uppercase">
            {review.riskLevel === "Safe" ? "Ready to Merge" : review.riskLevel.toUpperCase() + " RISK"}
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed font-mono">
            {review.summary}
          </p>
        </div>
      </div>

      <div className="p-5 flex-1 bg-background">
        <h3 className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground mb-4">
          Analysis Dimensions
        </h3>
        <div className="grid grid-cols-2 gap-px bg-border/50 mb-8 border border-border/50">
          <MetricCard
            icon={ShieldAlert}
            label="SECURITY"
            value={scores.security.score.toString()}
            accentColor={scores.security.score > 90 ? "success" : "warning"}
          />
          <MetricCard
            icon={FileBox}
            label="ARCHITECTURE"
            value={scores.architecture.score.toString()}
            accentColor={scores.architecture.score > 90 ? "blue" : "warning"}
          />
          <MetricCard
            icon={CheckCircle2}
            label="QUALITY"
            value={scores.quality.score.toString()}
            accentColor={scores.quality.score > 90 ? "blue" : "warning"}
          />
          <MetricCard
            icon={Zap}
            label="PERFORMANCE"
            value={scores.performance.score.toString()}
            accentColor={scores.performance.score > 90 ? "success" : "warning"}
          />
        </div>

        <h3 className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground mb-4">
          Key Findings ({review.totalIssues})
        </h3>
        <div className="space-y-px bg-border/50 border border-border/50">
          {["security", "performance", "architecture", "quality"].flatMap((dim) => {
            const dimension = scores[dim as keyof typeof scores];
            return dimension.issues.map((issue, i) => (
              <div key={`${dim}-${issue.id}-${i}`} className="bg-background p-3 hover:bg-card transition-colors">
                <div className="flex items-start gap-2 mb-2">
                  <Badge variant={issue.severity === "critical" ? "danger" : issue.severity === "high" ? "warning" : "secondary"} size="sm" className="px-1.5 rounded-none font-mono text-[9px] uppercase tracking-wider">
                    {issue.severity}
                  </Badge>
                  {issue.confidence && (
                    <Badge variant="outline" size="sm" className="px-1.5 rounded-none font-mono text-[9px] uppercase tracking-wider text-muted-foreground border-border/50 opacity-70">
                      {issue.confidence} CONF
                    </Badge>
                  )}
                  <span className="text-[10px] font-mono text-muted-foreground truncate pt-0.5 ml-auto">
                    {issue.file && issue.line ? `L${issue.line}` : ''}
                  </span>
                </div>
                <div className="text-xs font-bold leading-relaxed font-mono text-foreground mb-1">
                  {issue.title}
                </div>
                <p className="text-xs leading-relaxed font-mono text-muted-foreground">
                  {issue.description}
                </p>
                {issue.confidenceReason && (
                  <p className="text-[10px] leading-relaxed font-mono text-muted-foreground/50 mt-1 italic">
                    ↳ {issue.confidenceReason}
                  </p>
                )}
              </div>
            ));
          })}
          
          {review.totalIssues === 0 && (
             <div className="bg-background p-4 text-center">
               <span className="text-xs font-mono text-muted-foreground">0 ISSUES DETECTED</span>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
