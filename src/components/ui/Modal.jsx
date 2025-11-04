// src/components/ui/Modal.jsx
export default function Modal({ open, onClose, title, children, footer }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-xl bg-white shadow-lg">
        <div className="border-b px-5 py-3">
          <h3 className="text-color-text font-title text-lg font-semibold">{title}</h3>
        </div>
        <div className="px-5 py-4">{children}</div>
        <div className="flex items-center justify-end gap-2 border-t px-5 py-3">
          {footer ? (
            footer
          ) : (
            <button
              onClick={onClose}
              className="bg-color-primary-500 hover:bg-color-primary-600 rounded-lg px-4 py-2 font-semibold text-white"
            >
              OK
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
