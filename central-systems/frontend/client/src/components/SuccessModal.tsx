"use client"
import React from 'react';
import { Check } from 'lucide-react';

interface SuccessModalProps {
  title: string;
  message: string;
  isVisible: boolean;
  onClose?: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({
  title = "Invite sent",
  message = "Your invitation has been sent successfully",
  isVisible,
  onClose
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-md shadow-xl animate-fade-in">
        <header className="p-6">
          <h2 className="text-xl font-semibold text-center text-gray-800">
            {title}
          </h2>
        </header>

        <div className="flex justify-center p-6">
          <div className="bg-purple-700 rounded-full p-4">
            <Check className="w-12 h-12 text-white" strokeWidth={3} />
          </div>
        </div>

        <div className="px-6 pb-6">
          <p className="text-center text-gray-600">
            {message}
          </p>
        </div>

        {onClose && (
          <footer className="p-4 border-t border-gray-100">
            <button
              onClick={onClose}
              className="w-full py-2 px-4 bg-purple-700 hover:bg-purple-800 text-white rounded-lg transition-colors duration-200"
            >
              Close
            </button>
          </footer>
        )}
      </div>
    </div>
  );
};

export default SuccessModal;