import { useState, useEffect, useRef } from 'react';
import SimplePeer from 'simple-peer';
import { ref, onValue, set, remove, get, onDisconnect, push } from 'firebase/database';
import { database } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { v4 as uuidv4 } from 'uuid';

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

interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: number;
}

export function useVoiceChat(chatId: string, partnerId?: string) {
  const { user } = useAuth();
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(false);
  const [isConnecting, setIsConnecting] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [partnerUser, setPartnerUser] = useState<ChatUser | null>(null);
  const [audioLevel, setAudioLevel] = useState(0);
  const [messages, setMessages] = useState<Message[]>([]);
  
  const peerRef = useRef<SimplePeer.Instance | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    async function getMedia() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          audio: true,
          video: true 
        });
        
        // Start with video disabled
        stream.getVideoTracks().forEach(track => {
          track.enabled = false;
        });
        
        setLocalStream(stream);
        localStreamRef.current = stream;
        initializePeerConnection(stream);
      } catch (err) {
        console.error('Failed to get media devices', err);
        setError('Could not access camera/microphone. Please check permissions.');
        setIsConnecting(false);
      }
    }
    
    getMedia();
    
    return () => {
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Listen for messages
  useEffect(() => {
    if (!chatId) return;

    const messagesRef = ref(database, `chats/${chatId}/messages`);
    const unsubscribe = onValue(messagesRef, (snapshot) => {
      const messagesData = snapshot.val();
      if (messagesData) {
        const messagesList = Object.values(messagesData) as Message[];
        setMessages(messagesList.sort((a, b) => a.timestamp - b.timestamp));
      }
    });

    return () => unsubscribe();
  }, [chatId]);

  const initializePeerConnection = (stream: MediaStream) => {
    if (!user || !chatId) return;

    const chatRef = ref(database, `chats/${chatId}`);
    const mySignalRef = ref(database, `chats/${chatId}/signals/${user.uid}`);
    
    try {
      peerRef.current = new SimplePeer({
        initiator: !partnerId,
        stream,
        trickle: true,
        config: {
          iceServers: [
            { 
              urls: [
                'stun:stun1.l.google.com:19302',
                'stun:stun2.l.google.com:19302',
                'stun:stun3.l.google.com:19302',
                'stun:stun4.l.google.com:19302'
              ]
            }
          ]
        }
      });

      peerRef.current.on('signal', (data: PeerSignal) => {
        set(mySignalRef, JSON.stringify(data));
      });

      peerRef.current.on('connect', () => {
        setIsConnected(true);
        setIsConnecting(false);
        setError(null);
      });

      peerRef.current.on('stream', (remoteStream: MediaStream) => {
        setRemoteStream(remoteStream);
      });

      peerRef.current.on('error', (err: Error) => {
        console.error('Peer connection error:', err);
        setError('Connection error. Please try again.');
        setIsConnecting(false);
      });

      peerRef.current.on('close', () => {
        setIsConnected(false);
        setError('Connection closed');
      });

      // Listen for partner signals
      if (partnerId) {
        listenToPartnerSignals(partnerId);
        fetchPartnerInfo(partnerId);
      } else {
        const usersRef = ref(database, `chats/${chatId}/users`);
        onValue(usersRef, (snapshot) => {
          const users = snapshot.val() || {};
          const userIds = Object.keys(users).filter(id => id !== user.uid);
          
          if (userIds.length > 0) {
            listenToPartnerSignals(userIds[0]);
            fetchPartnerInfo(userIds[0]);
          }
        });
      }

      // Update presence
      set(ref(database, `chats/${chatId}/users/${user.uid}`), {
        connected: true,
        timestamp: Date.now()
      });

      onDisconnect(ref(database, `chats/${chatId}/users/${user.uid}`))
        .update({ connected: false, timestamp: Date.now() });

    } catch (err) {
      console.error('Failed to initialize peer connection:', err);
      setError('Failed to initialize connection. Please refresh and try again.');
      setIsConnecting(false);
    }
  };

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

  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(!isVideoEnabled);
      }
    }
  };

  const toggleMute = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach(track => {
        track.enabled = isMuted;
      });
      setIsMuted(!isMuted);
    }
  };

  const sendMessage = async (text: string) => {
    if (!user || !chatId || !text.trim()) return;

    const messageRef = push(ref(database, `chats/${chatId}/messages`));
    const message: Message = {
      id: uuidv4(),
      senderId: user.uid,
      text: text.trim(),
      timestamp: Date.now()
    };

    await set(messageRef, message);
  };

  const endCall = () => {
    if (peerRef.current) {
      peerRef.current.destroy();
    }

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
    }

    if (user && chatId) {
      remove(ref(database, `chats/${chatId}/signals/${user.uid}`));
      set(ref(database, `chats/${chatId}/users/${user.uid}`), {
        connected: false,
        timestamp: Date.now()
      });
    }
  };

  return {
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
  };
}