import React from 'react';
import Modal from './Modal';
import Button from './Button';
import { AlertTriangle, HelpCircle, CheckCircle } from 'lucide-react';

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to proceed with this operation?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "primary", // "primary" | "danger" | "success" | "warning"
  iconType = "warning",
  loading = false
}) {
  const icons = {
    warning: <AlertTriangle className="w-8 h-8 text-amber-400" />,
    danger: <AlertTriangle className="w-8 h-8 text-rose-400" />,
    question: <HelpCircle className="w-8 h-8 text-cyan-400" />,
    success: <CheckCircle className="w-8 h-8 text-emerald-400" />
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      maxWidth="max-w-md"
    >
      <div className="flex flex-col items-center text-center p-2">
        <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/60 mb-4">
          {icons[iconType] || icons.warning}
        </div>
        <p className="text-sm text-slate-300 leading-relaxed mb-6">
          {message}
        </p>

        <div className="flex items-center gap-3 w-full justify-end pt-2 border-t border-slate-800">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            {cancelText}
          </Button>
          <Button
            variant={variant}
            onClick={onConfirm}
            loading={loading}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
