"use client";

import { Drawer } from "vaul";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MobileDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  direction?: "left" | "right";
}

export function MobileDrawer({ open, onOpenChange, children, direction = "left" }: MobileDrawerProps) {
  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange} direction={direction}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" />
        <Drawer.Content 
          className={`fixed bottom-0 top-0 z-50 flex outline-none w-[85vw] max-w-[320px] bg-[#0a0b0f] border-border ${
            direction === "left" ? "left-0 border-r" : "right-0 border-l"
          }`}
        >
          <div className="flex flex-col w-full h-full relative">
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute top-2 right-2 z-50 rounded-none bg-background/50 backdrop-blur-md"
              onClick={() => onOpenChange(false)}
            >
              <X className="size-4" />
            </Button>
            <div className="flex-1 overflow-y-auto">
              {children}
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
