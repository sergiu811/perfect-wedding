import React from "react";
import { cn } from "~/lib/utils";
import { useRouter } from "~/contexts/router-context";

interface LinkProps {
  to: string;
  children: React.ReactNode;
  className?: string;
  [key: string]: any;
}

export const Link = ({ to, children, className, ...props }: LinkProps) => {
  const { navigate, currentPath } = useRouter();
  const isActive = currentPath === to;

  return (
    <a
      href={to}
      className={cn(className, isActive && "active")}
      onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        navigate(to);
      }}
      {...props}
    >
      {children}
    </a>
  );
};
