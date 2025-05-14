import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  Auth, 
  User, 
  UserCredential, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut as authSignOut, 
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { auth } from '../lib/firebase';
import { ref, set, serverTimestamp } from 'firebase/database';
import { database } from '../lib/firebase';

interface AuthContextProps {
  auth: Auth;
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<UserCredential>;
  signUp: (email: string, password: string, displayName: string, photoURL?: string) => Promise<UserCredential>;
  signInWithGoogle: () => Promise<UserCredential>;
  signOut: () => Promise<void>;
  updateUserProfile: (displayName: string, photoURL?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      const userStatusRef = ref(database, `users/${user.uid}/status`);
      const userRef = ref(database, `users/${user.uid}`);
      
      set(userRef, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || 'Anonymous',
        photoURL: user.photoURL || '',
        lastSeen: serverTimestamp(),
        status: 'online'
      });

      const connectedRef = ref(database, '.info/connected');
      const handleConnection = (snapshot: any) => {
        if (snapshot.val() === true) {
          set(userStatusRef, 'offline');
        }
      };

      return () => {
        set(userStatusRef, 'offline');
      };
    }
  }, [user]);

  const signUp = async (email: string, password: string, displayName: string, photoURL?: string): Promise<UserCredential> => {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    
    if (credential.user) {
      await updateProfile(credential.user, { 
        displayName,
        photoURL: photoURL || ''
      });
    }
    
    return credential;
  };

  const signIn = (email: string, password: string): Promise<UserCredential> => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signInWithGoogle = async (): Promise<UserCredential> => {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  };

  const signOut = (): Promise<void> => {
    return authSignOut(auth);
  };

  const updateUserProfile = async (displayName: string, photoURL?: string): Promise<void> => {
    if (!user) throw new Error('No user logged in');
    
    const updates: { displayName: string; photoURL?: string } = { displayName };
    if (photoURL) updates.photoURL = photoURL;
    
    await updateProfile(user, updates);
    
    const userRef = ref(database, `users/${user.uid}`);
    await set(userRef, {
      displayName,
      photoURL: photoURL || user.photoURL,
      lastSeen: serverTimestamp(),
    }, { merge: true });
  };

  const value = {
    auth,
    user,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    updateUserProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};