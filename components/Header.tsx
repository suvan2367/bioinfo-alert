import React from 'react';
import { LinkedInIcon } from './icons/LinkedInIcon';
import { TelegramIcon } from './icons/TelegramIcon';
import { ArrowRightIcon } from './icons/ArrowRightIcon';

const Header: React.FC = () => {
  return (
    <header className="text-center">
      <div className="flex justify-center items-center gap-4 sm:gap-6 mb-4">
        <LinkedInIcon className="w-12 h-12 sm:w-16 sm:h-16 text-brand-linkedin" />
        <ArrowRightIcon className="w-8 h-8 sm:w-10 sm:h-10 text-gray-500" />
        <TelegramIcon className="w-12 h-12 sm:w-16 sm:h-16 text-brand-telegram" />
      </div>
      <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
        Bio/AI/Clinical Job Notifier
      </h1>
      <p className="mt-2 text-md sm:text-lg text-gray-400 max-w-xs mx-auto">
        Get updates for ML, Clinical Programming, Computational Biology, and more.
      </p>
    </header>
  );
};

export default Header;