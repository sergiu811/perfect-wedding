import React, { createContext, useContext, useState, useCallback } from 'react';
import { Toast, ToastContainer } from '~/components/ui/toast';

interface ToastData {
    id: string;
    title: string;
    message: string;
    variant?: 'default' | 'success' | 'error' | 'warning';
    avatar?: string;
    onClick?: () => void;
    duration?: number;
}

interface ToastContextType {
    show: (toast: Omit<ToastData, 'id'>) => void;
    success: (title: string, message: string) => void;
    error: (title: string, message: string) => void;
    warning: (title: string, message: string) => void;
    info: (title: string, message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within ToastProvider');
    }
    return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<ToastData[]>([]);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    const show = useCallback((toast: Omit<ToastData, 'id'>) => {
        const id = Math.random().toString(36).substring(7);
        setToasts((prev) => [...prev, { ...toast, id }]);
    }, []);

    const success = useCallback((title: string, message: string) => {
        show({ title, message, variant: 'success', duration: 4000 });
    }, [show]);

    const error = useCallback((title: string, message: string) => {
        show({ title, message, variant: 'error', duration: 5000 });
    }, [show]);

    const warning = useCallback((title: string, message: string) => {
        show({ title, message, variant: 'warning', duration: 5000 });
    }, [show]);

    const info = useCallback((title: string, message: string) => {
        show({ title, message, variant: 'default', duration: 4000 });
    }, [show]);

    return (
        <ToastContext.Provider value={{ show, success, error, warning, info }}>
            {children}
            <ToastContainer>
                {toasts.map((toast) => (
                    <Toast
                        key={toast.id}
                        {...toast}
                        onClose={removeToast}
                    />
                ))}
            </ToastContainer>
        </ToastContext.Provider>
    );
};
