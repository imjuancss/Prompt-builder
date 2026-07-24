import React from "react";
import { CheckCircle2 } from "lucide-react";

interface ToastProps {
  message: string;
  onClose?: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message }) => {
  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce-short bg-slate-900 border border-indigo-500/50 text-white px-4 py-3 rounded-2xl shadow-2xl shadow-indigo-500/20 flex items-center gap-3">
      <div className="w-7 h-7 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0">
        <CheckCircle2 className="w-4 h-4" />
      </div>
      <span className="text-xs font-bold text-slate-100">{message}</span>
    </div>
  );
};
