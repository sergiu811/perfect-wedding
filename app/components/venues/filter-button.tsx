import React from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

interface FilterButtonProps {
  label: string;
  onClick: () => void;
  active?: boolean;
}

export const FilterButton = ({
  label,
  onClick,
  active = false,
}: FilterButtonProps) => (
  <Button
    variant="ghost"
    onClick={onClick}
    className={cn(
      "flex h-10 shrink-0 items-center justify-center gap-2 rounded-full px-4 transition-all duration-200",
      active
        ? "bg-rose-600 text-white hover:bg-rose-700"
        : "bg-rose-600/10 text-rose-600 hover:bg-rose-600/20"
    )}
  >
    <span className="text-sm font-medium">{label}</span>
    <ChevronDown className="h-4 w-4" />
  </Button>
);
