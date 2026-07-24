import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500",
  {
    variants: {
      variant: {
        default:
          "border-indigo-500/30 bg-indigo-500/20 text-indigo-300",
        secondary:
          "border-[#333333] bg-[#222222] text-slate-300",
        outline: "border-[#3A3A3A] text-slate-300",
        cyan: "border-cyan-500/30 bg-cyan-500/20 text-cyan-300",
        amber: "border-amber-500/30 bg-amber-500/20 text-amber-300",
        emerald: "border-emerald-500/30 bg-emerald-500/20 text-emerald-300",
        destructive:
          "border-rose-500/30 bg-rose-500/20 text-rose-300",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  className?: string;
  children?: React.ReactNode;
}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
