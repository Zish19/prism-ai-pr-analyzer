import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  [
    "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5",
    "text-xs font-medium transition-colors duration-200",
    "border",
  ].join(" "),
  {
    variants: {
      variant: {
        default: "bg-primary/10 text-primary border-primary/20",
        secondary: "bg-secondary text-secondary-foreground border-secondary",
        outline: "bg-transparent text-foreground border-border",
        success:
          "bg-[var(--prism-success)]/10 text-[var(--prism-success)] border-[var(--prism-success)]/20",
        warning:
          "bg-[var(--prism-warning)]/10 text-[var(--prism-warning)] border-[var(--prism-warning)]/20",
        danger:
          "bg-[var(--prism-danger)]/10 text-[var(--prism-danger)] border-[var(--prism-danger)]/20",
        /* Risk levels */
        "risk-low":
          "bg-[var(--prism-risk-low)]/10 text-[var(--prism-risk-low)] border-[var(--prism-risk-low)]/20",
        "risk-medium":
          "bg-[var(--prism-risk-medium)]/10 text-[var(--prism-risk-medium)] border-[var(--prism-risk-medium)]/20",
        "risk-high":
          "bg-[var(--prism-risk-high)]/10 text-[var(--prism-risk-high)] border-[var(--prism-risk-high)]/20",
        "risk-critical":
          "bg-[var(--prism-risk-critical)]/10 text-[var(--prism-risk-critical)] border-[var(--prism-risk-critical)]/20",
      },
      size: {
        sm: "px-2 py-px text-[0.6875rem]",
        default: "px-2.5 py-0.5 text-xs",
        lg: "px-3 py-1 text-sm",
      },
      glow: {
        true: "",
        false: "",
      },
    },
    compoundVariants: [
      { variant: "success", glow: true, class: "shadow-[0_0_8px_rgba(52,211,153,0.3)]" },
      { variant: "warning", glow: true, class: "shadow-[0_0_8px_rgba(251,191,36,0.3)]" },
      { variant: "danger", glow: true, class: "shadow-[0_0_8px_rgba(244,63,94,0.3)]" },
      { variant: "risk-critical", glow: true, class: "shadow-[0_0_8px_rgba(244,63,94,0.3)]" },
    ],
    defaultVariants: {
      variant: "default",
      size: "default",
      glow: false,
    },
  }
);

interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, glow, ...props }: BadgeProps) {
  return (
    <span
      data-slot="badge"
      className={cn(badgeVariants({ variant, size, glow, className }))}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
