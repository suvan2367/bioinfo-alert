import React, { useState } from 'react';

interface TelegramInputProps {
  onSubmit: (username: string) => void;
}

const TelegramInput: React.FC<TelegramInputProps> = ({ onSubmit }) => {
  const [username, setUsername] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      onSubmit(username.startsWith('@') ? username.trim() : `@${username.trim()}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="telegram-username" className="block text-sm font-medium text-gray-300 mb-1">
          Your Telegram Username
        </label>
        <p className="text-xs text-gray-500 mb-2">We'll send notifications for the pre-configured job roles to this account.</p>
        <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-400">@</span>
            </div>
            <input
                id="telegram-username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value.replace('@',''))}
                placeholder="your_username"
                className="w-full bg-gray-700 border border-gray-600 text-white rounded-md pl-7 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-telegram"
                required
            />
        </div>
        <div className="mt-4 text-xs bg-gray-700/50 p-3 rounded-md border border-gray-600">
            <p className="text-gray-400">
                <strong>Important:</strong> To receive notifications, you must first start a conversation with our bot.
                <a href="https://t.me/YourNotifierBot" target="_blank" rel="noopener noreferrer" className="text-brand-telegram font-bold ml-1 hover:underline">
                    Click here to message @YourNotifierBot
                </a>
                .
            </p>
        </div>
      </div>
      
      <div className="flex gap-4">
        <button
          type="submit"
          className="w-full bg-brand-telegram hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-telegram focus:ring-opacity-50 transition-colors duration-300"
        >
          Next: Set Interval
        </button>
      </div>
    </form>
  );
};

export default TelegramInput;