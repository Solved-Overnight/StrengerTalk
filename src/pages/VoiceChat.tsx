import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, User, ThumbsUp, ThumbsDown, Flag, Mic, Video, VideoOff, Send } from 'lucide-react';
import { useVoiceChat } from '../hooks/useVoiceChat';
import VoiceControls from '../components/VoiceControls';
import AudioVisualizer from '../components/AudioVisualizer';

const VoiceChat = () => {
  const { chatId } = useParams<{ chatId: string }>();
  const [searchParams] = useSearchParams();
  const partnerId = searchParams.get('partner') || undefined;
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  const {
    localStream,
    remoteStream,
    isMuted,
    isVideoEnabled,
    isConnecting,
    isConnected,
    error,
    partnerUser,
    audioLevel,
    messages,
    toggleMute,
    toggleVideo,
    sendMessage,
    endCall
  } = useVoiceChat(chatId || '', partnerId);

  const [callDuration, setCallDuration] = useState(0);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

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

  useEffect(() => {
    if (localStream && localVideoRef.current) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    if (remoteStream && remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

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
    console.log('Reporting user for:', reportReason);
    setShowReportModal(false);
    handleEndCall();
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      sendMessage(message);
      setMessage('');
    }
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
            Setting up your connection
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
    <div className="max-w-5xl mx-auto">
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

      <div className="grid grid-cols-3 gap-6">
        {/* Video and Controls */}
        <div className="col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden mb-6">
            <div className="relative aspect-video bg-gray-900">
              {remoteStream && (
                <video
                  ref={remoteVideoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
              )}
              
              {/* Local video preview */}
              <div className="absolute bottom-4 right-4 w-1/4 aspect-video bg-gray-800 rounded-lg overflow-hidden">
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="p-4">
              <AudioVisualizer 
                audioLevel={audioLevel} 
                isSpeaking={isConnected && !isMuted} 
              />
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 p-4 flex justify-center space-x-4">
              <VoiceControls 
                isMuted={isMuted} 
                toggleMute={toggleMute}
                endCall={handleEndCall}
              />
              <button
                onClick={toggleVideo}
                className={`p-4 rounded-full ${
                  isVideoEnabled
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-300 text-gray-700'
                }`}
              >
                {isVideoEnabled ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
              </button>
            </div>
          </div>

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
        </div>

        {/* Chat */}
        <div className="col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg h-[600px] flex flex-col">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Chat
              </h3>
            </div>

            <div 
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto p-4 space-y-4"
            >
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.senderId === partnerUser?.uid ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-2 ${
                      msg.senderId === partnerUser?.uid
                        ? 'bg-gray-100 dark:bg-gray-700'
                        : 'bg-primary-500 text-white'
                    }`}
                  >
                    <p className="text-sm">{msg.text}</p>
                    <span className="text-xs opacity-70">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="input flex-1"
                />
                <button
                  type="submit"
                  disabled={!message.trim()}
                  className="btn-primary p-2"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      
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