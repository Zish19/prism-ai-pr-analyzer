"use client";

import { FileCode, FilePlus, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { type PRMetadata } from "@/data/mock-review";
import type { FileDiff } from "@/data/mock-diff";
import { MOCK_FILES } from "@/data/mock-review";

interface SidebarProps {
  pr: PRMetadata;
  prUrl: string;
  onPrUrlChange: (url: string) => void;
  onAnalyze: () => void;
}

export function Sidebar({ pr, prUrl, onPrUrlChange, onAnalyze }: SidebarProps) {
  return (
    <div className="flex h-full flex-col bg-sidebar/30">
      <div className="p-4 border-b">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2 size-4 text-muted-foreground" />
            <input
              type="text"
              value={prUrl}
              onChange={(e) => onPrUrlChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                  onAnalyze();
                } else if (e.key === "Enter") {
                  onAnalyze();
                }
              }}
              placeholder="GitHub PR URL..."
              className="w-full h-8 rounded-md border bg-input/50 pl-8 pr-3 text-xs outline-none focus:ring-1 focus:ring-primary focus:bg-background transition-colors"
            />
          </div>
          <Button size="sm" className="h-8 px-3 text-xs" onClick={onAnalyze}>
            Analyze
          </Button>
        </div>
        <div className="mt-2 text-[10px] text-muted-foreground px-1">
          Press <kbd className="font-mono bg-muted px-1 rounded">Ctrl+Enter</kbd> to analyze
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        <div className="mb-4 px-1">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            Repository
          </h3>
          <p className="text-sm font-medium mb-1">{pr.repo}</p>
          
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mt-4 mb-2">
            Pull Request
          </h3>
          <p className="text-sm leading-snug mb-2">{pr.title}</p>
          
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-3 mt-3">
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

        <div className="px-1 mt-6">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
            Files Changed ({pr.filesChanged})
          </h3>
          <ul className="space-y-0.5">
            {MOCK_FILES.map((file) => (
              <li key={file.path}>
                <button className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-xs hover:bg-secondary text-left group transition-colors">
                  <div className="flex items-center gap-2 truncate pr-2">
                    {file.status === "added" ? (
                      <FilePlus className="size-3.5 text-emerald-500 shrink-0" />
                    ) : (
                      <FileCode className="size-3.5 text-muted-foreground shrink-0" />
                    )}
                    <span className="truncate group-hover:text-foreground transition-colors text-muted-foreground">
                      {file.path.split("/").pop()}
                    </span>
                  </div>
                  <div className="flex gap-1.5 shrink-0 ml-auto">
                    {file.additions > 0 && <span className="text-emerald-500">+{file.additions}</span>}
                    {file.deletions > 0 && <span className="text-rose-500">-{file.deletions}</span>}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
