import { CheckCircle, XCircle, X } from 'lucide-react';

export default function Message({ type, message, onClose }) {
  return (
    <div
      className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-card max-w-md border ${
        type === 'success'
          ? 'bg-green-50 text-green-800 border-green-200'
          : 'bg-red-50 text-red-800 border-red-200'
      }`}
    >
      {type === 'success' ? (
        <CheckCircle size={20} className="flex-shrink-0" />
      ) : (
        <XCircle size={20} className="flex-shrink-0" />
      )}
      <p className="flex-1 text-sm font-medium">{message}</p>
      <button
        onClick={onClose}
        className={`flex-shrink-0 rounded-md p-1 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
          type === 'success'
            ? 'text-green-600 hover:text-green-800 focus-visible:ring-green-600'
            : 'text-red-600 hover:text-red-800 focus-visible:ring-red-600'
        }`}
        aria-label="Close notification"
      >
        <X size={18} />
      </button>
    </div>
  );
}
