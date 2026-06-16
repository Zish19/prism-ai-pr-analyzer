"use client";

import { motion } from "motion/react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { GlassPanel } from "@/components/prism/glass-panel";

interface MetricCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  subtitle?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  accentColor?: "purple" | "cyan" | "success" | "warning" | "danger";
  delay?: number;
  className?: string;
}

const accentMap = {
  purple: "text-[var(--prism-purple)]",
  cyan: "text-[var(--prism-cyan)]",
  success: "text-[var(--prism-success)]",
  warning: "text-[var(--prism-warning)]",
  danger: "text-[var(--prism-danger)]",
} as const;

const accentBgMap = {
  purple: "bg-[var(--prism-purple)]/10",
  cyan: "bg-[var(--prism-cyan)]/10",
  success: "bg-[var(--prism-success)]/10",
  warning: "bg-[var(--prism-warning)]/10",
  danger: "bg-[var(--prism-danger)]/10",
} as const;

const trendIcons = {
  up: "↑",
  down: "↓",
  neutral: "→",
} as const;

const trendColors = {
  up: "text-[var(--prism-success)]",
  down: "text-[var(--prism-danger)]",
  neutral: "text-muted-foreground",
} as const;

export function MetricCard({
  icon: Icon,
  label,
  value,
  subtitle,
  trend,
  trendValue,
  accentColor = "purple",
  delay = 0,
  className,
}: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.5,
        delay,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      }}
      className={className}
    >
      <GlassPanel
        variant="bordered"
        padding="default"
        animate={false}
        className="group hover:shadow-elevation-md hover:bg-white/[0.04] h-full"
      >
        <div className="flex items-start justify-between">
          <div
            className={cn(
              "flex size-10 items-center justify-center rounded-xl",
              accentBgMap[accentColor]
            )}
          >
            <Icon className={cn("size-5", accentMap[accentColor])} />
          </div>

          {trend && (
            <span
              className={cn(
                "flex items-center gap-0.5 text-xs font-medium",
                trendColors[trend]
              )}
            >
              {trendIcons[trend]}
              {trendValue && <span>{trendValue}</span>}
            </span>
          )}
        </div>

        <div className="mt-4 space-y-1">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold tracking-tight">{value}</p>
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
      </GlassPanel>
    </motion.div>
  );
}
