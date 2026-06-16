"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Activity, GitPullRequest, LayoutPanelLeft, Columns, Rows } from "lucide-react";
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

type AnalyzerState = "idle" | "analyzing" | "done";

export default function AppHome() {
  const pr = MOCK_REVIEW.pr;
  const [prUrl, setPrUrl] = useState(`https://github.com/${pr.repo}/pull/${pr.number}`);
  const [analyzerState, setAnalyzerState] = useState<AnalyzerState>("idle");
  const [diffMode, setDiffMode] = useState<"unified" | "split">("unified");
  const [sidebarOpen, setSidebarOpen] = useState(true);

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
  }, []);

  const handleAnalyze = () => {
    if (analyzerState === "analyzing") return;
    setAnalyzerState("analyzing");
  };

  return (
    <div className="flex h-dvh flex-col bg-background text-foreground overflow-hidden">
      {/* Top Navigation */}
      <header className="flex h-14 shrink-0 items-center justify-between border-b px-4 z-10 bg-background relative">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Activity className="size-4" />
            </div>
            <span className="font-semibold tracking-tight hidden sm:inline-block">{BRAND.shortName}</span>
          </div>
          <div className="h-4 w-px bg-border hidden sm:block" />
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <GitPullRequest className="size-4" />
            <span className="hidden sm:inline-block">{pr.repo}</span>
            <span className="text-border hidden sm:inline-block">/</span>
            <span className="text-foreground font-medium">#{pr.number}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex text-xs text-muted-foreground bg-secondary px-2 py-1 rounded-md border border-border">
            Press <kbd className="font-mono mx-1">Ctrl+K</kbd> for commands
          </div>
          <Button variant="ghost" size="sm" className="h-8 hidden sm:flex" onClick={() => setSidebarOpen(!sidebarOpen)} title="Toggle Sidebar (Ctrl+B)">
            <LayoutPanelLeft className="size-4 mr-2" />
            Sidebar
          </Button>
          <div className="h-6 w-px bg-border hidden sm:block" />
          <div className="flex items-center gap-2 text-sm">
            <div className="relative size-6 overflow-hidden rounded-full bg-secondary">
              <Image src={pr.authorAvatar} alt={pr.author} fill className="object-cover" />
            </div>
            <span className="text-muted-foreground hidden sm:inline-block">{pr.author}</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden relative flex">
        
        {/* Terminal Overlay */}
        {analyzerState === "analyzing" && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
            <TerminalAnalyzer prUrl={prUrl} onComplete={() => setAnalyzerState("done")} />
          </div>
        )}

        <PanelGroup direction="horizontal" autoSaveId="prism-layout">
          
          {/* Left Sidebar */}
          {sidebarOpen && (
            <>
              <Panel defaultSize={22} minSize={15} maxSize={40} className="hidden md:block">
                <Sidebar pr={pr} prUrl={prUrl} onPrUrlChange={setPrUrl} onAnalyze={handleAnalyze} />
              </Panel>
              <PanelResizeHandle className="w-1 bg-border/50 hover:bg-primary/50 transition-colors hidden md:block cursor-col-resize" />
            </>
          )}

          {/* Center Diff Viewer */}
          <Panel defaultSize={sidebarOpen ? 55 : 77} minSize={30}>
            <div className="flex-1 flex flex-col h-full bg-background min-w-0">
              <div className="flex items-center h-10 border-b px-4 shrink-0 bg-sidebar/50 justify-between">
                <div className="flex items-center gap-3">
                  <h2 className="text-sm font-medium">Diff Preview</h2>
                  <Badge variant="secondary" className="font-normal text-muted-foreground border-transparent hidden sm:inline-flex">
                    Viewing 2 of 5 files
                  </Badge>
                </div>
                
                <div className="flex items-center gap-1 bg-secondary rounded-md p-0.5">
                  <button 
                    onClick={() => setDiffMode("unified")}
                    className={`p-1 rounded flex items-center justify-center ${diffMode === "unified" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                    title="Unified View (Ctrl+D)"
                  >
                    <Rows className="size-3.5" />
                  </button>
                  <button 
                    onClick={() => setDiffMode("split")}
                    className={`p-1 rounded flex items-center justify-center ${diffMode === "split" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                    title="Split View (Ctrl+D)"
                  >
                    <Columns className="size-3.5" />
                  </button>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto bg-[#0d0d12]">
                <DiffViewer diff={MOCK_DIFF} mode={diffMode} />
                <DiffViewer diff={MOCK_HEADER_DIFF} mode={diffMode} />
              </div>
            </div>
          </Panel>

          {/* Right Metrics Panel */}
          {analyzerState === "done" && (
            <>
              <PanelResizeHandle className="w-1 bg-border/50 hover:bg-primary/50 transition-colors hidden lg:block cursor-col-resize" />
              <Panel defaultSize={23} minSize={20} maxSize={35} className="hidden lg:block">
                <MetricsPanel review={MOCK_REVIEW} />
              </Panel>
            </>
          )}
        </PanelGroup>

        <CommandPalette 
          onAnalyze={handleAnalyze} 
          onToggleDiff={() => setDiffMode((m) => (m === "unified" ? "split" : "unified"))}
          onToggleSidebar={() => setSidebarOpen((o) => !o)}
        />
      </main>
    </div>
  );
}
