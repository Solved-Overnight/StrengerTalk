import { useState, useEffect } from 'react';
import { ref, onValue, query, orderByChild, equalTo } from 'firebase/database';
import { database } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';

interface User {
  uid: string;
  displayName: string;
  photoURL?: string;
  status: 'online' | 'busy' | 'offline';
  lastSeen: number;
}

export function useActiveUsers() {
  const { user } = useAuth();
  const [activeUsers, setActiveUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    // Listen to all users instead of filtering by status
    const usersRef = ref(database, 'users');
    
    const unsubscribe = onValue(usersRef, (snapshot) => {
      const users: User[] = [];
      snapshot.forEach((childSnapshot) => {
        const userData = childSnapshot.val();
        
        // Don't include current user and only include online users
        if (userData.uid !== user.uid && userData.status === 'online') {
          users.push(userData);
        }
      });
      
      setActiveUsers(users);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  return { activeUsers, loading };
}