"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Activity, GitPullRequest, LayoutPanelLeft, Columns, Rows, Menu } from "lucide-react";
import { PanelGroup, Panel, PanelResizeHandle } from "react-resizable-panels";
import { BRAND } from "@/constants/brand";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MOCK_REVIEW } from "@/data/mock-review";
import { MOCK_DIFF, MOCK_HEADER_DIFF } from "@/data/mock-diff";

import { Sidebar } from "@/components/prism/layout/sidebar";
import { MetricsPanel } from "@/components/prism/layout/metrics-panel";
import { DiffViewer } from "@/components/prism/diff/diff-viewer";
import { TerminalAnalyzer } from "@/components/prism/analyzer/terminal-analyzer";
import { CommandPalette } from "@/components/prism/layout/command-palette";
import { MobileDrawer } from "@/components/prism/layout/mobile-drawer";
import { BlueprintCrosshair } from "@/components/prism/blueprint-crosshair";
import { useMediaQuery } from "@/hooks/use-media-query";
import { analyzeDiffs } from "@/lib/analyzer/scoring";
import type { ReviewResult } from "@/lib/analyzer/types";

type AnalyzerState = "idle" | "analyzing" | "done";

export default function AppHome() {
  const pr = MOCK_REVIEW.pr;
  const [prUrl, setPrUrl] = useState(`https://github.com/${pr.repo}/pull/${pr.number}`);
  const [analyzerState, setAnalyzerState] = useState<AnalyzerState>("idle");
  const [diffMode, setDiffMode] = useState<"unified" | "split">("unified");
  
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const isLargeDesktop = useMediaQuery("(min-width: 1024px)");
  
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [metricsOpen, setMetricsOpen] = useState(false);
  
  const [reviewResult, setReviewResult] = useState<ReviewResult | null>(null);

  const handleAnalyze = useCallback(() => {
    if (analyzerState === "analyzing") return;
    setAnalyzerState("analyzing");
  }, [analyzerState]);

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

  const handleAnalysisComplete = () => {
    // Run the actual deterministic rule engine on the diff data
    const result = analyzeDiffs([MOCK_DIFF, MOCK_HEADER_DIFF]);
    setReviewResult(result);
    setAnalyzerState("done");
  };

  const showMetrics = isLargeDesktop && analyzerState === "done" && reviewResult !== null;
  const centerSize = sidebarOpen 
    ? (showMetrics ? 55 : 78) 
    : (showMetrics ? 77 : 100);

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
            <span className="hidden sm:inline-block">{pr.repo}</span>
            <span className="text-border hidden sm:inline-block">/</span>
            <span className="text-foreground font-medium">#{pr.number}</span>
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
              <Image src={pr.authorAvatar} alt={pr.author} fill className="object-cover" />
            </div>
            <span className="text-muted-foreground hidden sm:inline-block uppercase tracking-wider">{pr.author}</span>
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
                <Sidebar pr={pr} prUrl={prUrl} onPrUrlChange={setPrUrl} onAnalyze={handleAnalyze} />
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
                  <Badge variant="outline" className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground border-border/50 rounded-none hidden sm:inline-flex bg-[#12131a]">
                    Viewing 2 files
                  </Badge>
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
                <DiffViewer diff={MOCK_DIFF} mode={diffMode} />
                <DiffViewer diff={MOCK_HEADER_DIFF} mode={diffMode} />
              </div>
            </div>
          </Panel>

          {/* Right Metrics Panel (Desktop) */}
          {showMetrics && (
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
          <Sidebar pr={pr} prUrl={prUrl} onPrUrlChange={setPrUrl} onAnalyze={handleAnalyze} />
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
