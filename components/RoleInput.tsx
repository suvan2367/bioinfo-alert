
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { suggestRelatedRoles } from '../services/geminiService';
import { SpinnerIcon } from './icons/SpinnerIcon';

interface RoleInputProps {
  initialRoles: string[];
  onSubmit: (roles: string[]) => void;
}

const RoleInput: React.FC<RoleInputProps> = ({ initialRoles, onSubmit }) => {
  const [roles, setRoles] = useState<string[]>(initialRoles);
  const [currentRole, setCurrentRole] = useState<string>('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const debounceTimeout = useRef<number | null>(null);

  const handleAddRole = useCallback(() => {
    const trimmedRole = currentRole.trim();
    if (trimmedRole && !roles.some(r => r.toLowerCase() === trimmedRole.toLowerCase())) {
      setRoles(prevRoles => [...prevRoles, trimmedRole]);
      setCurrentRole('');
      setSuggestions([]);
    }
  }, [currentRole, roles]);

  const handleRemoveRole = (roleToRemove: string) => {
    setRoles(prevRoles => prevRoles.filter(role => role !== roleToRemove));
  };
  
  const handleAddSuggestion = (suggestion: string) => {
    if (!roles.some(r => r.toLowerCase() === suggestion.toLowerCase())) {
        setRoles(prevRoles => [...prevRoles, suggestion]);
    }
    setSuggestions([]);
  };

  const fetchSuggestions = useCallback(async (role: string) => {
    if (role.length < 3) {
        setSuggestions([]);
        return;
    }
    setIsLoadingSuggestions(true);
    const newSuggestions = await suggestRelatedRoles(role);
    setSuggestions(newSuggestions.filter(s => !roles.includes(s)));
    setIsLoadingSuggestions(false);
  }, [roles]);
  
  useEffect(() => {
    if (debounceTimeout.current) {
        window.clearTimeout(debounceTimeout.current);
    }
    if (currentRole.length > 2) {
        debounceTimeout.current = window.setTimeout(() => {
            fetchSuggestions(currentRole);
        }, 500);
    } else {
        setSuggestions([]);
    }

    return () => {
        if (debounceTimeout.current) {
            window.clearTimeout(debounceTimeout.current);
        }
    };
  }, [currentRole, fetchSuggestions]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (roles.length > 0) {
      onSubmit(roles);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="role-input" className="block text-sm font-medium text-gray-300 mb-1">
          Job Roles to Track
        </label>
        <p className="text-xs text-gray-500 mb-2">Enter roles like "Frontend Developer" or "Product Manager Intern".</p>
        <div className="flex items-center gap-2">
          <input
            id="role-input"
            type="text"
            value={currentRole}
            onChange={(e) => setCurrentRole(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddRole();
              }
            }}
            placeholder="e.g., Software Engineer"
            className="flex-grow bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="button"
            onClick={handleAddRole}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-colors duration-300"
          >
            Add
          </button>
        </div>
      </div>
      
      {(isLoadingSuggestions || suggestions.length > 0) && (
        <div>
            <h4 className="text-xs font-semibold text-gray-400 mb-2 flex items-center gap-2">
                {isLoadingSuggestions && <SpinnerIcon className="w-4 h-4" />}
                AI Suggestions
            </h4>
            <div className="flex flex-wrap gap-2">
                {suggestions.map((s, i) => (
                    <button key={i} type="button" onClick={() => handleAddSuggestion(s)} className="text-xs bg-gray-600 hover:bg-gray-500 text-gray-200 px-2 py-1 rounded-full transition-colors">
                        + {s}
                    </button>
                ))}
            </div>
        </div>
      )}

      {roles.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-300 mb-3">Currently Tracking:</h3>
          <div className="flex flex-wrap gap-2">
            {roles.map(role => (
              <span
                key={role}
                className="flex items-center bg-gray-700 text-gray-200 text-sm font-medium px-3 py-1 rounded-full"
              >
                {role}
                <button
                  type="button"
                  onClick={() => handleRemoveRole(role)}
                  className="ml-2 text-gray-400 hover:text-white focus:outline-none"
                  aria-label={`Remove ${role}`}
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={roles.length === 0}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-colors duration-300 disabled:bg-gray-500 disabled:cursor-not-allowed"
      >
        Next: Configure Telegram
      </button>
    </form>
  );
};

export default RoleInput;
