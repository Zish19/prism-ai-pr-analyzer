"use client";

import { motion } from "motion/react";
import { useRef } from "react";

export function InteractiveToy() {
  const constraintsRef = useRef(null);

  return (
    <div 
      className="w-full h-48 border-t border-border/50 relative overflow-hidden flex items-center justify-center bg-background"
      ref={constraintsRef}
    >
      {/* Background Hint */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none opacity-50 select-none">
        <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.3em]">Playground Area</span>
        <span className="text-[9px] font-mono text-muted-foreground/50 uppercase tracking-widest mt-1">Drag the elements around</span>
      </div>

      {/* Physics Objects */}
      <motion.div
        drag
        dragConstraints={constraintsRef}
        dragElastic={0.2}
        dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileDrag={{ scale: 1.2, rotate: 15, cursor: "grabbing", zIndex: 50 }}
        className="w-16 h-16 bg-primary/10 border border-primary/50 flex items-center justify-center cursor-grab backdrop-blur-sm z-10 rounded-none absolute left-[20%] top-1/3"
      >
        <span className="text-primary font-mono text-xs font-bold select-none">&lt;div/&gt;</span>
      </motion.div>

      <motion.div
        drag
        dragConstraints={constraintsRef}
        dragElastic={0.2}
        dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
        whileHover={{ scale: 1.1, rotate: -10 }}
        whileDrag={{ scale: 1.2, rotate: -25, cursor: "grabbing", zIndex: 50 }}
        className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/50 flex items-center justify-center cursor-grab backdrop-blur-sm z-10 rounded-none absolute left-1/2 top-1/4"
      >
        <span className="text-emerald-500 font-mono text-xs font-bold select-none">{`{ }`}</span>
      </motion.div>

      <motion.div
        drag
        dragConstraints={constraintsRef}
        dragElastic={0.2}
        dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
        whileHover={{ scale: 1.1, rotate: 15 }}
        whileDrag={{ scale: 1.2, rotate: 30, cursor: "grabbing", zIndex: 50 }}
        className="w-14 h-14 bg-rose-500/10 border border-rose-500/50 flex items-center justify-center cursor-grab backdrop-blur-sm z-10 rounded-none absolute right-[20%] top-1/2"
      >
        <span className="text-rose-500 font-mono text-xs font-bold select-none">err</span>
      </motion.div>
    </div>
  );
}
