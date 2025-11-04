import React from "react";
import { cn } from "~/lib/utils";

interface ResponsiveContainerProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Responsive container that:
 * - Full width on mobile
 * - Max width with centered content on tablet/desktop
 * - Maintains beautiful design across all screen sizes
 */
export const ResponsiveContainer = ({ children, className }: ResponsiveContainerProps) => (
  <div className={cn(
    "w-full mx-auto",
    "max-w-md lg:max-w-7xl",
    "lg:px-6",
    className
  )}>
    {children}
  </div>
);
