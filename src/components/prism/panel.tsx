"use client";

import { motion } from "motion/react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

const panelVariants = cva(
  [
    "relative overflow-hidden",
    "rounded-none",
    "prism-panel",
    "transition-all duration-200 ease-out",
  ].join(" "),
  {
    variants: {
      variant: {
        default: "",
        interactive: "prism-panel-hover",
        transparent: "bg-transparent border-transparent",
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

interface PanelProps extends VariantProps<typeof panelVariants> {
  children: ReactNode;
  animate?: boolean;
  className?: string;
}

const entrance = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: {
    duration: 0.3,
    ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
  },
} as const;

export function Panel({
  className,
  variant,
  padding,
  animate = true,
  children,
}: PanelProps) {
  if (!animate) {
    return (
      <div className={cn(panelVariants({ variant, padding, className }))}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      initial={entrance.initial}
      animate={entrance.animate}
      transition={entrance.transition}
      className={cn(panelVariants({ variant, padding, className }))}
    >
      {children}
    </motion.div>
  );
}
