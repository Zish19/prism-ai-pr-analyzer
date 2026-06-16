"use client";

import { motion } from "motion/react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Panel } from "@/components/prism/panel";

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

const accentMap = {
  blue: "text-[var(--prism-blue)]",
  success: "text-[var(--prism-success)]",
  warning: "text-[var(--prism-warning)]",
  danger: "text-[var(--prism-danger)]",
  muted: "text-muted-foreground",
} as const;

const accentBgMap = {
  blue: "bg-[var(--prism-blue)]/10",
  success: "bg-[var(--prism-success)]/10",
  warning: "bg-[var(--prism-warning)]/10",
  danger: "bg-[var(--prism-danger)]/10",
  muted: "bg-muted",
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
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      }}
      className={className}
    >
      <Panel
        variant="interactive"
        padding="default"
        animate={false}
        className="group h-full flex flex-col"
      >
        <div className="flex items-start justify-between">
          <div
            className={cn(
              "flex size-9 items-center justify-center rounded-lg",
              accentBgMap[accentColor]
            )}
          >
            <Icon className={cn("size-4.5", accentMap[accentColor])} />
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
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="text-2xl font-semibold tracking-tight">{value}</p>
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
      </Panel>
    </motion.div>
  );
}
