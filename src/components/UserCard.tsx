import React from 'react';
import { User } from 'lucide-react';

interface UserCardProps {
  user: {
    uid: string;
    displayName: string;
    photoURL?: string;
  };
  onSelect: (uid: string) => void;
}

const UserCard = ({ user, onSelect }: UserCardProps) => {
  return (
    <div 
      className="card hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 cursor-pointer"
      onClick={() => onSelect(user.uid)}
    >
      <div className="p-6 flex flex-col items-center">
        {user.photoURL ? (
          <img 
            src={user.photoURL} 
            alt={user.displayName} 
            className="w-20 h-20 rounded-full mb-4 border-2 border-primary-500 dark:border-primary-400" 
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mb-4 border-2 border-primary-500 dark:border-primary-400">
            <User className="w-10 h-10 text-gray-500 dark:text-gray-400" />
          </div>
        )}
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
          {user.displayName}
        </h3>
        <div className="flex items-center">
          <span className="w-2 h-2 bg-success-500 rounded-full mr-2"></span>
          <span className="text-sm text-gray-600 dark:text-gray-300">Online</span>
        </div>
        <button 
          className="mt-4 btn-primary w-full"
          onClick={(e) => {
            e.stopPropagation();
            onSelect(user.uid);
          }}
        >
          Connect
        </button>
      </div>
    </div>
  );
};

export default UserCard;