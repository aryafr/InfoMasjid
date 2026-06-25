"use client";

import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, Check } from "lucide-react";

export const Select = React.forwardRef(({ className, options = [], value, onChange, placeholder, ...props }, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className={cn("relative w-full", className)} ref={containerRef}>
      <div
        className={cn(
          "flex items-center justify-between w-full h-11 bg-background border border-border/50 text-sm rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-primary/50 text-foreground transition-all cursor-pointer",
          isOpen && "ring-2 ring-primary/50 border-primary/50"
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={!selectedOption ? "text-muted-foreground" : ""}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown className={cn("w-4 h-4 text-muted-foreground transition-transform", isOpen && "rotate-180")} />
      </div>
      
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-card border border-border/50 rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 py-1 max-h-60 overflow-y-auto">
          {options.map((opt, i) => (
            <div
              key={i}
              className={cn(
                "flex items-center justify-between px-4 py-2.5 text-sm cursor-pointer hover:bg-accent transition-colors",
                value === opt.value && "bg-primary/10 text-indigo-500 font-bold"
              )}
              onClick={() => {
                if (onChange) onChange({ target: { value: opt.value } });
                setIsOpen(false);
              }}
            >
              <span>{opt.label}</span>
              {value === opt.value && <Check className="w-4 h-4" />}
            </div>
          ))}
        </div>
      )}
      
      {/* Hidden native select for form integration */}
      <select ref={ref} value={value} onChange={onChange} className="hidden" {...props}>
        {placeholder && <option value="" disabled hidden>{placeholder}</option>}
        {options.map((opt, i) => <option key={i} value={opt.value}>{opt.label}</option>)}
      </select>
    </div>
  );
});

Select.displayName = "Select";
