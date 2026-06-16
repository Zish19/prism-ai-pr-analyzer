"use client";

import { motion } from "motion/react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

const glassPanelVariants = cva(
  [
    "relative overflow-hidden",
    "rounded-[1.25rem]",
    "prism-glass",
    "transition-all duration-300 ease-out",
  ].join(" "),
  {
    variants: {
      variant: {
        default: "",
        bordered: "prism-gradient-border",
        strong: "prism-glass-strong",
        glow: "shadow-glow",
      },
      padding: {
        none: "p-0",
        sm: "p-4",
        default: "p-6",
        lg: "p-8",
        xl: "p-10",
      },
    },
    defaultVariants: {
      variant: "default",
      padding: "default",
    },
  }
);

interface GlassPanelProps extends VariantProps<typeof glassPanelVariants> {
  children: ReactNode;
  animate?: boolean;
  className?: string;
}

const entrance = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: {
    duration: 0.5,
    ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
  },
} as const;

export function GlassPanel({
  className,
  variant,
  padding,
  animate = true,
  children,
}: GlassPanelProps) {
  if (!animate) {
    return (
      <div className={cn(glassPanelVariants({ variant, padding, className }))}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      initial={entrance.initial}
      animate={entrance.animate}
      transition={entrance.transition}
      className={cn(glassPanelVariants({ variant, padding, className }))}
    >
      {children}
    </motion.div>
  );
}
