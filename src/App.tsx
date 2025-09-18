import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/SupabaseAuthContext';
import { DataProvider } from './context/SupabaseDataContext';
import { LoginForm } from './components/LoginForm';
import { Header } from './components/Layout/Header';
import { Sidebar } from './components/Layout/Sidebar';

function AppContent() {
  const { isAuthenticated, user, loading } = useAuth();
  const [activeView, setActiveView] = useState('projects');

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Update active view when user changes
  React.useEffect(() => {
    if (user?.role) {
    }
  }, [user]);
}

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <AppContent />
      </DataProvider>
    </AuthProvider>
  );
}