"use client";

import { useEffect, useState } from "react";
import { getHighlighter } from "@/lib/highlighter";
import { cn } from "@/lib/utils";
import type { FileDiff, DiffLine } from "@/data/mock-diff";
import type { ThemedToken } from "shiki";

interface DiffViewerProps {
  diff: FileDiff;
  mode: "unified" | "split";
}

export function DiffViewer({ diff, mode }: DiffViewerProps) {
  const [highlightedHunks, setHighlightedHunks] = useState<ThemedToken[][][]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function highlight() {
      const highlighter = await getHighlighter();
      
      const hunksTokens = diff.hunks.map(hunk => {
        // Just extract the raw code content to pass to Shiki
        const code = hunk.lines.map(l => l.content).join("\n");
        const tokens = highlighter.codeToTokensBase(code, {
          lang: diff.language === "c" ? "c" : "typescript",
          theme: "github-dark-dimmed"
        });
        return tokens;
      });
      
      setHighlightedHunks(hunksTokens);
      setIsLoading(false);
    }
    
    highlight();
  }, [diff]);

  if (isLoading) {
    return (
      <div className="mb-6 animate-pulse">
        <div className="flex items-center h-10 px-4 bg-[#12131a] border-b border-border/50 text-sm font-mono text-muted-foreground shadow-sm">
          {diff.path}
        </div>
        <div className="h-32 bg-[#12131a]/30 m-4 rounded"></div>
      </div>
    );
  }

  return (
    <div className="mb-6 group/file">
      <div className="sticky top-0 z-10 flex items-center h-10 px-4 bg-[#12131a] border-b border-border/50 text-sm font-mono text-muted-foreground shadow-sm transition-colors group-hover/file:bg-[#161720]">
        {diff.path}
      </div>
      <div className="font-mono text-[13px] leading-relaxed tracking-tight py-2 select-text overflow-x-auto">
        {diff.hunks.map((hunk, hIdx) => {
          const hunkTokens = highlightedHunks[hIdx];
          
          return (
            <div key={hIdx}>
              <div className="px-4 py-1 text-[#6b7280] bg-[#12131a]/50 select-none border-y border-border/20 text-xs">
                {hunk.header}
              </div>
              
              <div className={cn(
                "min-w-fit",
                mode === "split" && "w-full"
              )}>
                {hunk.lines.map((line, lIdx) => {
                  const lineTokens = hunkTokens?.[lIdx] || [{ content: line.content, color: "#e4e4e8" }];
                  
                  if (mode === "unified") {
                    return <UnifiedLine key={lIdx} line={line} tokens={lineTokens} />;
                  } else {
                    return <SplitLine key={lIdx} line={line} tokens={lineTokens} />;
                  }
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TokenRenderer({ tokens }: { tokens: ThemedToken[] }) {
  return (
    <>
      {tokens.map((token, i) => (
        <span key={i} style={{ color: token.color || "inherit" }}>
          {token.content}
        </span>
      ))}
    </>
  );
}

function UnifiedLine({ line, tokens }: { line: DiffLine, tokens: ThemedToken[] }) {
  return (
    <div
      className={cn(
        "flex min-w-max hover:bg-white/[0.04] transition-colors",
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
      <div className="flex-1 whitespace-pre pl-2 pr-4 min-w-[500px]">
        <TokenRenderer tokens={tokens} />
      </div>
    </div>
  );
}

function SplitLine({ line, tokens }: { line: DiffLine, tokens: ThemedToken[] }) {
  // For split view, we need to handle layout differently. 
  // Ideally, a true split view aligns added and removed lines side-by-side if they are changed.
  // For simplicity in this diff renderer given our mock data format, we just render it differently,
  // or we can implement a basic pseudo-split where context is across both, add is right, remove is left.
  
  const isAdd = line.type === "add";
  const isRemove = line.type === "remove";
  const isContext = line.type === "context";

  return (
    <div className="flex min-w-max hover:bg-white/[0.04] transition-colors">
      {/* LEFT SIDE (Old) */}
      <div className={cn(
        "flex w-1/2 min-w-[400px] border-r border-border/50",
        isRemove && "bg-rose-500/10 hover:bg-rose-500/[0.15]"
      )}>
        <div className="w-12 shrink-0 text-right pr-3 text-[#6b7280] select-none border-r border-border/50 bg-[#12131a]/30">
          {(isContext || isRemove) ? line.lineOld : ""}
        </div>
        <div className="w-6 shrink-0 text-center select-none">
          {isRemove && <span className="text-rose-500">-</span>}
        </div>
        <div className="flex-1 whitespace-pre pl-2 pr-4 overflow-hidden">
          {(isContext || isRemove) && <TokenRenderer tokens={tokens} />}
        </div>
      </div>
      
      {/* RIGHT SIDE (New) */}
      <div className={cn(
        "flex w-1/2 min-w-[400px]",
        isAdd && "bg-emerald-500/10 hover:bg-emerald-500/[0.15]"
      )}>
        <div className="w-12 shrink-0 text-right pr-3 text-[#6b7280] select-none border-r border-border/50 bg-[#12131a]/30">
          {(isContext || isAdd) ? line.lineNew : ""}
        </div>
        <div className="w-6 shrink-0 text-center select-none">
          {isAdd && <span className="text-emerald-500">+</span>}
        </div>
        <div className="flex-1 whitespace-pre pl-2 pr-4 overflow-hidden">
          {(isContext || isAdd) && <TokenRenderer tokens={tokens} />}
        </div>
      </div>
    </div>
  );
}
