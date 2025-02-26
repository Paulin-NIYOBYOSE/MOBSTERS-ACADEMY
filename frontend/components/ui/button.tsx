import * as React from "react";
import clsx from "clsx";  // We can use clsx or a similar utility for conditional class merging

const buttonVariants = {
  variant: {
    default: "bg-[#00DC82] text-[#002419] hover:bg-[#00DC82]/90",
    outline: "border border-gray-600 text-white hover:bg-white/10",
    ghost: "hover:bg-accent hover:text-accent-foreground",
  },
  size: {
    default: "h-10 px-4 py-2",
    sm: "h-8 rounded-full px-3 text-xs",
    lg: "h-12 rounded-full px-8",
    icon: "h-9 w-9",
  },
};

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof buttonVariants.variant;
  size?: keyof typeof buttonVariants.size;
  asChild?: boolean;  // Optional prop to change the underlying element type
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
    // Determine the button component type based on `asChild` prop (default is 'button')
    const Comp = asChild ? "span" : "button";  // `span` for wrapping content, otherwise a regular button

    return (
      <Comp
        className={clsx(
          "inline-flex items-center justify-center rounded-full text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
          buttonVariants.variant[variant],
          buttonVariants.size[size],
          className  // Allow additional custom classes to be passed in
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button };
