import React, { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export const Modal = ({ isOpen, onClose, title, children, className }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-background/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal Dialog */}
      <div className={cn(
        "relative z-50 w-full max-w-lg bg-card border border-border shadow-2xl rounded-3xl p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200",
        className
      )}>
        <button 
          onClick={onClose}
          className="absolute right-6 top-6 rounded-full p-2 bg-muted hover:bg-muted/80 transition-colors text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
        
        {title && (
          <div className="mb-6">
            <h2 className="text-xl font-bold tracking-tight">{title}</h2>
          </div>
        )}
        
        <div>
          {children}
        </div>
      </div>
    </div>
  );
};
