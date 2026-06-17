"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Activity, GitPullRequest, LayoutPanelLeft, Columns, Rows, Menu } from "lucide-react";
import { PanelGroup, Panel, PanelResizeHandle } from "react-resizable-panels";
import { BRAND } from "@/constants/brand";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { PRMetadata } from "@/data/mock-review";
import { MOCK_DIFF, MOCK_HEADER_DIFF } from "@/data/mock-diff";
import type { FileDiff } from "@/data/mock-diff";

import { Sidebar } from "@/components/prism/layout/sidebar";
import { MetricsPanel } from "@/components/prism/layout/metrics-panel";
import { DiffViewer } from "@/components/prism/diff/diff-viewer";
import { TerminalAnalyzer } from "@/components/prism/analyzer/terminal-analyzer";
import { CommandPalette } from "@/components/prism/layout/command-palette";
import { MobileDrawer } from "@/components/prism/layout/mobile-drawer";
import { BlueprintCrosshair } from "@/components/prism/blueprint-crosshair";
import { SplashScreen } from "@/components/prism/splash-screen";
import { useMediaQuery } from "@/hooks/use-media-query";
import { analyzeDiffs } from "@/lib/analyzer/scoring";
import type { ReviewResult } from "@/lib/analyzer/types";

// Demo PR metadata for the "Try Demo" button
const DEMO_PR: PRMetadata = {
  number: 31336,
  title: "Add utility APIs for HPKE suite introspection",
  repo: "openssl/openssl",
  author: "Zish19",
  authorAvatar: "https://avatars.githubusercontent.com/u/1?v=4",
  baseBranch: "master",
  headBranch: "hpke-suite-utils",
  status: "open",
  filesChanged: 5,
  additions: 287,
  deletions: 12,
  commits: 3,
  createdAt: "2025-06-14",
  files: [
    { name: "crypto/hpke/hpke_util.c", additions: 184, deletions: 0 },
    { name: "include/openssl/hpke.h", additions: 28, deletions: 4 },
  ],
};

type AnalyzerState = "idle" | "analyzing" | "done";

