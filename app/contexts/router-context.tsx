import React, { useState, useEffect, createContext, useContext } from "react";

interface RouterContextType {
  currentPath: string;
  navigate: (path: string) => void;
}

const RouterContext = createContext<RouterContextType | null>(null);

export const Router = ({ children }: { children: React.ReactNode }) => {
  // Initialize with "/" and update on mount to avoid SSR issues
  const [currentPath, setCurrentPath] = useState("/");

  const navigate = (path: string) => {
    setCurrentPath(path);
    if (typeof window !== "undefined") {
      window.history.pushState({}, "", path);
    }
  };

  useEffect(() => {
    // Set initial path from browser location on mount
    if (typeof window !== "undefined") {
      setCurrentPath(window.location.pathname + window.location.search);
    }

    const handlePopState = () => {
      if (typeof window !== "undefined") {
        setCurrentPath(window.location.pathname + window.location.search);
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("popstate", handlePopState);
      return () => window.removeEventListener("popstate", handlePopState);
    }
  }, []);

  return (
    <RouterContext.Provider value={{ currentPath, navigate }}>
      {children}
    </RouterContext.Provider>
  );
};

export const useRouter = () => {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error("useRouter must be used within a Router");
  }
  return context;
};

export const Route = ({
  path,
  element,
  render,
}: {
  path: string;
  element?: React.ReactNode;
  render?: (params: Record<string, string>) => React.ReactNode;
}) => {
  const { currentPath } = useRouter();

  // Strip query string from current path for matching
  const currentPathWithoutQuery = currentPath.split("?")[0];

  // Check for exact match first
  if (currentPathWithoutQuery === path) {
    return element || null;
  }

  // Check for dynamic route match (e.g., /venues/:id)
  if (path.includes(":")) {
    const pathParts = path.split("/");
    const currentParts = currentPathWithoutQuery.split("/");

    if (pathParts.length !== currentParts.length) {
      return null;
    }

    const params: Record<string, string> = {};
    let isMatch = true;

    for (let i = 0; i < pathParts.length; i++) {
      if (pathParts[i].startsWith(":")) {
        // This is a parameter
        const paramName = pathParts[i].slice(1);
        params[paramName] = currentParts[i];
      } else if (pathParts[i] !== currentParts[i]) {
        // Static part doesn't match
        isMatch = false;
        break;
      }
    }

    if (isMatch && render) {
      return render(params);
    }
  }

  return null;
};
