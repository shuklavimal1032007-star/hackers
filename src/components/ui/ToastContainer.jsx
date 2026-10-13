import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export default function ToastContainer() {
  const { toasts, removeToast } = useApp();

  if (!toasts || toasts.length === 0) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />,
    info: <Info className="w-5 h-5 text-cyan-400 shrink-0" />
  };

  const borderClasses = {
    success: 'border-emerald-500/30 bg-[#0d1f1b]/95 text-emerald-200',
    warning: 'border-amber-500/30 bg-[#221c10]/95 text-amber-200',
    error: 'border-rose-500/30 bg-[#221015]/95 text-rose-200',
    info: 'border-cyan-500/30 bg-[#0c1827]/95 text-cyan-200'
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-xl backdrop-blur-md animate-in slide-in-from-right-10 duration-200 ${borderClasses[toast.type] || borderClasses.info}`}
        >
          {icons[toast.type] || icons.info}
          <div className="flex-1 pr-1">
            <h5 className="text-xs font-semibold text-white tracking-wide">
              {toast.title}
            </h5>
            <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
              {toast.message}
            </p>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-slate-400 hover:text-white p-0.5 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
