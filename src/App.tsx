import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import Home from './pages/Home.tsx';
import Profile from './pages/Profile.tsx';
import Explore from './pages/Explore.tsx';
import Login from './pages/Login.tsx';
import Navbar from './components/Navbar.tsx';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="bg-black h-screen flex items-center justify-center text-white">Loading...</div>;
  return user ? <>{children}</> : <Navigate to="/login" />;
};

function AppRoutes() {
  const { user } = useAuth();

  return (
    <div className="bg-black text-white min-h-screen pb-16">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
        <Route path="/profile/:id" element={<PrivateRoute><Profile /></PrivateRoute>} />
      </Routes>
      <Navbar />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}
