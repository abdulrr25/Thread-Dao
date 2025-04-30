import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { WalletProvider } from '@/context/WalletContext';
import Landing from '@/pages/Landing';
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import DAO from '@/pages/DAO';
import CreateDAO from '@/pages/CreateDAO';
import MyDAOs from '@/pages/MyDAOs';
import NotFound from '@/pages/NotFound';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WalletProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/app" element={<Home />} />
            <Route path="/app/my-daos" element={<MyDAOs />} />
            <Route path="/app/create-dao" element={<CreateDAO />} />
            <Route path="/dao/:id" element={<DAO />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </Router>
      </WalletProvider>
    </QueryClientProvider>
  );
}

export default App;