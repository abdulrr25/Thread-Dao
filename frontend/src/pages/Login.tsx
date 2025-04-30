import { useAuth } from '../context/AuthContext';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Loader2, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Login() {
  const { connect, isLoading, user } = useAuth();
  const { connected } = useWallet();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/app');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-[#0A0A0A] to-[#0A0A0A]" />
      
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500/30 rounded-full filter blur-3xl animate-blob" />
        <div className="absolute top-40 right-20 w-72 h-72 bg-blue-500/30 rounded-full filter blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-500/30 rounded-full filter blur-3xl animate-blob animation-delay-4000" />
      </div>

      <div className="relative min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md"
        >
          <button
            onClick={() => navigate('/')}
            className="mb-8 flex items-center text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </button>

          <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-8 shadow-2xl">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 mb-2">
                Welcome Back
              </h2>
              <p className="text-gray-400">
                Connect your wallet to access ThreadDAO
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex justify-center">
                <div className="wallet-adapter-button-trigger">
                  <WalletMultiButton />
                </div>
              </div>
              
              {connected && (
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={connect}
                  disabled={isLoading}
                  className="w-full flex justify-center items-center py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    'Sign Message to Connect'
                  )}
                </motion.button>
              )}
            </div>

            <div className="mt-8 text-center text-sm text-gray-500">
              By connecting your wallet, you agree to our Terms of Service and Privacy Policy
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 