import { useEffect, useRef, useState } from 'react';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { gasType: string; gallons: number; cost: number }) => void;
};

export default function LogRefuelModal({ isOpen, onClose, onSubmit }: Props) {
  const [gasType, setGasType] = useState('Regular');
  const [gallons, setGallons] = useState('');
  const [cost, setCost] = useState('');
  const [visible, setVisible] = useState(false);
  const [showConfirmClose, setShowConfirmClose] = useState(false);
  const [pendingCloseAction, setPendingCloseAction] = useState<() => void>(() => {});
  const modalRef = useRef<HTMLDivElement>(null);

  // check if the input is a valid number
  const numericFilter = (value: string) => /^\d*\.?\d*$/.test(value);
  const isValidNumber = (value: string) => /^\d+(?:\.\d+)?$/.test(value);

  const isDirty = gasType !== 'Regular' || gallons !== '' || cost !== '';
  const isFormValid =
    gallons !== '' &&
    cost !== '' &&
    isValidNumber(gallons) &&
    isValidNumber(cost);

  const tryClose = (action: () => void) => {
    if (isDirty) {
      setPendingCloseAction(() => action);
      setShowConfirmClose(true);
    } else {
      action();
      resetForm();
    }
  };

  const resetForm = () => {
    setGasType('Regular');
    setGallons('');
    setCost('');
  };

  const handleConfirmClose = () => {
    setShowConfirmClose(false);
    pendingCloseAction();
    resetForm();
  };

  const handleCancelConfirm = () => {
    setShowConfirmClose(false);
    setPendingCloseAction(() => () => {});
  };

  useEffect(() => {
    if (isOpen) requestAnimationFrame(() => setVisible(true));
    else {
      const timeout = setTimeout(() => setVisible(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') tryClose(onClose);
    };
    if (isOpen) document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isDirty]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        tryClose(onClose);
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, isDirty]);

  const handleSubmit = () => {
    if (!isFormValid) return;

    onSubmit({
      gasType,
      gallons: parseFloat(gallons),
      cost: parseFloat(cost),
    });
    onClose();
    resetForm();
  };

  if (!isOpen && !visible) return null;

  return (
    <div
      className={`fixed inset-0 z-40 flex items-center justify-center transition-opacity duration-300 ${
        isOpen ? 'opacity-100 backdrop-blur-sm bg-black/30' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div
        ref={modalRef}
        className={`bg-gradient-to-br from-[#f2f5f2] via-[#e0e8e0] to-[#d8e8d8] rounded-3xl p-8 w-full max-w-md shadow-2xl border border-white/40 space-y-6 transform transition-all duration-300 ease-in-out ${
          isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
      >
        <h2 className="text-xl font-semibold text-gray-800">Log Refuel</h2>

        {/* Gas Type */}
        <div>
          <label className="block mb-1 text-sm text-gray-700">Gas Type</label>
          <select
            value={gasType}
            onChange={(e) => setGasType(e.target.value)}
            className="w-full rounded-xl border border-gray-300 bg-white/60 backdrop-blur-md p-2 text-gray-800"
          >
            <option value="Regular">Regular</option>
            <option value="Premium">Premium</option>
            <option value="Diesel">Diesel</option>
          </select>
        </div>

        {/* Gallons Added */}
        <div>
          <label className="block mb-1 text-sm text-gray-700">Gallons Added</label>
          <input
            type="text"
            value={gallons}
            onChange={(e) => {
              if (numericFilter(e.target.value)) setGallons(e.target.value);
            }}
            className={`w-full rounded-xl border p-2 text-gray-800 bg-white/60 backdrop-blur-md transition-colors duration-200 ${
              gallons && !isValidNumber(gallons)
                ? 'border-red-500 focus:ring-red-200'
                : 'border-gray-300'
            }`}
            placeholder="e.g. 10 or 10.5"
          />
          {gallons && !isValidNumber(gallons) && (
            <p className="mt-1 text-sm text-red-500">請輸入有效的數字。</p>
          )}
        </div>

        {/* Money Spent */}
        <div>
          <label className="block mb-1 text-sm text-gray-700">Money Spent ($)</label>
          <input
            type="text"
            value={cost}
            onChange={(e) => {
              if (numericFilter(e.target.value)) setCost(e.target.value);
            }}
            className={`w-full rounded-xl border p-2 text-gray-800 bg-white/60 backdrop-blur-md transition-colors duration-200 ${
              cost && !isValidNumber(cost)
                ? 'border-red-500 focus:ring-red-200'
                : 'border-gray-300'
            }`}
            placeholder="e.g. 25 or 25.75"
          />
          {cost && !isValidNumber(cost) && (
            <p className="mt-1 text-sm text-red-500">Please enter valid number.</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-4 pt-2">
          <button
            onClick={() => tryClose(onClose)}
            className="px-4 py-2 text-sm rounded-full bg-white/70 text-gray-700 border border-gray-300 shadow-sm hover:brightness-105 active:scale-95 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!isFormValid}
            className={`px-5 py-2 text-sm rounded-full text-white shadow-md transition-transform duration-150 ease-in-out focus:outline-none ${
              isFormValid
                ? 'bg-[#0f4c81] hover:brightness-110 hover:scale-105 active:scale-95'
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            Submit
          </button>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {showConfirmClose && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl transition-all scale-100 opacity-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Discard changes?</h3>
            <p className="text-sm text-gray-600 mb-6">
              You have unsaved inputs. Are you sure you want to close this form?
            </p>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 text-sm rounded-full bg-gray-200 text-gray-700 hover:brightness-105 active:scale-95 transition"
                onClick={handleCancelConfirm}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 text-sm rounded-full bg-[#0f4c81] text-white hover:brightness-110 active:scale-95 transition"
                onClick={handleConfirmClose}
              >
                Close Anyway
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}