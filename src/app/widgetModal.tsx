
import React from "react";

interface ConfirmationModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onCancel,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay flex w-full justify-center align-center fixed top-60">
      <div className="modal-content bg-white border-2 p-4">
        <p className="font-bold">Are you sure you want to delete this chart?</p>
        <div className="modal-buttons">
          <button className="bg-red-500 hover:bg-red-800  hover:text-white m-1 p-2" onClick={onCancel}>Cancel</button>
          <button  className="bg-blue-500 hover:bg-blue-800 hover:text-white m-1 p-2"  onClick={onConfirm}>Confirm</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
