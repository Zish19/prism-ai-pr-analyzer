"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  accentLine?: boolean;
  align?: "left" | "center";
  delay?: number;
  className?: string;
}

export function SectionHeading({
  title,
  subtitle,
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
            "h-0.5 w-10 bg-primary/80 rounded-full",
            align === "center" && "mx-auto"
          )}
        />
      )}
      <h2
        className={cn(
          "text-xl font-semibold tracking-tight sm:text-2xl text-foreground"
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
