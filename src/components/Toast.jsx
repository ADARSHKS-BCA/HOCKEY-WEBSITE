export default function Toast({ message, type = 'success', onClose }) {
  const bgColors = {
    success: 'bg-brand-green',
    error: 'bg-brand-secondary',
    info: 'bg-blue-500'
  };

  return (
    <div className={`fixed bottom-6 right-6 ${bgColors[type]} text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-fade-in-up z-50`}>
      <span className="font-medium">{message}</span>
      {onClose && (
        <button onClick={onClose} className="text-white/80 hover:text-white pb-1">
          &times;
        </button>
      )}
    </div>
  );
}
