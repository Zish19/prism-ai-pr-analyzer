"use client";

import { useEffect, useState } from "react";
import { Command } from "cmdk";
import { Search, Play, Columns, LayoutPanelLeft, Download } from "lucide-react";

interface CommandPaletteProps {
  onAnalyze: () => void;
  onToggleDiff: () => void;
  onToggleSidebar: () => void;
}

export function CommandPalette({ onAnalyze, onToggleDiff, onToggleSidebar }: CommandPaletteProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] bg-background/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-card border border-border shadow-2xl rounded-xl overflow-hidden animate-in zoom-in-95 duration-200">
        <Command
          className="w-full"
          loop
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setOpen(false);
            }
          }}
        >
          <div className="flex items-center border-b border-border px-4">
            <Search className="size-4 text-muted-foreground mr-2 shrink-0" />
            <Command.Input 
              autoFocus 
              className="flex h-12 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground" 
              placeholder="Type a command or search..." 
            />
          </div>

          <Command.List className="max-h-[300px] overflow-y-auto p-2">
            <Command.Empty className="py-6 text-center text-sm text-muted-foreground">
              No results found.
            </Command.Empty>

            <Command.Group heading="Actions" className="px-2 text-xs font-medium text-muted-foreground mb-2 mt-2">
              <Command.Item 
                onSelect={() => { onAnalyze(); setOpen(false); }}
                className="flex items-center gap-2 px-2 py-2.5 rounded-md cursor-pointer text-sm text-foreground hover:bg-secondary aria-selected:bg-secondary transition-colors"
              >
                <Play className="size-4 text-primary" />
                Analyze Pull Request
                <div className="ml-auto flex gap-1">
                  <kbd className="bg-background border border-border rounded px-1.5 font-mono text-[10px]">Ctrl</kbd>
                  <kbd className="bg-background border border-border rounded px-1.5 font-mono text-[10px]">Enter</kbd>
                </div>
              </Command.Item>
            </Command.Group>

            <Command.Group heading="View" className="px-2 text-xs font-medium text-muted-foreground mb-2 mt-2">
              <Command.Item 
                onSelect={() => { onToggleDiff(); setOpen(false); }}
                className="flex items-center gap-2 px-2 py-2.5 rounded-md cursor-pointer text-sm text-foreground hover:bg-secondary aria-selected:bg-secondary transition-colors"
              >
                <Columns className="size-4 text-muted-foreground" />
                Toggle Diff Mode (Unified/Split)
                <div className="ml-auto flex gap-1">
                  <kbd className="bg-background border border-border rounded px-1.5 font-mono text-[10px]">Ctrl</kbd>
                  <kbd className="bg-background border border-border rounded px-1.5 font-mono text-[10px]">D</kbd>
                </div>
              </Command.Item>
              <Command.Item 
                onSelect={() => { onToggleSidebar(); setOpen(false); }}
                className="flex items-center gap-2 px-2 py-2.5 rounded-md cursor-pointer text-sm text-foreground hover:bg-secondary aria-selected:bg-secondary transition-colors"
              >
                <LayoutPanelLeft className="size-4 text-muted-foreground" />
                Toggle Sidebar
                <div className="ml-auto flex gap-1">
                  <kbd className="bg-background border border-border rounded px-1.5 font-mono text-[10px]">Ctrl</kbd>
                  <kbd className="bg-background border border-border rounded px-1.5 font-mono text-[10px]">B</kbd>
                </div>
              </Command.Item>
            </Command.Group>

            <Command.Group heading="Export" className="px-2 text-xs font-medium text-muted-foreground mb-2 mt-2">
              <Command.Item 
                onSelect={() => { setOpen(false); alert("Exporting report..."); }}
                className="flex items-center gap-2 px-2 py-2.5 rounded-md cursor-pointer text-sm text-foreground hover:bg-secondary aria-selected:bg-secondary transition-colors"
              >
                <Download className="size-4 text-emerald-500" />
                Export Review Report
              </Command.Item>
            </Command.Group>

          </Command.List>
        </Command>
      </div>
    </div>
  );
}
