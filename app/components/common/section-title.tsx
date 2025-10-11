import React from "react";
import { cn } from "~/lib/utils";

interface SectionTitleProps {
  children: React.ReactNode;
  className?: string;
}

export const SectionTitle = ({ children, className }: SectionTitleProps) => (
  <h2 className={cn("text-2xl sm:text-3xl font-bold text-gray-900", className)}>
    {children}
  </h2>
);
