import React from "react";
import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: "sm" | "md" | "lg";
}

export const StarRating = ({
  rating,
  maxRating = 5,
  size = "md",
}: StarRatingProps) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  return (
    <div className="flex text-rose-600">
      {Array.from({ length: maxRating }).map((_, index) => (
        <Star
          key={index}
          className={sizeClasses[size]}
          fill={index < Math.floor(rating) ? "currentColor" : "none"}
          strokeWidth={index < Math.floor(rating) ? 0 : 2}
        />
      ))}
    </div>
  );
};
