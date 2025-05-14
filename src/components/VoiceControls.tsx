import React from 'react';
import { Mic, MicOff, PhoneOff } from 'lucide-react';

interface VoiceControlsProps {
  isMuted: boolean;
  toggleMute: () => void;
  endCall: () => void;
}

const VoiceControls = ({ isMuted, toggleMute, endCall }: VoiceControlsProps) => {
  return (
    <div className="flex items-center justify-center space-x-6 bg-white dark:bg-gray-800 p-4 rounded-full shadow-md">
      <button
        onClick={toggleMute}
        className={`p-4 rounded-full ${
          isMuted
            ? 'bg-gray-300 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
            : 'bg-primary-500 text-white dark:bg-primary-600'
        } hover:opacity-90 transition-colors duration-200`}
        aria-label={isMuted ? 'Unmute' : 'Mute'}
      >
        {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
      </button>
      
      <button
        onClick={endCall}
        className="p-4 rounded-full bg-error-500 text-white hover:bg-error-600 transition-colors duration-200"
        aria-label="End call"
      >
        <PhoneOff className="w-6 h-6" />
      </button>
    </div>
  );
};

export default VoiceControls;