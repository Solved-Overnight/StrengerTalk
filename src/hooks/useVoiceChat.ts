import { useState, useEffect, useRef } from 'react';
import SimplePeer from 'simple-peer';
import { ref, onValue, set, remove, get, onDisconnect } from 'firebase/database';
import { database } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';

interface PeerSignal {
  type: string;
  sdp?: string;
  candidate?: RTCIceCandidate;
}

interface ChatUser {
  uid: string;
  displayName: string;
  photoURL?: string;
}

export function useVoiceChat(chatId: string, partnerId?: string) {
  const { user } = useAuth();
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isConnecting, setIsConnecting] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [partnerUser, setPartnerUser] = useState<ChatUser | null>(null);
  const [audioLevel, setAudioLevel] = useState(0);
  
  const peerRef = useRef<SimplePeer.Instance | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  
  // Get user media for local audio
  useEffect(() => {
    async function getMedia() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
        setLocalStream(stream);
        localStreamRef.current = stream;
      } catch (err) {
        console.error('Failed to get user media', err);
        setError('Could not access microphone. Please check permissions.');
      }
    }
    
    getMedia();
    
    return () => {
      // Clean up local stream when component unmounts
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);
  
  // Audio level detection for visualization
  useEffect(() => {
    if (!localStream) return;
    
    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();
    const microphone = audioContext.createMediaStreamSource(localStream);
    const javascriptNode = audioContext.createScriptProcessor(2048, 1, 1);
    
    analyser.smoothingTimeConstant = 0.8;
    analyser.fftSize = 1024;
    
    microphone.connect(analyser);
    analyser.connect(javascriptNode);
    javascriptNode.connect(audioContext.destination);
    
    javascriptNode.onaudioprocess = () => {
      const array = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(array);
      let values = 0;
      
      const length = array.length;
      for (let i = 0; i < length; i++) {
        values += array[i];
      }
      
      const average = values / length;
      setAudioLevel(average);
    };
    
    return () => {
      javascriptNode.disconnect();
      analyser.disconnect();
      microphone.disconnect();
      if (audioContext.state !== 'closed') {
        audioContext.close();
      }
    };
  }, [localStream]);

  // Initialize signaling and WebRTC connection
  useEffect(() => {
    if (!user || !localStream || !chatId) return;
    
    const chatRef = ref(database, `chats/${chatId}`);
    const mySignalRef = ref(database, `chats/${chatId}/signals/${user.uid}`);
    
    // Create WebRTC peer connection
    const initiator = !partnerId;
    
    peerRef.current = new SimplePeer({
      initiator,
      stream: localStream,
      trickle: true
    });
    
    // Set up event handlers for peer connection
    peerRef.current.on('signal', (data: PeerSignal) => {
      // Send signal data to the other peer
      set(mySignalRef, JSON.stringify(data));
    });
    
    peerRef.current.on('connect', () => {
      console.log('Peer connection established');
      setIsConnected(true);
      setIsConnecting(false);
    });
    
    peerRef.current.on('stream', (stream: MediaStream) => {
      console.log('Received remote stream');
      setRemoteStream(stream);
    });
    
    peerRef.current.on('error', (err: Error) => {
      console.error('Peer connection error:', err);
      setError('Connection error: ' + err.message);
      setIsConnecting(false);
    });
    
    peerRef.current.on('close', () => {
      console.log('Peer connection closed');
      setIsConnected(false);
    });
    
    // Update chat status in Firebase
    set(ref(database, `chats/${chatId}/users/${user.uid}`), {
      connected: true,
      timestamp: new Date().toISOString()
    });
    
    // Set up cleanup on disconnect
    onDisconnect(ref(database, `chats/${chatId}/users/${user.uid}`))
      .update({ connected: false, timestamp: new Date().toISOString() });
    
    // Listen for partner signals
    let partnerUid = '';
    
    if (partnerId) {
      partnerUid = partnerId;
      listenToPartnerSignals(partnerId);
      fetchPartnerInfo(partnerId);
    } else {
      // If initiator, wait for someone to join
      const usersRef = ref(database, `chats/${chatId}/users`);
      onValue(usersRef, (snapshot) => {
        const users = snapshot.val() || {};
        const userIds = Object.keys(users).filter(id => id !== user.uid);
        
        if (userIds.length > 0 && !partnerUid) {
          partnerUid = userIds[0];
          listenToPartnerSignals(partnerUid);
          fetchPartnerInfo(partnerUid);
        }
      });
    }
    
    function listenToPartnerSignals(uid: string) {
      const partnerSignalRef = ref(database, `chats/${chatId}/signals/${uid}`);
      onValue(partnerSignalRef, (snapshot) => {
        const signalData = snapshot.val();
        if (signalData && peerRef.current) {
          try {
            const signal = JSON.parse(signalData);
            peerRef.current.signal(signal);
          } catch (err) {
            console.error('Error parsing signal data:', err);
          }
        }
      });
    }
    
    async function fetchPartnerInfo(uid: string) {
      const userRef = ref(database, `users/${uid}`);
      const snapshot = await get(userRef);
      if (snapshot.exists()) {
        setPartnerUser(snapshot.val() as ChatUser);
      }
    }
    
    // Clean up when component unmounts
    return () => {
      if (peerRef.current) {
        peerRef.current.destroy();
      }
      
      // Remove signals and mark user as disconnected
      remove(mySignalRef);
      set(ref(database, `chats/${chatId}/users/${user.uid}`), {
        connected: false,
        timestamp: new Date().toISOString()
      });
    };
  }, [chatId, localStream, partnerId, user]);
  
  // Mute/unmute functionality
  useEffect(() => {
    if (!localStream) return;
    
    localStream.getAudioTracks().forEach(track => {
      track.enabled = !isMuted;
    });
  }, [isMuted, localStream]);
  
  // Function to toggle mute state
  const toggleMute = () => {
    setIsMuted(prev => !prev);
  };
  
  // Function to end the call
  const endCall = () => {
    if (peerRef.current) {
      peerRef.current.destroy();
    }
    
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
    }
    
    // Clean up in Firebase
    if (user && chatId) {
      const mySignalRef = ref(database, `chats/${chatId}/signals/${user.uid}`);
      remove(mySignalRef);
      set(ref(database, `chats/${chatId}/users/${user.uid}`), {
        connected: false,
        timestamp: new Date().toISOString()
      });
    }
  };
  
  return {
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
  };
}