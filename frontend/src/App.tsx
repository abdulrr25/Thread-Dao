import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider, useAuth } from './context/AuthContext';
import { WalletProvider } from './context/WalletContext';
import Sidebar from '@/components/Sidebar';
import Navigation from '@/components/Navigation';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Pages
import Home from '@/pages/Home';
import Profile from '@/pages/Profile';
import Chat from '@/pages/Chat';
import DAO from '@/pages/DAO';
import CreatePost from '@/pages/CreatePost';
import NotFound from '@/pages/NotFound';
import Login from './pages/Login';
import Landing from '@/pages/Landing';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Protected route component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
}

function AppContent() {
  return (
    <Router>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route
                path="/app/*"
                element={
                  <ProtectedRoute>
                    <div className="min-h-screen bg-background">
                      <Navigation />
                      <div className="flex">
                        <Sidebar />
                        <main className="flex-1 p-8">
                          <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/profile" element={<Profile />} />
                            <Route path="/chat" element={<Chat />} />
                            <Route path="/dao" element={<DAO />} />
                            <Route path="/create-post" element={<CreatePost />} />
                          </Routes>
                        </main>
                      </div>
                    </div>
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </QueryClientProvider>
      </ErrorBoundary>
    </Router>
  );
}

export default function App() {
  return (
    <WalletProvider>
      <AppContent />
      <Toaster />
    </WalletProvider>
  );
}