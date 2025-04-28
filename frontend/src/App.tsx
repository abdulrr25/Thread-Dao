import { Toaster } from "./components/ui/toaster";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WalletProvider } from "./context/WalletContext";
import Index from "./pages/Index";
import Feed from "./pages/Feed";
import NotFound from "./pages/NotFound";
import Explore from "./pages/Explore";
import Notifications from "./pages/Notifications";
import SemanticSearch from "./pages/SemanticSearch";
import Profile from "./pages/Profile";
import DaoDetails from "./pages/DaoDetails";
import Chat from "./pages/Chat";
import CreateDao from "./pages/CreateDao";
import MyDAOs from "./pages/MyDAOs";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <WalletProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/feed" element={<Feed />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/semantic-search" element={<SemanticSearch />} />
            <Route path="/my-daos" element={<MyDAOs />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/dao/:id" element={<DaoDetails />} />
            <Route path="/chat/:id" element={<Chat />} />
            <Route path="/create-dao" element={<CreateDao />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </WalletProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;