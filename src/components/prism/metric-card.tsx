"use client";

import { motion } from "motion/react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  subtitle?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  accentColor?: "blue" | "success" | "warning" | "danger" | "muted";
  delay?: number;
  className?: string;
}

const accentClasses = {
  blue: "text-[var(--prism-blue)]",
  success: "text-[var(--prism-success)]",
  warning: "text-[var(--prism-warning)]",
  danger: "text-[var(--prism-danger)]",
  muted: "text-muted-foreground",
} as const;

export function MetricCard({
  icon: Icon,
  label,
  value,
  accentColor = "blue",
  delay = 0,
  className,
}: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.99 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.4,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={className}
    >
      <div className="bg-[#0d0d12] p-4 flex flex-col justify-between min-h-[90px] border-b border-r border-transparent hover:border-border/50 hover:bg-[#12131a] transition-all relative overflow-hidden group rounded-none">
        <div className="flex justify-between items-start">
          <Icon
            className={cn("size-4 opacity-70", accentClasses[accentColor])}
          />
          <span
            className={cn(
              "text-xl font-mono font-bold tracking-tighter",
              accentClasses[accentColor]
            )}
          >
            {value}
          </span>
        </div>
        <span className="text-[9px] font-mono uppercase tracking-widest text-muted-foreground group-hover:text-foreground transition-colors mt-4">
          {label}
        </span>
      </div>
    </motion.div>
  );
}
