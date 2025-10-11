import React from "react";
import { cn } from "~/lib/utils";
import { useRouter } from "~/contexts/router-context";
import { Link } from "~/components/common";
import { NAV_ITEMS } from "~/constants";

export const Navigation = () => {
  const { currentPath } = useRouter();

  return (
    <nav className="sticky bottom-0 border-t border-rose-600/20 bg-pink-50/95 backdrop-blur-md pt-2 pb-4 shadow-lg">
      <div className="flex justify-around px-2">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-200 min-w-[64px]",
                isActive
                  ? "text-rose-600"
                  : "text-rose-600/70 hover:text-rose-600 hover:bg-rose-50"
              )}
            >
              <Icon className="h-6 w-6" strokeWidth={isActive ? 2.5 : 2} />
              <p
                className={cn(
                  "text-xs font-medium",
                  isActive && "font-semibold"
                )}
              >
                {item.label}
              </p>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
