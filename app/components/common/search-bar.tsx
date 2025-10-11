import React from "react";
import { Search } from "lucide-react";
import { Input } from "~/components/ui/input";

interface SearchBarProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
}

export const SearchBar = ({ value, onChange, placeholder }: SearchBarProps) => (
  <div className="relative">
    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-rose-600 pointer-events-none" />
    <Input
      type="search"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full rounded-full h-14 pl-12 pr-4 shadow-lg border-none bg-white focus-visible:ring-2 focus-visible:ring-rose-600 text-base"
    />
  </div>
);
