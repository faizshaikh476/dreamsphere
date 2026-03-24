"use client";

import { createContext, useContext, useMemo, useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

type Toast = {
  id: string;
  title: string;
  tone?: "default" | "error";
};

const ToastContext = createContext({
  showToast: (_title: string, _tone?: "default" | "error") => undefined
});

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const value = useMemo(
    () => ({
      showToast: (title: string, tone: "default" | "error" = "default") => {
        const id = crypto.randomUUID();
        setToasts((current) => [...current, { id, title, tone }]);
        window.setTimeout(() => {
          setToasts((current) => current.filter((toast) => toast.id !== id));
        }, 3500);
      }
    }),
    []
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed right-4 top-4 z-[100] flex w-[min(90vw,360px)] flex-col gap-3">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`rounded-2xl border px-4 py-3 shadow-glow ${
              toast.tone === "error"
                ? "border-red-500/30 bg-red-950/70 text-red-100"
                : "border-border bg-panel/95 text-text"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm">{toast.title}</p>
              <button
                aria-label="Dismiss toast"
                className="opacity-70 transition hover:opacity-100"
                onClick={() =>
                  setToasts((current) => current.filter((item) => item.id !== toast.id))
                }
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
