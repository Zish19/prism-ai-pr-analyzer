"use client";

import { FileCode2, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { type PRMetadata } from "@/data/mock-review";

interface SidebarProps {
  pr: PRMetadata;
  prUrl: string;
  onPrUrlChange: (url: string) => void;
  onAnalyze: () => void;
}

export function Sidebar({ pr, prUrl, onPrUrlChange, onAnalyze }: SidebarProps) {
  return (
    <div className="flex h-full flex-col bg-[#0a0b0f] relative">
      <div className="p-4 border-b border-border/50 bg-[#0d0d12]">
        <form 
          onSubmit={(e) => { e.preventDefault(); onAnalyze(); }}
          className="flex gap-2"
        >
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 size-3.5 text-muted-foreground" />
            <input 
              value={prUrl}
              onChange={(e) => onPrUrlChange(e.target.value)}
              className="flex w-full px-3 py-1 shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 pl-8 bg-[#12131a] border border-border/50 text-xs font-mono rounded-none h-8 text-foreground"
            />
          </div>
          <Button type="submit" size="sm" className="h-8 rounded-none font-mono uppercase tracking-wider text-[10px]">
            Analyze
          </Button>
        </form>
        <p className="text-[9px] text-muted-foreground mt-2 font-mono uppercase tracking-widest text-center">
          Press <kbd className="font-bold text-foreground">Ctrl+Enter</kbd> to analyze
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <div>
          <h3 className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground mb-3">Repository</h3>
          <p className="font-mono text-xs font-bold">{pr.repo}</p>
        </div>

        <div>
          <h3 className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground mb-3">Pull Request</h3>
          <p className="font-semibold text-sm mb-3 leading-tight">{pr.title}</p>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-emerald-500 border-emerald-500/30 bg-emerald-500/10 rounded-none font-mono text-[10px] uppercase tracking-wider">
              {pr.status}
            </Badge>
            <span className="text-xs text-muted-foreground font-mono">{pr.commits} commits</span>
          </div>
          <div className="flex gap-3 mt-3 text-xs font-mono">
            <span className="text-emerald-500">+{pr.additions}</span>
            <span className="text-destructive">-{pr.deletions}</span>
          </div>
        </div>

        <div>
          <h3 className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground mb-3">Files Changed ({pr.files?.length || 5})</h3>
          <ul className="space-y-px">
            {(pr.files || [
              { name: "crypto/hpke/hpke_util.c", additions: 184, deletions: 0 },
              { name: "include/openssl/hpke.h", additions: 28, deletions: 4 }
            ]).map((file: { name: string; additions: number; deletions: number }) => (
              <li key={file.name} className="flex items-center justify-between text-xs p-1.5 hover:bg-[#12131a] rounded-none group cursor-pointer transition-colors border border-transparent hover:border-border/50">
                <div className="flex items-center gap-2 overflow-hidden">
                  <FileCode2 className="size-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                  <span className="truncate font-mono text-muted-foreground group-hover:text-foreground">{file.name}</span>
                </div>
                <div className="flex gap-2 ml-2 font-mono text-[10px] shrink-0">
                  {file.additions > 0 && <span className="text-emerald-500">+{file.additions}</span>}
                  {file.deletions > 0 && <span className="text-destructive">-{file.deletions}</span>}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
