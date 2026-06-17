"use client";

import { useEffect, useState } from "react";
import { Command } from "cmdk";
import { Activity, Columns, LayoutPanelLeft } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";

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

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-all" />
        <Dialog.Content 
          className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] outline-none"
        >
          <Command 
            className="w-full max-w-lg bg-background border border-border/50 rounded-none shadow-2xl overflow-hidden font-mono"
            label="Command Menu"
          >
            <Command.Input 
              placeholder="Type a command or search..." 
              className="w-full bg-card border-b border-border/50 px-4 py-4 text-xs outline-none placeholder:text-muted-foreground font-mono text-foreground uppercase tracking-widest"
              autoFocus
            />
            <Command.List className="max-h-[300px] overflow-y-auto p-2">
              <Command.Empty className="py-6 text-center text-[10px] uppercase tracking-widest text-muted-foreground font-mono">
                No results found.
              </Command.Empty>
              
              <Command.Group heading={<span className="text-[10px] font-mono tracking-widest uppercase text-muted-foreground px-2 py-2 block border-b border-border/30 mb-1">Actions</span>}>
                <Command.Item 
                  onSelect={() => { onAnalyze(); setOpen(false); }}
                  className="flex items-center px-2 py-3 text-[10px] uppercase tracking-widest rounded-none cursor-pointer data-[selected=true]:bg-card data-[selected=true]:text-emerald-500 font-mono transition-colors"
                >
                  <Activity className="mr-3 size-3.5" />
                  <span>Run Analysis</span>
                  <kbd className="ml-auto text-[9px] bg-secondary border border-border/50 px-1 py-0.5 uppercase">Ctrl+Enter</kbd>
                </Command.Item>
                <Command.Item 
                  onSelect={() => { onToggleDiff(); setOpen(false); }}
                  className="flex items-center px-2 py-3 text-[10px] uppercase tracking-widest rounded-none cursor-pointer data-[selected=true]:bg-card data-[selected=true]:text-foreground font-mono transition-colors"
                >
                  <Columns className="mr-3 size-3.5" />
                  <span>Toggle Diff Mode (Unified/Split)</span>
                  <kbd className="ml-auto text-[9px] bg-secondary border border-border/50 px-1 py-0.5 uppercase">Ctrl+D</kbd>
                </Command.Item>
                <Command.Item 
                  onSelect={() => { onToggleSidebar(); setOpen(false); }}
                  className="flex items-center px-2 py-3 text-[10px] uppercase tracking-widest rounded-none cursor-pointer data-[selected=true]:bg-card data-[selected=true]:text-foreground font-mono transition-colors"
                >
                  <LayoutPanelLeft className="mr-3 size-3.5" />
                  <span>Toggle Sidebar</span>
                  <kbd className="ml-auto text-[9px] bg-secondary border border-border/50 px-1 py-0.5 uppercase">Ctrl+B</kbd>
                </Command.Item>
              </Command.Group>
            </Command.List>
          </Command>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
