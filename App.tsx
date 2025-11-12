import React, { useState, useCallback } from 'react';
import { AppStep } from './types';
import Header from './components/Header';
import TelegramInput from './components/TelegramInput';
import IntervalInput from './components/IntervalInput';
import Confirmation from './components/Confirmation';
import StatusDisplay from './components/StatusDisplay';

const PREDEFINED_ROLES = [
  'ML intern',
  'AI intern',
  'Clinical data analyst',
  'clinical programmer',
  'statistical programmer',
  'computational biology intern',
  'computational biologist',
  'genomic data analyst',
  'transcriptomic data analyst'
];

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>(AppStep.Telegram);
  const [roles] = useState<string[]>(PREDEFINED_ROLES);
  const [telegramUsername, setTelegramUsername] = useState<string>('');
  const [intervalMinutes, setIntervalMinutes] = useState<number>(60);

  const handleTelegramSubmit = useCallback((username: string) => {
    setTelegramUsername(username);
    setStep(AppStep.Interval);
  }, []);

  const handleIntervalSubmit = useCallback((minutes: number) => {
    setIntervalMinutes(minutes);
    setStep(AppStep.Confirm);
  }, []);

  const handleConfirm = useCallback(() => {
    setStep(AppStep.Processing);
  }, []);
  
  const handleEdit = useCallback(() => {
      setStep(AppStep.Telegram);
  }, []);

  const handleReset = useCallback(() => {
    setTelegramUsername('');
    setIntervalMinutes(60);
    setStep(AppStep.Telegram);
  }, []);

  const renderStep = () => {
    switch (step) {
      case AppStep.Telegram:
        return (
          <TelegramInput
            onSubmit={handleTelegramSubmit}
          />
        );
      case AppStep.Interval:
        return (
          <IntervalInput
            initialValue={intervalMinutes}
            onSubmit={handleIntervalSubmit}
            onBack={() => setStep(AppStep.Telegram)}
          />
        );
      case AppStep.Confirm:
        return (
          <Confirmation
            roles={roles}
            telegramUsername={telegramUsername}
            intervalMinutes={intervalMinutes}
            onConfirm={handleConfirm}
            onEdit={handleEdit}
          />
        );
      case AppStep.Processing:
        return <StatusDisplay onComplete={() => setStep(AppStep.Success)} />;
      case AppStep.Success:
        return (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-green-400 mb-4">Configuration Complete!</h2>
            <p className="text-gray-300 mb-6">Your Bio/AI/Clinical job notifier is now active. You will start receiving updates on Telegram.</p>
            <button
              onClick={handleReset}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-colors duration-300"
            >
              Start a New Configuration
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md mx-auto">
        <Header />
        <main className="bg-gray-800 rounded-lg shadow-2xl p-6 sm:p-8 mt-6">
          {renderStep()}
        </main>
        <footer className="text-center mt-6 text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} Job Notifier. All Rights Reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;