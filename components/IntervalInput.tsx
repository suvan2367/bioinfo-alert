import React, { useState } from 'react';

interface IntervalInputProps {
  initialValue: number;
  onSubmit: (minutes: number) => void;
  onBack: () => void;
}

const intervalOptions = [
  { label: '30 Mins', value: 30 },
  { label: '1 Hour', value: 60 },
  { label: '2 Hours', value: 120 },
  { label: '4 Hours', value: 240 },
  { label: '8 Hours', value: 480 },
  { label: 'Daily', value: 1440 },
];

const IntervalInput: React.FC<IntervalInputProps> = ({ initialValue, onSubmit, onBack }) => {
  const [selectedInterval, setSelectedInterval] = useState<number>(initialValue);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(selectedInterval);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Update Frequency
        </label>
        <p className="text-xs text-gray-500 mb-4">How often do you want to receive job updates?</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {intervalOptions.map(option => (
            <button
              key={option.value}
              type="button"
              onClick={() => setSelectedInterval(option.value)}
              className={`text-center p-4 rounded-lg border-2 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500 ${
                selectedInterval === option.value
                  ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg'
                  : 'bg-gray-700 border-gray-600 hover:bg-gray-600 hover:border-gray-500 text-gray-300'
              }`}
            >
              <span className="font-bold text-lg">{option.label}</span>
            </button>
          ))}
        </div>
      </div>
      
      <div className="flex gap-4 pt-2">
        <button
          type="button"
          onClick={onBack}
          className="w-1/2 bg-gray-600 hover:bg-gray-500 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 transition-colors duration-300"
        >
          Back
        </button>
        <button
          type="submit"
          className="w-1/2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-colors duration-300"
        >
          Next: Confirm
        </button>
      </div>
    </form>
  );
};

export default IntervalInput;
