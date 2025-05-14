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

    const activeUsersRef = query(
      ref(database, 'users'),
      orderByChild('status'),
      equalTo('online')
    );

    const unsubscribe = onValue(activeUsersRef, (snapshot) => {
      const users: User[] = [];
      snapshot.forEach((childSnapshot) => {
        const userData = childSnapshot.val();
        
        // Don't include current user
        if (userData.uid !== user.uid) {
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