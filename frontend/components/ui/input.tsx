import { cn } from "@/lib/utils";
import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-[#00DC82] focus:ring-2 focus:ring-[#00DC82] text-white placeholder-gray-400 outline-none transition-all"
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";
