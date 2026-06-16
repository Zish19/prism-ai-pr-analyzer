"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  gradient?: boolean;
  accentLine?: boolean;
  align?: "left" | "center";
  delay?: number;
  className?: string;
}

export function SectionHeading({
  title,
  subtitle,
  gradient = false,
  accentLine = true,
  align = "center",
  delay = 0,
  className,
}: SectionHeadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      }}
      className={cn(
        "space-y-3",
        align === "center" && "text-center",
        className
      )}
    >
      {accentLine && (
        <div
          className={cn(
            "h-px w-12 bg-gradient-to-r from-[var(--prism-purple)] to-[var(--prism-cyan)]",
            align === "center" && "mx-auto"
          )}
        />
      )}
      <h2
        className={cn(
          "text-2xl font-bold tracking-tight sm:text-3xl",
          gradient && "prism-gradient-text"
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p className="text-sm text-muted-foreground max-w-lg mx-auto">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
