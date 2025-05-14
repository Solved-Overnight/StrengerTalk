import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Camera, Upload } from 'lucide-react';

const PRESET_AVATARS = [
  'https://images.pexels.com/photos/2269872/pexels-photo-2269872.jpeg?auto=compress&w=256',
  'https://images.pexels.com/photos/2773977/pexels-photo-2773977.jpeg?auto=compress&w=256',
  'https://images.pexels.com/photos/2531553/pexels-photo-2531553.jpeg?auto=compress&w=256',
  'https://images.pexels.com/photos/2743754/pexels-photo-2743754.jpeg?auto=compress&w=256',
  'https://images.pexels.com/photos/2787341/pexels-photo-2787341.jpeg?auto=compress&w=256',
  'https://images.pexels.com/photos/2746187/pexels-photo-2746187.jpeg?auto=compress&w=256',
];

const Signup = () => {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('');
  const [customAvatar, setCustomAvatar] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { signUp, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCustomAvatar(e.target.files[0]);
      setSelectedAvatar('');
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (!displayName.trim()) {
      setError('Display name is required');
      return;
    }
    
    if (!selectedAvatar && !customAvatar) {
      setError('Please select an avatar');
      return;
    }
    
    setLoading(true);

    try {
      // Use selected avatar or upload custom avatar
      const photoURL = selectedAvatar || (customAvatar ? URL.createObjectURL(customAvatar) : '');
      await signUp(email, password, displayName, photoURL);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'An error occurred during sign up');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setError(null);
    setLoading(true);

    try {
      await signInWithGoogle();
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'An error occurred during Google sign up');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-secondary-500">
          Join VoiceConnect
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Create your account and start connecting with voices worldwide
        </p>
      </div>

      {error && (
        <div className="bg-error-100 dark:bg-error-900 text-error-800 dark:text-error-200 p-4 rounded-lg mb-6 backdrop-blur-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white/80 dark:bg-gray-800/80 p-6 rounded-2xl shadow-xl backdrop-blur-sm border border-gray-200 dark:border-gray-700">
          <form onSubmit={handleSignup} className="space-y-6">
            <div>
              <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Display Name
              </label>
              <input
                id="displayName"
                type="text"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Choose a display name"
                className="input"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="input"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
                className="input"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                className="input"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex justify-center py-2.5"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6">
              <button
                type="button"
                onClick={handleGoogleSignup}
                disabled={loading}
                className="w-full flex justify-center items-center py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 mr-2">
                  <path
                    fill="currentColor"
                    d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032 s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2 C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
                  />
                </svg>
                Google
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white/80 dark:bg-gray-800/80 p-6 rounded-2xl shadow-xl backdrop-blur-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Choose Your Avatar
          </h3>
          
          <div className="grid grid-cols-3 gap-4 mb-6">
            {PRESET_AVATARS.map((avatar, index) => (
              <button
                key={index}
                onClick={() => {
                  setSelectedAvatar(avatar);
                  setCustomAvatar(null);
                }}
                className={`relative aspect-square rounded-xl overflow-hidden transition-all duration-200 ${
                  selectedAvatar === avatar 
                    ? 'ring-4 ring-primary-500 dark:ring-primary-400 scale-105' 
                    : 'hover:scale-105'
                }`}
              >
                <img 
                  src={avatar} 
                  alt={`Avatar ${index + 1}`} 
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Or upload your own avatar
            </p>
            <label className="btn-outline inline-flex items-center cursor-pointer">
              <Upload className="w-4 h-4 mr-2" />
              Upload Image
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
            {customAvatar && (
              <div className="mt-4">
                <div className="relative w-32 h-32 mx-auto rounded-xl overflow-hidden">
                  <img
                    src={URL.createObjectURL(customAvatar)}
                    alt="Custom avatar preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
        Already have an account?{' '}
        <Link to="/login" className="text-primary-600 hover:text-primary-500 dark:text-primary-400 font-medium">
          Sign in
        </Link>
      </p>
    </div>
  );
};

export default Signup;