/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { X, AlertTriangle } from "lucide-react";
import Button from "../Button/Button";

type Props = {
  onClose: () => void;
  onConfirm: any;
  itemName?: string;
  itemType?: string;
};

const DeleteConfirmationModal: React.FC<Props> = ({
  onClose,
  onConfirm,
  itemName = "this item",
  itemType = "item",
}) => {
  const [inputText, setInputText] = useState("");
  const requiredText =
    "I understand that deleting this item is permanent and cannot be undone.";

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
  };

  const isMatch = inputText === requiredText;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white rounded-xl w-full max-w-md shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-50">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <h2 className="text-lg font-semibold text-neutral-10 font-Inter">
              Delete {itemType}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-neutral-50 rounded-lg transition-colors"
          >
            <X className="h-4 w-4 text-neutral-45" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-5">
          {/* Warning Message */}
          <p className="text-neutral-20 text-sm mb-6">
            You are about to delete{" "}
            <span className="font-semibold text-red-600">{itemName}</span>. This
            action cannot be undone.
          </p>

          {/* Confirmation Section */}
          <div className="mb-5">
            <p className="text-sm text-neutral-45 mb-2">
              Type the following to confirm:
            </p>
            <p className="text-xs text-neutral-5 bg-neutral-50 p-2 rounded border border-neutral-50 mb-3 font-mono">
              {requiredText}
            </p>
            <input
              value={inputText}
              onChange={handleInputChange}
              onCopy={(e) => e.preventDefault()}
              // onPaste={(e) => e.preventDefault()}
              className="w-full px-3 py-2 text-sm border border-neutral-50 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 font-Roboto"
              placeholder="Type here..."
              autoFocus
            />
            {!isMatch && inputText && (
              <p className="text-xs text-red-500 mt-2">Text doesn't match</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              label="Cancel"
              variant="secondary"
              onClick={onClose}
              className="flex-1"
            />
            <Button
              label="Delete"
              variant="primary"
              onClick={() => {
                onConfirm();
                onClose();
              }}
              disabled={!isMatch}
              className={`flex-1 ${!isMatch && "opacity-50 cursor-not-allowed"}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
