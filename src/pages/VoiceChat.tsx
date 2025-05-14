import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, User, ThumbsUp, ThumbsDown, Flag, Mic } from 'lucide-react';
import { useVoiceChat } from '../hooks/useVoiceChat';
import VoiceControls from '../components/VoiceControls';
import AudioVisualizer from '../components/AudioVisualizer';
import LoadingScreen from '../components/LoadingScreen';

const VoiceChat = () => {
  const { chatId } = useParams<{ chatId: string }>();
  const [searchParams] = useSearchParams();
  const partnerId = searchParams.get('partner') || undefined;
  const navigate = useNavigate();
  
  const {
    localStream,
    remoteStream,
    isMuted,
    isConnecting,
    isConnected,
    error,
    partnerUser,
    audioLevel,
    toggleMute,
    endCall
  } = useVoiceChat(chatId || '', partnerId);

  const [callDuration, setCallDuration] = useState(0);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');

  // Timer for call duration
  useEffect(() => {
    let timer: number;
    
    if (isConnected) {
      timer = window.setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isConnected]);

  // Format duration as MM:SS
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndCall = () => {
    endCall();
    navigate('/dashboard');
  };

  const handleSubmitReport = () => {
    // Here you would implement the actual reporting logic
    console.log('Reporting user for:', reportReason);
    setShowReportModal(false);
    handleEndCall();
  };

  if (!chatId) {
    return <div>Invalid chat room</div>;
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto text-center py-12">
        <div className="bg-error-100 dark:bg-error-900 text-error-800 dark:text-error-200 p-6 rounded-lg mb-6">
          <h2 className="text-xl font-semibold mb-2">Connection Error</h2>
          <p>{error}</p>
        </div>
        <button 
          onClick={() => navigate('/dashboard')} 
          className="btn-primary"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  if (isConnecting) {
    return (
      <div className="max-w-md mx-auto text-center py-12">
        <div className="mb-6">
          <div className="w-20 h-20 mx-auto rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center mb-4">
            <Mic className="w-10 h-10 text-primary-600 dark:text-primary-400 animate-pulse" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
            Connecting...
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Setting up your voice connection
          </p>
        </div>
        <button 
          onClick={handleEndCall} 
          className="btn-outline"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button 
          onClick={handleEndCall}
          className="flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
        >
          <ArrowLeft className="w-5 h-5 mr-1" />
          <span>Back</span>
        </button>
        
        <div className="bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 px-3 py-1 rounded-full text-sm">
          {isConnected ? `Call duration: ${formatDuration(callDuration)}` : 'Waiting for connection...'}
        </div>
        
        <button 
          onClick={() => setShowReportModal(true)}
          className="flex items-center text-error-600 hover:text-error-700 dark:text-error-400 dark:hover:text-error-300"
          aria-label="Report user"
        >
          <Flag className="w-5 h-5" />
        </button>
      </div>

      {/* Main chat area */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden mb-8">
        <div className="p-6">
          <div className="flex items-center justify-center">
            <div className="text-center">
              {partnerUser ? (
                <div className="mb-6">
                  {partnerUser.photoURL ? (
                    <img 
                      src={partnerUser.photoURL} 
                      alt={partnerUser.displayName} 
                      className="w-24 h-24 rounded-full mx-auto border-4 border-primary-500 dark:border-primary-400" 
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full mx-auto bg-gray-200 dark:bg-gray-700 flex items-center justify-center border-4 border-primary-500 dark:border-primary-400">
                      <User className="w-12 h-12 text-gray-500 dark:text-gray-400" />
                    </div>
                  )}
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-4">
                    {partnerUser.displayName}
                  </h2>
                </div>
              ) : (
                <div className="animate-pulse mb-6">
                  <div className="w-24 h-24 rounded-full mx-auto bg-gray-200 dark:bg-gray-700 mb-4"></div>
                  <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded mx-auto"></div>
                </div>
              )}
              
              <div className="mt-8 mb-12">
                <AudioVisualizer 
                  audioLevel={audioLevel} 
                  isSpeaking={isConnected && !isMuted} 
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Controls */}
        <div className="bg-gray-50 dark:bg-gray-900 px-6 py-8 flex justify-center">
          <VoiceControls 
            isMuted={isMuted} 
            toggleMute={toggleMute} 
            endCall={handleEndCall} 
          />
        </div>
      </div>
      
      {/* Quick actions */}
      <div className="flex justify-center space-x-6">
        <button className="flex flex-col items-center text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400">
          <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-full mb-2">
            <ThumbsUp className="w-5 h-5" />
          </div>
          <span className="text-sm">Like</span>
        </button>
        
        <button className="flex flex-col items-center text-gray-600 hover:text-error-600 dark:text-gray-300 dark:hover:text-error-400">
          <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-full mb-2">
            <ThumbsDown className="w-5 h-5" />
          </div>
          <span className="text-sm">Dislike</span>
        </button>
      </div>
      
      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Report User
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Please select a reason for reporting this user:
            </p>
            
            <div className="space-y-2 mb-6">
              {['Inappropriate behavior', 'Offensive language', 'Harassment', 'Other'].map((reason) => (
                <label key={reason} className="flex items-center">
                  <input
                    type="radio"
                    name="reportReason"
                    value={reason}
                    checked={reportReason === reason}
                    onChange={() => setReportReason(reason)}
                    className="mr-2"
                  />
                  <span className="text-gray-700 dark:text-gray-300">{reason}</span>
                </label>
              ))}
              
              {reportReason === 'Other' && (
                <textarea
                  placeholder="Please describe the issue..."
                  className="input mt-2"
                  rows={3}
                ></textarea>
              )}
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowReportModal(false)}
                className="btn-outline flex-1"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitReport}
                disabled={!reportReason}
                className="btn-error flex-1"
              >
                Submit Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VoiceChat;