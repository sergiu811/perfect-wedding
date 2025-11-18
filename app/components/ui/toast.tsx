import React, { useEffect } from "react";
import { X } from "lucide-react";

export interface ToastProps {
  id: string;
  title: string;
  message: string;
  avatar?: string;
  onClick?: () => void;
  onClose: (id: string) => void;
  duration?: number;
}

export const Toast = ({
  id,
  title,
  message,
  avatar,
  onClick,
  onClose,
  duration = 5000,
}: ToastProps) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose(id);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [id, duration, onClose]);

  return (
    <div
      className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 mb-3 max-w-sm w-full animate-slide-in-right cursor-pointer hover:shadow-xl transition-shadow"
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        {avatar && (
          <img
            src={avatar}
            alt={title}
            className="w-10 h-10 rounded-full flex-shrink-0"
          />
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <p className="font-semibold text-gray-900 text-sm truncate">
              {title}
            </p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClose(id);
              }}
              className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{message}</p>
        </div>
      </div>
    </div>
  );
};

export const ToastContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="fixed top-4 right-4 z-[9999] pointer-events-none">
      <div className="pointer-events-auto flex flex-col items-end">
        {children}
      </div>
    </div>
  );
};

