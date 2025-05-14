import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, RefreshCw } from 'lucide-react';
import { child, push, ref, set } from 'firebase/database';
import { database } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { useActiveUsers } from '../hooks/useActiveUsers';
import UserCard from '../components/UserCard';

const Dashboard = () => {
  const { user } = useAuth();
  const { activeUsers, loading } = useActiveUsers();
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [isShuffling, setIsShuffling] = useState(false);
  const navigate = useNavigate();

  // Shuffle a random set of active users
  const shuffleUsers = () => {
    setIsShuffling(true);
    setSelectedUsers([]);
    
    setTimeout(() => {
      // Pick 3 random users from active users (or less if there aren't enough)
      const count = Math.min(3, activeUsers.length);
      const shuffled = [...activeUsers].sort(() => 0.5 - Math.random());
      const randomUsers = shuffled.slice(0, count);
      
      setSelectedUsers(randomUsers.map(user => user.uid));
      setIsShuffling(false);
    }, 1000);
  };

  // Shuffle on initial load if there are active users
  useEffect(() => {
    if (!loading && activeUsers.length > 0) {
      shuffleUsers();
    }
  }, [loading]);

  const handleUserSelect = async (selectedUid: string) => {
    if (!user) return;
    
    try {
      // Create a new chat room
      const newChatRef = push(ref(database, 'chats'));
      const chatId = newChatRef.key;
      
      // Set up chat room participants
      await set(child(newChatRef, `users/${user.uid}`), {
        connected: true,
        timestamp: new Date().toISOString()
      });
      
      await set(child(newChatRef, `users/${selectedUid}`), {
        connected: false,
        timestamp: new Date().toISOString()
      });
      
      // Navigate to chat room with partner ID
      navigate(`/chat/${chatId}?partner=${selectedUid}`);
    } catch (error) {
      console.error('Error creating chat room:', error);
    }
  };

  // Find selected user data
  const getSelectedUserData = (userId: string) => {
    return activeUsers.find(user => user.uid === userId);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Talk to Someone New
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Connect with strangers from around the world and start a voice conversation. Click on a profile to connect or shuffle for new options.
        </p>
      </div>

      {/* Talk button */}
      <div className="flex justify-center mb-12">
        <button 
          onClick={shuffleUsers}
          disabled={isShuffling || loading || activeUsers.length === 0}
          className="btn-primary flex items-center space-x-2 text-lg px-6 py-3 rounded-full hover:scale-105 transition-transform duration-300"
        >
          {isShuffling ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span>Finding people...</span>
            </>
          ) : (
            <>
              <Mic className="w-5 h-5" />
              <span>Talk to Random People</span>
            </>
          )}
        </button>
      </div>

      {/* User cards */}
      <div className="mt-8">
        {loading ? (
          <div className="text-center py-8">
            <RefreshCw className="w-8 h-8 text-primary-500 animate-spin mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-300">Loading active users...</p>
          </div>
        ) : activeUsers.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
            <p className="text-gray-600 dark:text-gray-300 mb-2">No active users found at the moment.</p>
            <p className="text-gray-500 dark:text-gray-400">Check back soon or invite friends to join!</p>
          </div>
        ) : selectedUsers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-300">Click "Talk to Random People" to get started!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {selectedUsers.map((userId) => {
              const userData = getSelectedUserData(userId);
              return userData ? (
                <UserCard 
                  key={userId} 
                  user={userData} 
                  onSelect={handleUserSelect} 
                />
              ) : null;
            })}
          </div>
        )}
      </div>

      {/* Quick tips section */}
      <div className="mt-16 bg-primary-50 dark:bg-gray-800/50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Quick Tips
        </h2>
        <ul className="space-y-2 text-gray-700 dark:text-gray-300">
          <li className="flex items-start">
            <span className="text-primary-600 dark:text-primary-400 mr-2">•</span>
            Be respectful and polite with everyone you meet
          </li>
          <li className="flex items-start">
            <span className="text-primary-600 dark:text-primary-400 mr-2">•</span>
            If you encounter inappropriate behavior, use the report button
          </li>
          <li className="flex items-start">
            <span className="text-primary-600 dark:text-primary-400 mr-2">•</span>
            Make sure your microphone is working before starting a conversation
          </li>
          <li className="flex items-start">
            <span className="text-primary-600 dark:text-primary-400 mr-2">•</span>
            If someone is difficult to hear, politely ask them to speak up
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;