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
          "bg-[var(--prism-success)]/10 text-[var(--prism-success)] border-[var(--prism-success)]/20",
        "risk-medium":
          "bg-[var(--prism-warning)]/10 text-[var(--prism-warning)] border-[var(--prism-warning)]/20",
        "risk-high":
          "bg-[var(--prism-danger)]/10 text-[var(--prism-danger)] border-[var(--prism-danger)]/20",
        "risk-critical":
          "bg-[var(--prism-danger)]/20 text-[var(--prism-danger)] border-[var(--prism-danger)]/40 font-semibold",
      },
      size: {
        sm: "px-2 py-px text-[0.6875rem]",
        default: "px-2.5 py-0.5 text-xs",
        lg: "px-3 py-1 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <span
      data-slot="badge"
      className={cn(badgeVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
