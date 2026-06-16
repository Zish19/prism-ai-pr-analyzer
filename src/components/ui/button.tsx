import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  [
    "group/button relative inline-flex shrink-0 items-center justify-center",
    "rounded-[0.625rem] text-sm font-medium whitespace-nowrap",
    "transition-all duration-200 ease-out outline-none select-none",
    "focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    "disabled:pointer-events-none disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  ].join(" "),
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-elevation-sm hover:bg-primary/85 active:scale-[0.98]",
        gradient:
          "bg-gradient-to-r from-[var(--prism-purple)] to-[var(--prism-cyan)] text-white shadow-glow hover:shadow-glow-purple active:scale-[0.98] hover:brightness-110",
        outline:
          "border border-border bg-transparent hover:bg-accent hover:text-accent-foreground active:scale-[0.98]",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 active:scale-[0.98]",
        ghost:
          "hover:bg-accent hover:text-accent-foreground",
        destructive:
          "bg-destructive/10 text-destructive hover:bg-destructive/20 active:scale-[0.98]",
        glass:
          "prism-glass hover:bg-white/[0.06] text-foreground active:scale-[0.98]",
        link: "text-primary underline-offset-4 hover:underline p-0 h-auto",
      },
      size: {
        sm: "h-8 gap-1.5 px-3 text-xs",
        default: "h-9 gap-2 px-4",
        lg: "h-11 gap-2.5 px-6 text-base",
        xl: "h-12 gap-3 px-8 text-base font-semibold",
        icon: "size-9",
        "icon-sm": "size-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
