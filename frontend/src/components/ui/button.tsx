// /components/ui/button.tsx
import React, { ElementType } from "react";
import { ButtonHTMLAttributes } from "react";

// Define the valid variants for the button (you can extend this as needed)
type ButtonVariant = "primary" | "secondary" | "danger";  // Add more variants as needed

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  asChild?: boolean;  // Add asChild to allow for dynamic rendering
  as?: ElementType;   // Dynamically choose the element type (e.g., Link, button)
  variant?: ButtonVariant;  // Define the variant prop
  className?: string;  // Allow for custom className styling
}

export function Button({ children, className, asChild = false, as: Component = "button", variant = "primary", ...props }: ButtonProps) {
  // Define the styles for different button variants
  const variantStyles = {
    primary: "bg-blue-500 hover:bg-blue-600 text-white",
    secondary: "bg-gray-500 hover:bg-gray-600 text-white",
    danger: "bg-red-500 hover:bg-red-600 text-white",
  };

  // If asChild is true, render the passed Component (Link or other)
  if (asChild) {
    return (
      <Component className={`px-4 py-2 rounded-md ${variantStyles[variant]} ${className}`} {...props}>
        {children}
      </Component>
    );
  }

  // Default rendering as a button
  return (
    <button className={`px-4 py-2 rounded-md ${variantStyles[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
