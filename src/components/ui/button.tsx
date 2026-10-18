import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-input font-semibold transition-colors duration-150 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-orange-500 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50 min-h-[44px]",
  {
    variants: {
      variant: {
        // UI_SPEC 1.1: Orange filled buttons use navy text (#0F172A, ~6.4:1), semibold
        primary: "bg-orange-500 text-navy-900 hover:bg-orange-600 active:bg-orange-700 active:text-white shadow-sm",
        secondary: "bg-navy-900 text-white hover:bg-navy-800 shadow-sm",
        outline: "border border-slate-200 bg-white text-navy-900 hover:bg-slate-50",
        ghost: "text-navy-900 hover:bg-slate-100",
        destructive: "bg-danger text-white hover:bg-red-700 shadow-sm",
      },
      size: {
        sm: "h-10 px-4 text-sm",
        md: "h-12 px-5 text-base",
        lg: "h-14 px-6 text-base",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading = false, disabled, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <span className="inline-flex items-center justify-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
            <span>{children}</span>
          </span>
        ) : (
          children
        )}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
