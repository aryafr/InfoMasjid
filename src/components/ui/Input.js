import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";

export const Input = React.forwardRef(({ className, type, icon: Icon, error, ...props }, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className="relative w-full">
      {Icon && (
        <Icon className={cn(
          "absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5",
          error ? "text-destructive" : "text-muted-foreground"
        )} />
      )}
      <input
        type={inputType}
        className={cn(
          "w-full flex rounded-xl border-2 bg-background/50 py-3.5 px-4 text-sm font-medium transition-all file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-4 disabled:cursor-not-allowed disabled:opacity-50",
          Icon ? "pl-12" : "",
          isPassword ? "pr-12" : "",
          error 
            ? "border-destructive/50 focus-visible:border-destructive focus-visible:ring-destructive/20 text-destructive" 
            : "border-border/50 focus-visible:border-primary focus-visible:ring-primary/20",
          className
        )}
        ref={ref}
        {...props}
      />
      {isPassword && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
        >
          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      )}
    </div>
  );
});

Input.displayName = "Input";
