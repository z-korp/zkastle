import * as React from "react";
import { Slot, Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import useSound from "use-sound";
import hover from "/sounds/effects/hover.wav";
import click from "/sounds/effects/click.wav";

import { cn } from "@/ui/utils";
import { useMusicPlayer } from "@/contexts/music";
import { LucideLoader } from "lucide-react";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "min-h-9 min-w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      isLoading = false,
      className,
      variant,
      size,
      asChild = false,
      children,
      ...props
    },
    ref,
  ) => {
    const { volume } = useMusicPlayer();
    const Comp = asChild ? Slot : "button";
    const [playHover] = useSound(hover, { volume });
    const [playClick] = useSound(click, { volume: volume * 3 });
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        onMouseEnter={() => playHover()}
        onMouseDown={() => playClick()}
        {...props}
      >
        {isLoading ? (
          <div className="flex gap-2 items-center">
            {children}
            <LucideLoader className="animate-spin-slow" size={15} />
          </div>
        ) : (
          children
        )}
      </Comp>
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
