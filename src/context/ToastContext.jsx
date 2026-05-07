/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from 'react';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState({ type: '', text: '' });

  const showToast = (type, text) => {
    setToast({ type, text });
    setTimeout(() => setToast({ type: '', text: '' }), 3500);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast.text && (
        <div className={`fixed top-24 right-4 z-[200] w-[calc(100%-2rem)] max-w-sm rounded-xl border px-5 py-4 shadow-2xl backdrop-blur-sm animate-in fade-in slide-in-from-top-4 duration-300 ${
          toast.type === 'success'
            ? 'bg-green-50/95 text-green-900 border-green-200'
            : 'bg-red-50/95 text-red-900 border-red-200'
        }`}>
          <div className="flex items-start gap-3">
            <div className={`mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold ${
              toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
            }`}>
              {toast.type === 'success' ? '✓' : '!'}
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest">
                {toast.type === 'success' ? 'Success' : 'Attention'}
              </p>
              <p className="mt-1 text-sm leading-relaxed">{toast.text}</p>
            </div>
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
};
