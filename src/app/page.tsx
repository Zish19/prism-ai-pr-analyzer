"use client";

import Image from "next/image";
import {
  FileCode,
  FileBox,
  FilePlus,
  ShieldAlert,
  Zap,
  CheckCircle2,
  GitPullRequest,
  Search,
  Activity,
} from "lucide-react";
import { BRAND } from "@/constants/brand";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Panel } from "@/components/prism/panel";
import { MetricCard } from "@/components/prism/metric-card";
import {
  MOCK_REVIEW,
  MOCK_FILES,
} from "@/data/mock-review";
import { MOCK_DIFF, MOCK_HEADER_DIFF, type FileDiff } from "@/data/mock-diff";
import { cn } from "@/lib/utils";

export default function AppHome() {
  const pr = MOCK_REVIEW.pr;
  const scores = MOCK_REVIEW.scores;

  return (
    <div className="flex h-screen flex-col bg-background text-foreground overflow-hidden">
      {/* Top Navigation */}
      <header className="flex h-14 shrink-0 items-center justify-between border-b px-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Activity className="size-4" />
            </div>
            <span className="font-semibold tracking-tight">{BRAND.shortName}</span>
          </div>
          <div className="h-4 w-px bg-border" />
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <GitPullRequest className="size-4" />
            <span>{pr.repo}</span>
            <span className="text-border">/</span>
            <span className="text-foreground font-medium">#{pr.number}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="h-8">
            History
          </Button>
          <div className="h-6 w-px bg-border" />
          <div className="flex items-center gap-2 text-sm">
            <div className="relative size-6 overflow-hidden rounded-full bg-secondary">
              <Image src={pr.authorAvatar} alt={pr.author} fill className="object-cover" />
            </div>
            <span className="text-muted-foreground">{pr.author}</span>
          </div>
        </div>
      </header>

      {/* Main App Area */}
      <main className="flex flex-1 overflow-hidden">
        
        {/* Left Column: Context & Files */}
        <aside className="w-[280px] shrink-0 border-r flex flex-col bg-sidebar/30">
          <div className="p-4 border-b">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2 size-4 text-muted-foreground" />
                <input
                  type="text"
                  defaultValue={`https://github.com/${pr.repo}/pull/${pr.number}`}
                  className="w-full h-8 rounded-md border bg-input/50 pl-8 pr-3 text-xs outline-none focus:ring-1 focus:ring-primary focus:bg-background transition-colors"
                />
              </div>
              <Button size="sm" className="h-8 px-3 text-xs">Analyze</Button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-3">
            <div className="mb-4 px-1">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                Pull Request
              </h3>
              <p className="text-sm font-medium leading-snug mb-2">{pr.title}</p>
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                <div className="flex items-center gap-1.5">
                  <Badge variant="success" size="sm" className="font-normal">Open</Badge>
                </div>
                <span>{pr.commits} commits</span>
              </div>
              <div className="flex gap-3 text-xs">
                <span className="text-emerald-500 font-medium">+{pr.additions}</span>
                <span className="text-rose-500 font-medium">-{pr.deletions}</span>
              </div>
            </div>

            <div className="px-1">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                Files Changed ({pr.filesChanged})
              </h3>
              <ul className="space-y-0.5">
                {MOCK_FILES.map((file) => (
                  <li key={file.path}>
                    <button className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-xs hover:bg-secondary text-left group">
                      <div className="flex items-center gap-2 truncate">
                        {file.status === "added" ? (
                          <FilePlus className="size-3.5 text-emerald-500 shrink-0" />
                        ) : (
                          <FileCode className="size-3.5 text-muted-foreground shrink-0" />
                        )}
                        <span className="truncate group-hover:text-foreground transition-colors text-muted-foreground">
                          {file.path.split("/").pop()}
                        </span>
                      </div>
                      <div className="flex gap-1.5 shrink-0 ml-2">
                        {file.additions > 0 && <span className="text-emerald-500">+{file.additions}</span>}
                        {file.deletions > 0 && <span className="text-rose-500">-{file.deletions}</span>}
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>

        {/* Center Column: Diff Viewer */}
        <div className="flex-1 flex flex-col bg-background min-w-0 border-r">
          <div className="flex items-center h-10 border-b px-4 shrink-0 bg-sidebar/50">
            <h2 className="text-sm font-medium">Diff Preview</h2>
            <div className="ml-auto flex gap-2">
              <Badge variant="secondary" className="font-normal text-muted-foreground border-transparent">
                Viewing 2 of 5 files
              </Badge>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto bg-[#0d0d12]">
            {/* Diff 1 */}
            <DiffViewer diff={MOCK_DIFF} />
            {/* Diff 2 */}
            <DiffViewer diff={MOCK_HEADER_DIFF} />
          </div>
        </div>

        {/* Right Column: Review Metrics */}
        <aside className="w-[320px] shrink-0 flex flex-col bg-sidebar/30 overflow-y-auto">
          <div className="p-5 border-b">
            <h2 className="text-base font-semibold mb-4">AI Review Summary</h2>
            <Panel variant="interactive" className="p-4 border-emerald-500/20 bg-emerald-500/5">
              <div className="flex justify-between items-end mb-2">
                <span className="text-sm font-medium text-emerald-500">Merge Probability</span>
                <span className="text-3xl font-bold text-emerald-500">{MOCK_REVIEW.mergeProbability}%</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {MOCK_REVIEW.summary}
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
                    <span className="text-xs text-muted-foreground truncate">{issue.file}:{issue.line}</span>
                  </div>
                  <p className="text-xs leading-relaxed">
                    {issue.message}
                  </p>
                </Panel>
              ))}
            </div>
          </div>
        </aside>

      </main>
    </div>
  );
}

function DiffViewer({ diff }: { diff: FileDiff }) {
  return (
    <div className="mb-6">
      <div className="sticky top-0 flex items-center h-10 px-4 bg-[#12131a] border-b border-border/50 text-sm font-mono text-muted-foreground shadow-sm">
        {diff.path}
      </div>
      <div className="font-mono text-[13px] leading-relaxed tracking-tight py-2 select-text">
        {diff.hunks.map((hunk, hIdx) => (
          <div key={hIdx}>
            <div className="px-4 py-1 text-[#6b7280] bg-[#12131a]/50 select-none">
              {hunk.header}
            </div>
            {hunk.lines.map((line, lIdx) => (
              <div
                key={lIdx}
                className={cn(
                  "flex hover:bg-white/[0.02]",
                  line.type === "add" && "bg-emerald-500/10 hover:bg-emerald-500/[0.15]",
                  line.type === "remove" && "bg-rose-500/10 hover:bg-rose-500/[0.15]"
                )}
              >
                <div className="w-12 shrink-0 text-right pr-3 text-[#6b7280] select-none border-r border-border/50 bg-[#12131a]/30">
                  {line.lineOld || ""}
                </div>
                <div className="w-12 shrink-0 text-right pr-3 text-[#6b7280] select-none border-r border-border/50 bg-[#12131a]/30">
                  {line.lineNew || ""}
                </div>
                <div className="w-6 shrink-0 text-center select-none">
                  {line.type === "add" && <span className="text-emerald-500">+</span>}
                  {line.type === "remove" && <span className="text-rose-500">-</span>}
                </div>
                <div className={cn(
                  "flex-1 whitespace-pre pl-2",
                  line.type === "add" && "text-emerald-300",
                  line.type === "remove" && "text-rose-300",
                  line.type === "context" && "text-[#e4e4e8]"
                )}>
                  {line.content}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