export default function AppHome() {
  const [showSplash, setShowSplash] = useState(true);

  // PR data state — starts null (no PR loaded)
  const [prData, setPrData] = useState<PRMetadata | null>(null);
  const [diffs, setDiffs] = useState<FileDiff[]>([]);
  const [prUrl, setPrUrl] = useState("");
  const [analyzerState, setAnalyzerState] = useState<AnalyzerState>("idle");
  const [diffMode, setDiffMode] = useState<"unified" | "split">("unified");
  
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const isLargeDesktop = useMediaQuery("(min-width: 1024px)");
  
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [metricsOpen, setMetricsOpen] = useState(false);
  
  const [reviewResult, setReviewResult] = useState<ReviewResult | null>(null);

  const handleAnalyze = useCallback(() => {
    if (analyzerState === "analyzing") return;
    if (!prUrl.trim()) return;
    setAnalyzerState("analyzing");
  }, [analyzerState, prUrl]);

  // Demo mode: load hardcoded mock data
  const handleTryDemo = useCallback(() => {
    setPrUrl("https://github.com/openssl/openssl/pull/31336");
    setPrData(DEMO_PR);
    setDiffs([MOCK_DIFF, MOCK_HEADER_DIFF]);
    
    // Run the analyzer on demo data
    const result = analyzeDiffs([MOCK_DIFF, MOCK_HEADER_DIFF]);
    setReviewResult(result);
    setAnalyzerState("done");
  }, []);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "b" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setSidebarOpen((open) => !open);
      }
      if (e.key === "d" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setDiffMode((m) => (m === "unified" ? "split" : "unified"));
      }
      if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        handleAnalyze();
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [analyzerState, handleAnalyze]);

  // Called by TerminalAnalyzer when the API fetch + animation completes
  const handleAnalysisComplete = useCallback((data: { pr: PRMetadata; diffs: FileDiff[] } | null) => {
    if (!data) {
      // Error occurred — stay in idle state
      setAnalyzerState("idle");
      return;
    }
    
    // Store the fetched PR metadata and diffs
    setPrData(data.pr);
    setDiffs(data.diffs);
    
    // Run the deterministic rule engine on the real diff data
    const result = analyzeDiffs(data.diffs);
    setReviewResult(result);
    setAnalyzerState("done");
  }, []);

  const showMetrics = isLargeDesktop && analyzerState === "done" && reviewResult !== null;
  const centerSize = sidebarOpen 
    ? (showMetrics ? 55 : 78) 
    : (showMetrics ? 77 : 100);

  // Display data
  const displayPr = prData;
  const displayAuthor = displayPr?.author || "User";
  const displayAvatar = displayPr?.authorAvatar || "https://avatars.githubusercontent.com/u/1?v=4";
  const displayRepo = displayPr?.repo || "—";
  const displayNumber = displayPr?.number || 0;

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  return (
    <div className="flex h-dvh flex-col bg-[#0a0b0f] text-foreground overflow-hidden font-sans selection:bg-primary/30">
      
      {/* Top Navigation - Brutalist / mod.construction style */}
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-border/50 px-4 z-10 bg-[#0a0b0f] relative rounded-none">
        <BlueprintCrosshair className="-bottom-1.5 left-[20vw] opacity-50" />
        <BlueprintCrosshair className="-bottom-1.5 right-[20vw] opacity-50" />
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-none bg-primary text-primary-foreground shadow-none">
              <Activity className="size-4" />
            </div>
            <span className="font-mono tracking-widest uppercase hidden sm:inline-block font-bold">{BRAND.shortName}</span>
          </div>
          <div className="h-4 w-px bg-border/50 hidden sm:block" />
          <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground uppercase tracking-wider">
            <GitPullRequest className="size-3.5" />
            <span className="hidden sm:inline-block">{displayRepo}</span>
            {displayNumber > 0 && (
              <>
                <span className="text-border hidden sm:inline-block">/</span>
                <span className="text-foreground font-medium">#{displayNumber}</span>
              </>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex text-[10px] font-mono uppercase tracking-widest text-muted-foreground bg-[#12131a] px-2 py-1 border border-border/50 rounded-none">
            CMD <kbd className="font-mono mx-1 font-bold text-foreground">CTRL+K</kbd>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className={`h-8 hidden md:flex rounded-none border-border/50 text-xs font-mono uppercase tracking-wider transition-colors ${
              sidebarOpen 
                ? "bg-white text-black hover:bg-white/90" 
                : "bg-[#12131a] text-muted-foreground hover:text-foreground"
            }`} 
            onClick={() => setSidebarOpen(!sidebarOpen)} 
            title="Toggle Sidebar (Ctrl+B)"
          >
            <LayoutPanelLeft className="size-3.5 mr-2" />
            Sidebar
          </Button>
          
          {/* Mobile Drawer Toggles */}
          {!isDesktop && (
            <Button variant="outline" size="sm" className="h-8 rounded-none border-border/50 bg-[#12131a]" onClick={() => setSidebarOpen(true)}>
              <Menu className="size-4" />
            </Button>
          )}
          {!isLargeDesktop && analyzerState === "done" && (
            <Button variant="outline" size="sm" className="h-8 rounded-none border-border/50 bg-[#12131a] text-emerald-500" onClick={() => setMetricsOpen(true)}>
              <Activity className="size-4" />
            </Button>
          )}

          <div className="h-6 w-px bg-border/50 hidden sm:block" />
          <div className="flex items-center gap-2 text-xs font-mono">
            <div className="relative size-6 overflow-hidden bg-secondary rounded-none border border-border/50 grayscale hover:grayscale-0 transition-all">
              <Image src={displayAvatar} alt={displayAuthor} fill className="object-cover" />
            </div>
            <span className="text-muted-foreground hidden sm:inline-block uppercase tracking-wider">{displayAuthor}</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden relative flex">
        
        {/* Terminal Overlay */}
        {analyzerState === "analyzing" && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-[#0a0b0f]/90 backdrop-blur-md p-4">
            {/* Grid overlay for technical feel */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
            <TerminalAnalyzer prUrl={prUrl} onComplete={handleAnalysisComplete} />
          </div>
        )}

        <PanelGroup direction="horizontal" autoSaveId="prism-layout">
          
          {/* Left Sidebar (Desktop) */}
          {isDesktop && sidebarOpen && (
            <>
              <Panel id="sidebar" order={1} defaultSize={22} minSize={15} maxSize={40} className="relative bg-[#0a0b0f]">
                <Sidebar pr={displayPr} prUrl={prUrl} onPrUrlChange={setPrUrl} onAnalyze={handleAnalyze} onTryDemo={handleTryDemo} />
              </Panel>
              <PanelResizeHandle className="w-[1px] bg-border hover:bg-primary/50 transition-colors cursor-col-resize relative flex flex-col justify-center items-center">
                <BlueprintCrosshair className="opacity-50 top-10" />
                <BlueprintCrosshair className="opacity-50 bottom-10" />
              </PanelResizeHandle>
            </>
          )}

          {/* Center Diff Viewer */}
          <Panel id="diff-viewer" order={2} defaultSize={centerSize} minSize={30} className="relative z-0">
            <div className="flex-1 flex flex-col h-full bg-[#0a0b0f] min-w-0">
              <div className="flex items-center h-10 border-b border-border/50 px-4 shrink-0 bg-[#0d0d12] justify-between">
                <div className="flex items-center gap-3">
                  <h2 className="text-[10px] font-mono tracking-widest uppercase text-foreground">Diff Preview</h2>
                  {diffs.length > 0 && (
                    <Badge variant="outline" className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground border-border/50 rounded-none hidden sm:inline-flex bg-[#12131a]">
                      Viewing {diffs.length} file{diffs.length !== 1 ? "s" : ""}
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center gap-1 bg-[#12131a] rounded-none p-0.5 border border-border/50">
                  <button 
                    onClick={() => setDiffMode("unified")}
                    className={`p-1 flex items-center justify-center transition-colors ${diffMode === "unified" ? "bg-white text-black" : "text-muted-foreground hover:text-foreground"}`}
                    title="Unified View (Ctrl+D)"
                  >
                    <Rows className="size-3.5" />
                  </button>
                  <button 
                    onClick={() => setDiffMode("split")}
                    className={`p-1 flex items-center justify-center transition-colors ${diffMode === "split" ? "bg-white text-black" : "text-muted-foreground hover:text-foreground"}`}
                    title="Split View (Ctrl+D)"
                  >
                    <Columns className="size-3.5" />
                  </button>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto bg-[#0a0b0f]">
                {diffs.length > 0 ? (
                  diffs.map((diff, idx) => (
                    <DiffViewer key={`${diff.path}-${idx}`} diff={diff} mode={diffMode} />
                  ))
                ) : (
                  /* Empty state — no diff loaded */
                  <div className="flex flex-col items-center justify-center h-full text-center space-y-6 px-8">
                    <div className="relative">
                      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
                      
                      {/* Center icon */}
                      <div className="size-20 border border-border/30 flex items-center justify-center bg-[#12131a] relative">
                        <GitPullRequest className="size-8 text-muted-foreground/20" />
                        <div className="absolute -top-1 -left-1 w-2 h-2 border-t border-l border-primary/30" />
                        <div className="absolute -top-1 -right-1 w-2 h-2 border-t border-r border-primary/30" />
                        <div className="absolute -bottom-1 -left-1 w-2 h-2 border-b border-l border-primary/30" />
                        <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b border-r border-primary/30" />
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <h3 className="text-[11px] font-mono uppercase tracking-[0.2em] text-muted-foreground">
                        Ready to Analyze
                      </h3>
                      <p className="text-[10px] font-mono text-muted-foreground/50 max-w-[320px] leading-relaxed mx-auto">
                        Paste any public GitHub pull request URL in the sidebar
                        and press <kbd className="text-foreground font-bold">Ctrl+Enter</kbd> to begin analysis.
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-3 pt-4">
                      <div className="h-px w-12 bg-border/20" />
                      <span className="text-[9px] font-mono uppercase tracking-widest text-muted-foreground/30">or</span>
                      <div className="h-px w-12 bg-border/20" />
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-none font-mono uppercase tracking-wider text-[10px] border-border/50 bg-[#12131a] hover:bg-primary hover:text-primary-foreground transition-colors h-9 px-6"
                      onClick={handleTryDemo}
                    >
                      Load Demo PR
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </Panel>

          {/* Right Metrics Panel (Desktop) */}
          {showMetrics && reviewResult && (
            <>
              <PanelResizeHandle className="w-[1px] bg-border hover:bg-primary/50 transition-colors cursor-col-resize relative flex flex-col justify-center items-center">
                <BlueprintCrosshair className="opacity-50 top-20" />
                <BlueprintCrosshair className="opacity-50 bottom-20" />
              </PanelResizeHandle>
              <Panel id="metrics" order={3} defaultSize={23} minSize={20} maxSize={35} className="relative z-10 bg-[#0a0b0f]">
                <MetricsPanel review={reviewResult} />
              </Panel>
            </>
          )}
        </PanelGroup>

        {/* Mobile Drawers */}
        <MobileDrawer open={sidebarOpen && !isDesktop} onOpenChange={setSidebarOpen} direction="left">
          <Sidebar pr={displayPr} prUrl={prUrl} onPrUrlChange={setPrUrl} onAnalyze={handleAnalyze} onTryDemo={handleTryDemo} />
        </MobileDrawer>

        {reviewResult && (
          <MobileDrawer open={metricsOpen && !isLargeDesktop} onOpenChange={setMetricsOpen} direction="right">
            <MetricsPanel review={reviewResult} />
          </MobileDrawer>
        )}

        <CommandPalette 
          onAnalyze={handleAnalyze} 
          onToggleDiff={() => setDiffMode((m) => (m === "unified" ? "split" : "unified"))}
          onToggleSidebar={() => setSidebarOpen((o) => !o)}
        />
      </main>
    </div>
  );
}
