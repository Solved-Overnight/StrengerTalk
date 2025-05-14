import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthState } from './hooks/useAuthState';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import VoiceChat from './pages/VoiceChat';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

// Components
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import LoadingScreen from './components/LoadingScreen';

function App() {
  const { user, loading } = useAuthState();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Public routes */}
        <Route index element={<Landing />} />
        <Route path="login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="signup" element={user ? <Navigate to="/dashboard" /> : <Signup />} />
        
        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="chat/:chatId" element={<VoiceChat />} />
          <Route path="profile" element={<Profile />} />
        </Route>
        
        {/* Catch-all route */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;