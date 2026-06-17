"use client";

import { motion } from "motion/react";
import { useRef } from "react";

const toys = [
  { id: 1, content: "🍎", size: "w-16 h-16", color: "bg-rose-500/10 border-rose-500/30", radius: "rounded-full", startPos: "left-[10%] top-1/4" },
  { id: 2, content: "🥑", size: "w-20 h-20", color: "bg-emerald-500/10 border-emerald-500/30", radius: "rounded-[40%_60%_70%_30%/40%_50%_60%_50%]", startPos: "left-[25%] top-1/2" },
  { id: 3, content: "🚀", size: "w-16 h-16", color: "bg-blue-500/10 border-blue-500/30", radius: "rounded-full", startPos: "left-[40%] top-1/3" },
  { id: 4, content: "🥎", size: "w-14 h-14", color: "bg-lime-500/10 border-lime-500/30", radius: "rounded-full", startPos: "left-[55%] top-1/2" },
  { id: 5, content: "🍔", size: "w-24 h-24", color: "bg-amber-500/10 border-amber-500/30", radius: "rounded-[30%_70%_70%_30%/30%_30%_70%_70%]", startPos: "right-[25%] top-1/4" },
  { id: 6, content: "🎸", size: "w-16 h-16", color: "bg-purple-500/10 border-purple-500/30", radius: "rounded-[50%_50%_30%_70%/50%_50%_70%_30%]", startPos: "right-[15%] top-1/2" },
  { id: 7, content: "🧸", size: "w-20 h-20", color: "bg-orange-500/10 border-orange-500/30", radius: "rounded-[60%_40%_30%_70%/60%_30%_70%_40%]", startPos: "right-[5%] top-1/3" },
];

export function InteractiveToy() {
  const constraintsRef = useRef(null);

  return (
    <div 
      className="w-full h-64 border-t border-border/50 relative overflow-hidden flex items-center justify-center bg-background"
      ref={constraintsRef}
    >
      {/* Background Hint */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none opacity-50 select-none">
        <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.3em]">Playground Area</span>
        <span className="text-[9px] font-mono text-muted-foreground/50 uppercase tracking-widest mt-1">Throw the toys around</span>
      </div>

      {/* Physics Objects */}
      {toys.map((toy) => (
        <motion.div
          key={toy.id}
          drag
          dragConstraints={constraintsRef}
          dragElastic={0.4}
          dragTransition={{ bounceStiffness: 400, bounceDamping: 10 }}
          whileHover={{ scale: 1.15, rotate: Math.random() * 20 - 10 }}
          whileDrag={{ scale: 1.25, rotate: Math.random() * 40 - 20, cursor: "grabbing", zIndex: 50 }}
          className={`absolute flex items-center justify-center cursor-grab backdrop-blur-md z-10 border-2 shadow-xl ${toy.size} ${toy.color} ${toy.radius} ${toy.startPos}`}
        >
          <span className="text-3xl select-none drop-shadow-md">{toy.content}</span>
        </motion.div>
      ))}
    </div>
  );
}
