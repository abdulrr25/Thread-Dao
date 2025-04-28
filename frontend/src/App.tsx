import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { WalletProvider } from '@/context/WalletContext';
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

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <WalletProvider>
          <Router>
            <div className="flex min-h-screen">
              <Sidebar />
              <div className="flex-1">
                <Navigation />
                <main className="container mx-auto p-4">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/profile/:address" element={<Profile />} />
                    <Route path="/chat" element={<Chat />} />
                    <Route path="/dao/:id" element={<DAO />} />
                    <Route path="/create-post" element={<CreatePost />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
              </div>
            </div>
            <Toaster />
          </Router>
        </WalletProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;