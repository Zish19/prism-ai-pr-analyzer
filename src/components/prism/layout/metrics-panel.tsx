"use client";

import { ShieldAlert, FileBox, CheckCircle2, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Panel } from "@/components/prism/panel";
import { MetricCard } from "@/components/prism/metric-card";
import { type MockReview } from "@/data/mock-review";

interface MetricsPanelProps {
  review: MockReview;
}

export function MetricsPanel({ review }: MetricsPanelProps) {
  const scores = review.scores;

  return (
    <div className="flex h-full flex-col bg-sidebar/30 overflow-y-auto">
      <div className="p-5 border-b">
        <h2 className="text-sm font-semibold mb-3">AI Review Summary</h2>
        <Panel variant="interactive" className="p-4 border-emerald-500/20 bg-emerald-500/5">
          <div className="flex justify-between items-end mb-2">
            <span className="text-sm font-medium text-emerald-500">Merge Probability</span>
            <span className="text-4xl font-bold tracking-tighter text-emerald-500">{review.mergeProbability}%</span>
          </div>
          <div className="text-xs font-semibold text-emerald-500/80 mb-2 tracking-widest uppercase">
            Ready to Merge
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {review.summary}
          </p>
        </Panel>
      </div>

      <div className="p-5 flex-1">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
          Analysis Dimensions
        </h3>
        <div className="grid grid-cols-2 gap-3 mb-6">
          <MetricCard
            icon={ShieldAlert}
            label="Security"
            value={scores.security.score}
            accentColor={scores.security.score > 90 ? "success" : "warning"}
            trend="up"
            trendValue="+2"
          />
          <MetricCard
            icon={FileBox}
            label="Architecture"
            value={scores.architecture.score}
            accentColor="blue"
          />
          <MetricCard
            icon={CheckCircle2}
            label="Code Quality"
            value="A"
            accentColor="blue"
          />
          <MetricCard
            icon={Zap}
            label="Performance"
            value={scores.performance.score}
            accentColor="success"
          />
        </div>

        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
          Key Findings
        </h3>
        <div className="space-y-3">
          {scores.security.issues.map((issue) => (
            <Panel key={issue.id} className="p-3">
              <div className="flex items-start gap-2 mb-1.5">
                <Badge variant={issue.severity === "warning" ? "warning" : "secondary"} size="sm" className="px-1.5">
                  {issue.severity}
                </Badge>
                <span className="text-xs font-mono text-muted-foreground truncate pt-0.5">{issue.file}:{issue.line}</span>
              </div>
              <p className="text-xs leading-relaxed mt-1.5">
                {issue.message}
              </p>
            </Panel>
          ))}
        </div>
      </div>
    </div>
  );
}
