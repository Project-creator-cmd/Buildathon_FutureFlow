const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 transform transition-all">
        <h3 className="text-xl font-bold text-gray-800 mb-3">{title}</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex space-x-3">
          <button onClick={onClose} className="btn-secondary flex-1">
            No
          </button>
          <button onClick={onConfirm} className="btn-primary flex-1">
            Yes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
