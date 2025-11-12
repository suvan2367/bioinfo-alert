
import React, { useState, useEffect } from 'react';
import { SpinnerIcon } from './icons/SpinnerIcon';
import { CheckIcon } from './icons/CheckIcon';

interface StatusDisplayProps {
  onComplete: () => void;
}

const steps = [
  { text: 'Connecting to LinkedIn API...', duration: 2000 },
  { text: 'Analyzing post structures...', duration: 1500 },
  { text: 'Configuring Telegram bot...', duration: 2000 },
  { text: 'Setting up hourly scheduler...', duration: 1500 },
  { text: 'Finalizing activation...', duration: 1000 },
];

const StatusDisplay: React.FC<StatusDisplayProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<boolean[]>(new Array(steps.length).fill(false));

  useEffect(() => {
    if (currentStep < steps.length) {
      const timer = setTimeout(() => {
        setCompletedSteps(prev => {
          const newCompleted = [...prev];
          newCompleted[currentStep] = true;
          return newCompleted;
        });
        setCurrentStep(prev => prev + 1);
      }, steps[currentStep].duration);
      return () => clearTimeout(timer);
    } else {
      const finalTimer = setTimeout(onComplete, 500);
      return () => clearTimeout(finalTimer);
    }
  }, [currentStep, onComplete]);

  return (
    <div className="space-y-4 text-center">
      <h2 className="text-xl font-bold text-white">Activating Your Notifier</h2>
      <p className="text-sm text-gray-400">Please wait while we set everything up...</p>
      <div className="pt-4 space-y-3 text-left">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center gap-3">
            <div className="w-6 h-6 flex-shrink-0">
              {completedSteps[index] ? (
                <CheckIcon className="text-green-400" />
              ) : currentStep === index ? (
                <SpinnerIcon className="text-indigo-400" />
              ) : (
                <div className="w-5 h-5 border-2 border-gray-500 rounded-full" />
              )}
            </div>
            <span className={`transition-colors duration-300 ${completedSteps[index] ? 'text-gray-400 line-through' : currentStep === index ? 'text-white font-semibold' : 'text-gray-500'}`}>
              {step.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatusDisplay;
