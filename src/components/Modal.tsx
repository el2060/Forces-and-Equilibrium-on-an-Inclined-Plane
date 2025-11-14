interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: string;
}

const Modal = ({ isOpen, onClose, content }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/40">
      <div className="bg-white m-auto p-6 rounded-2xl border border-gray-300 w-[90%] max-w-md text-center shadow-xl">
        <p className="text-xl font-medium text-gray-800 leading-relaxed">{content}</p>
        <button
          onClick={onClose}
          className="mt-6 w-full bg-accent-blue text-white font-bold rounded-2xl px-6 py-3 uppercase text-base shadow hover:bg-accent-blue-dark transition-all duration-200"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default Modal;
