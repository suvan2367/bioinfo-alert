import React, { useState } from 'react';
import { TelegramIcon } from './icons/TelegramIcon';
import { ClockIcon } from './icons/ClockIcon';
import { PaperPlaneIcon } from './icons/PaperPlaneIcon';
import { SpinnerIcon } from './icons/SpinnerIcon';
import { CheckIcon } from './icons/CheckIcon';
import { XCircleIcon } from './icons/XCircleIcon';

interface ConfirmationProps {
  roles: string[];
  telegramUsername: string;
  intervalMinutes: number;
  onConfirm: () => void;
  onEdit: () => void;
}

const formatInterval = (minutes: number): string => {
  if (minutes === 1440) return 'Every Day';
  if (minutes >= 60) {
      const hours = minutes / 60;
      return `Every ${hours} ${hours === 1 ? 'Hour' : 'Hours'}`;
  }
  return `Every ${minutes} Minutes`;
};

// Mock validation function to simulate a backend check of the Telegram username
const checkTelegramSetup = (username: string): Promise<{ success: boolean; message: string }> => {
  return new Promise(resolve => {
    setTimeout(() => {
      const lowerUser = username.toLowerCase();
      if (lowerUser.includes('invalid') || username.length < 6) { // @ + 5 chars minimum
        resolve({ 
          success: false, 
          message: "This username appears to be invalid. Please check for typos and ensure it's at least 5 characters long." 
        });
      } else if (lowerUser.includes('nomessage')) {
         resolve({ 
           success: false, 
           message: "This simulates that you haven't messaged the bot yet. Please start a conversation with the bot to receive alerts." 
          });
      }
      else {
        resolve({ success: true, message: "" });
      }
    }, 1500);
  });
};


const Confirmation: React.FC<ConfirmationProps> = ({ roles, telegramUsername, intervalMinutes, onConfirm, onEdit }) => {
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'failure'>('idle');
  const [testErrorMessage, setTestErrorMessage] = useState<string>('');

  const handleTestNotification = async () => {
    if (testStatus === 'testing') return;

    setTestStatus('testing');
    setTestErrorMessage('');
    
    const result = await checkTelegramSetup(telegramUsername);

    if (result.success) {
      setTestStatus('success');
    } else {
      setTestStatus('failure');
      setTestErrorMessage(result.message);
    }
  };

  const getTestButtonContent = () => {
    switch (testStatus) {
      case 'testing':
        return (
          <>
            <SpinnerIcon className="w-5 h-5" />
            <span>Simulating...</span>
          </>
        );
      case 'success':
        return (
          <>
            <CheckIcon className="w-5 h-5" />
            <span>Simulation OK!</span>
          </>
        );
      case 'failure':
        return (
            <>
                <XCircleIcon className="w-5 h-5" />
                <span>Simulation Failed</span>
            </>
        );
      default:
        return (
          <>
            <PaperPlaneIcon className="w-5 h-5" />
            <span>Test UI Notification</span>
          </>
        );
    }
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-center text-white">Review Your Configuration</h2>
      
      <div className="bg-gray-700/50 p-4 rounded-lg border border-gray-600 space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-400 mb-2">Job Roles to Track:</h3>
          <div className="flex flex-wrap gap-2">
            {roles.map(role => (
              <span key={role} className="bg-gray-600 text-gray-200 text-sm font-medium px-3 py-1 rounded-full">
                {role}
              </span>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-semibold text-gray-400 mb-2">Delivery Channel:</h3>
          <div className="flex items-center gap-2 text-brand-telegram">
            <TelegramIcon className="w-6 h-6" />
            <span className="font-bold text-lg">{telegramUsername}</span>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-gray-400 mb-2">Update Frequency:</h3>
          <div className="flex items-center gap-2 text-white">
            <ClockIcon className="w-6 h-6" />
            <span className="font-bold text-lg">{formatInterval(intervalMinutes)}</span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="text-center">
            <button
              onClick={handleTestNotification}
              disabled={testStatus === 'testing'}
              className={`inline-flex items-center justify-center gap-2 font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all duration-300 w-full sm:w-auto ${
                testStatus === 'success' 
                  ? 'bg-green-600 text-white cursor-default'
                  : testStatus === 'failure'
                  ? 'bg-red-600 text-white focus:ring-red-500'
                  : 'bg-sky-600 hover:bg-sky-700 text-white focus:ring-sky-500 disabled:bg-gray-500'
              }`}
            >
              {getTestButtonContent()}
            </button>
        </div>
        {testStatus === 'success' && (
            <div className="text-xs text-center p-3 bg-green-900/50 border border-green-700 rounded-md">
                <p className="font-semibold text-green-300 mb-1">Test Simulation Successful!</p>
                <p className="text-gray-300">
                    This confirms the UI works. To receive real alerts, you must message our bot on Telegram.
                    <a href="https://t.me/YourNotifierBot" target="_blank" rel="noopener noreferrer" className="text-brand-telegram font-bold ml-1 hover:underline">
                        Message Bot Now
                    </a>
                </p>
            </div>
        )}
        {testStatus === 'failure' && (
            <div className="text-xs text-center p-3 bg-red-900/50 border border-red-700 rounded-md">
                <p className="font-semibold text-red-300 mb-1">Test Simulation Failed!</p>
                <p className="text-gray-300">
                    {testErrorMessage} The most common issue is not messaging the bot first.
                    <a href="https://t.me/YourNotifierBot" target="_blank" rel="noopener noreferrer" className="text-brand-telegram font-bold ml-1 hover:underline">
                        Click here to message the bot
                    </a>
                    , then try the test again.
                </p>
            </div>
        )}
      </div>
      
      <div className="text-center text-xs text-gray-400 pt-2 border-t border-gray-700">
        <p>You will receive updates for posts related to these roles on LinkedIn.</p>
      </div>
      
      <div className="flex gap-4">
        <button
          onClick={onEdit}
          className="w-1/2 bg-gray-600 hover:bg-gray-500 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 transition-colors duration-300"
        >
          Edit
        </button>
        <button
          onClick={onConfirm}
          className="w-1/2 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-colors duration-300"
        >
          Activate Notifier
        </button>
      </div>
    </div>
  );
};

export default Confirmation;