import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Camera, Save } from 'lucide-react';

const Profile = () => {
  const { user, updateUserProfile } = useAuth();
  
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      await updateUserProfile(displayName);
      setSuccess('Profile updated successfully');
      setIsEditing(false);
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
        <div className="p-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Your Profile</h1>
          
          {error && (
            <div className="bg-error-100 dark:bg-error-900 text-error-800 dark:text-error-200 p-4 rounded-lg mb-6">
              {error}
            </div>
          )}
          
          {success && (
            <div className="bg-success-100 dark:bg-success-900 text-success-800 dark:text-success-200 p-4 rounded-lg mb-6">
              {success}
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row gap-8">
            {/* Profile Picture */}
            <div className="flex flex-col items-center">
              <div className="relative">
                {user?.photoURL ? (
                  <img 
                    src={user.photoURL} 
                    alt="Profile" 
                    className="w-32 h-32 rounded-full border-4 border-primary-500 dark:border-primary-400" 
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center border-4 border-primary-500 dark:border-primary-400">
                    <span className="text-4xl text-gray-500 dark:text-gray-400">
                      {user?.displayName?.charAt(0) || user?.email?.charAt(0) || '?'}
                    </span>
                  </div>
                )}
                
                <button 
                  className="absolute bottom-0 right-0 bg-white dark:bg-gray-800 rounded-full p-2 shadow-md border border-gray-200 dark:border-gray-700"
                  disabled={true} // Photo upload not implemented in this MVP
                >
                  <Camera className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                </button>
              </div>
              
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
                {user?.email}
              </p>
              
              <div className="badge-primary mt-4">
                Active User
              </div>
            </div>
            
            {/* Profile Form */}
            <div className="flex-1">
              <form onSubmit={handleUpdateProfile}>
                <div className="mb-6">
                  <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Display Name
                  </label>
                  
                  {isEditing ? (
                    <input
                      id="displayName"
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="input"
                      required
                    />
                  ) : (
                    <div 
                      className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-900 rounded-lg"
                      onClick={() => setIsEditing(true)}
                    >
                      <span>{user?.displayName || 'No display name set'}</span>
                      <button 
                        type="button"
                        className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                        onClick={() => setIsEditing(true)}
                      >
                        Edit
                      </button>
                    </div>
                  )}
                </div>
                
                {isEditing && (
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false);
                        setDisplayName(user?.displayName || '');
                      }}
                      className="btn-outline"
                      disabled={loading}
                    >
                      Cancel
                    </button>
                    
                    <button
                      type="submit"
                      className="btn-primary"
                      disabled={loading}
                    >
                      {loading ? (
                        <span>Saving...</span>
                      ) : (
                        <span className="flex items-center">
                          <Save className="w-4 h-4 mr-2" />
                          Save Changes
                        </span>
                      )}
                    </button>
                  </div>
                )}
              </form>
              
              <div className="border-t border-gray-200 dark:border-gray-700 mt-8 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Account Statistics
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Total Conversations</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">0</p>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Positive Ratings</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">0</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;