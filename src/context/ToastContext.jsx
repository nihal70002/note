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
        <div className={`fixed top-24 right-4 z-[200] max-w-xs rounded-sm border px-5 py-4 shadow-lg text-sm ${
          toast.type === 'success'
            ? 'bg-green-50 text-green-800 border-green-100'
            : 'bg-red-50 text-red-700 border-red-100'
        }`}>
          {toast.text}
        </div>
      )}
    </ToastContext.Provider>
  );
};
