import { createContext, useCallback, useContext, useState } from 'react';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null);

  const showToast = useCallback(({ title, message, variant = 'success', delay = 4000 }) => {
    setToast({ title, message, variant });
    window.setTimeout(() => {
      setToast(null);
    }, delay);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 1080, minWidth: 320 }}>
          <div className={`toast show align-items-center text-bg-${toast.variant} border-0`} role="alert" aria-live="assertive" aria-atomic="true">
            <div className="d-flex">
              <div className="toast-body">
                <strong className="d-block mb-1">{toast.title}</strong>
                <div>{toast.message}</div>
              </div>
              <button type="button" className="btn-close btn-close-white me-2 m-auto" aria-label="Close" onClick={() => setToast(null)} />
            </div>
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
};

export default ToastProvider;
