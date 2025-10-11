import React from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "~/components/ui/button";

interface HeaderProps {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
}

export const Header = ({ title, showBack = true, onBack }: HeaderProps) => {
  const handleBack = () => {
    if (onBack) {
      onBack();
    }
  };

  return (
    <header className="flex items-center justify-between p-4 pb-2">
      {showBack ? (
        <Button
          variant="ghost"
          size="icon"
          onClick={handleBack}
          className="text-gray-900 hover:bg-gray-100 -ml-2"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
      ) : (
        <div className="w-10" />
      )}

      <h1 className="flex-1 text-center text-xl font-bold text-gray-900">
        {title}
      </h1>

      <div className="w-10" />
    </header>
  );
};
